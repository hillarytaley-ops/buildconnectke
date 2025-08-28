-- Create secure functions for supplier information access
CREATE OR REPLACE FUNCTION public.can_access_supplier_contact(supplier_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    LEFT JOIN purchase_orders po ON po.buyer_id = p.id
    LEFT JOIN quotation_requests qr ON qr.requester_id = p.id
    LEFT JOIN delivery_requests dr ON dr.builder_id = p.id
    WHERE p.user_id = auth.uid() 
    AND (
      p.role = 'admin' OR
      po.supplier_id = supplier_uuid OR
      qr.supplier_id = supplier_uuid OR
      EXISTS (
        SELECT 1 FROM delivery_providers dp 
        WHERE dp.id = dr.provider_id AND dp.user_id = p.id
      )
    )
  );
$function$;

-- Create audit logging for supplier contact access
CREATE TABLE public.supplier_contact_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  supplier_id UUID REFERENCES public.suppliers(id),
  access_type TEXT NOT NULL,
  accessed_fields TEXT[] DEFAULT ARRAY[]::text[],
  accessed_at TIMESTAMPTZ DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on audit log
ALTER TABLE public.supplier_contact_access_log ENABLE ROW LEVEL SECURITY;

-- Admin can view all access logs
CREATE POLICY "Admins can view all supplier contact access logs"
ON public.supplier_contact_access_log
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Function to log supplier contact access
CREATE OR REPLACE FUNCTION public.log_supplier_contact_access(
  supplier_uuid uuid, 
  access_type_param text, 
  fields_accessed text[] DEFAULT ARRAY[]::text[]
)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO supplier_contact_access_log (
    user_id, 
    supplier_id, 
    access_type, 
    accessed_fields
  )
  VALUES (
    auth.uid(), 
    supplier_uuid, 
    access_type_param, 
    fields_accessed
  );
END;
$function$;

-- Create secure supplier view function
CREATE OR REPLACE FUNCTION public.get_secure_supplier_info(supplier_uuid uuid)
 RETURNS TABLE(
   id uuid,
   company_name text,
   specialties text[],
   materials_offered text[],
   rating numeric,
   is_verified boolean,
   created_at timestamptz,
   can_view_contact boolean,
   contact_person text,
   email text,
   phone text,
   address text
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  can_access_contact boolean;
  supplier_record suppliers%ROWTYPE;
BEGIN
  -- Get the supplier record
  SELECT * INTO supplier_record 
  FROM suppliers 
  WHERE suppliers.id = supplier_uuid;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Check if user can access contact information
  SELECT public.can_access_supplier_contact(supplier_uuid) INTO can_access_contact;
  
  -- Log contact access if sensitive fields are being viewed
  IF can_access_contact THEN
    PERFORM public.log_supplier_contact_access(
      supplier_uuid, 
      'contact_view', 
      ARRAY['contact_person', 'email', 'phone', 'address']
    );
  END IF;
  
  -- Return data with conditional contact information
  RETURN QUERY SELECT
    supplier_record.id,
    supplier_record.company_name,
    supplier_record.specialties,
    supplier_record.materials_offered,
    supplier_record.rating,
    supplier_record.is_verified,
    supplier_record.created_at,
    can_access_contact,
    CASE WHEN can_access_contact THEN supplier_record.contact_person ELSE 'Contact available to business partners' END,
    CASE WHEN can_access_contact THEN supplier_record.email ELSE NULL END,
    CASE WHEN can_access_contact THEN supplier_record.phone ELSE NULL END,
    CASE WHEN can_access_contact THEN supplier_record.address ELSE 'Location available to business partners' END;
END;
$function$;