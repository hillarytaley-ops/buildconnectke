-- Create secure provider access logging table
CREATE TABLE IF NOT EXISTS public.provider_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  viewer_user_id UUID REFERENCES auth.users(id),
  viewed_provider_id UUID NOT NULL,
  access_type TEXT NOT NULL,
  accessed_fields TEXT[] DEFAULT ARRAY[]::TEXT[],
  ip_address INET,
  user_agent TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_justification TEXT
);

-- Enable RLS on provider access log
ALTER TABLE public.provider_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view access logs
CREATE POLICY "Admin can view provider access logs" 
ON public.provider_access_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Function to check if user can access provider contact info
CREATE OR REPLACE FUNCTION public.can_access_provider_contact(provider_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    LEFT JOIN delivery_requests dr ON dr.builder_id = p.id
    LEFT JOIN delivery_providers dp_own ON dp_own.user_id = p.id
    WHERE p.user_id = auth.uid() 
    AND (
      p.role = 'admin' OR
      dp_own.id = provider_uuid OR  -- Provider can see their own info
      EXISTS (
        SELECT 1 FROM delivery_requests dr2 
        WHERE dr2.provider_id = provider_uuid 
        AND dr2.builder_id = p.id 
        AND dr2.status IN ('accepted', 'in_progress', 'completed')
      )
    )
  );
$$;

-- Function to log provider access
CREATE OR REPLACE FUNCTION public.log_provider_access(
  provider_uuid UUID, 
  access_type_param TEXT, 
  fields_accessed TEXT[] DEFAULT ARRAY[]::TEXT[],
  justification TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO provider_access_log (
    viewer_user_id, 
    viewed_provider_id, 
    access_type, 
    accessed_fields,
    business_justification
  )
  VALUES (
    auth.uid(), 
    provider_uuid, 
    access_type_param, 
    fields_accessed,
    justification
  );
EXCEPTION WHEN OTHERS THEN
  NULL; -- Don't fail transaction on logging errors
END;
$$;

-- Secure function to get provider information with access control
CREATE OR REPLACE FUNCTION public.get_secure_provider_info(provider_uuid UUID)
RETURNS TABLE(
  id UUID,
  provider_name TEXT,
  provider_type TEXT,
  vehicle_types TEXT[],
  service_areas TEXT[],
  capacity_kg NUMERIC,
  is_verified BOOLEAN,
  is_active BOOLEAN,
  rating NUMERIC,
  total_deliveries INTEGER,
  -- Conditional contact information
  can_view_contact BOOLEAN,
  phone TEXT,
  email TEXT,
  address TEXT,
  hourly_rate NUMERIC,
  per_km_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  can_access_contact BOOLEAN;
  provider_record delivery_providers%ROWTYPE;
BEGIN
  -- Get the provider record
  SELECT * INTO provider_record 
  FROM delivery_providers 
  WHERE delivery_providers.id = provider_uuid;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Check if user can access contact information
  SELECT public.can_access_provider_contact(provider_uuid) INTO can_access_contact;
  
  -- Log contact access if sensitive fields are being viewed
  IF can_access_contact THEN
    PERFORM public.log_provider_access(
      provider_uuid, 
      'contact_info_access', 
      ARRAY['phone', 'email', 'address', 'rates'],
      'Authorized business contact access'
    );
  ELSE
    PERFORM public.log_provider_access(
      provider_uuid, 
      'public_info_view', 
      ARRAY['name', 'rating', 'verification_status'],
      'Public provider information view'
    );
  END IF;
  
  -- Return data with conditional contact information
  RETURN QUERY SELECT
    provider_record.id,
    provider_record.provider_name,
    provider_record.provider_type,
    provider_record.vehicle_types,
    provider_record.service_areas,
    provider_record.capacity_kg,
    provider_record.is_verified,
    provider_record.is_active,
    provider_record.rating,
    provider_record.total_deliveries,
    can_access_contact,
    CASE WHEN can_access_contact THEN provider_record.phone ELSE 'Contact via platform' END,
    CASE WHEN can_access_contact THEN provider_record.email ELSE NULL END,
    CASE WHEN can_access_contact THEN provider_record.address ELSE 'Location available to authorized parties' END,
    CASE WHEN can_access_contact THEN provider_record.hourly_rate ELSE NULL END,
    CASE WHEN can_access_contact THEN provider_record.per_km_rate ELSE NULL END;
END;
$$;

-- Update the delivery_providers_public table RLS to be more restrictive
DROP POLICY IF EXISTS "Users can view providers for active requests only" ON public.delivery_providers_public;

CREATE POLICY "Minimal provider info for builders and active requests" 
ON public.delivery_providers_public 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND is_active = true 
  AND is_verified = true 
  AND (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() 
      AND p.role = 'builder'
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() 
      AND p.role = 'admin'
    )
  )
);

-- Create more restrictive policy for delivery_providers table
DROP POLICY IF EXISTS "Admins can view all delivery provider profiles" ON public.delivery_providers;

CREATE POLICY "Secure provider profile access" 
ON public.delivery_providers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid() 
    AND (
      p.role = 'admin' OR
      p.id = delivery_providers.user_id OR -- Provider can see their own profile
      EXISTS (
        SELECT 1 FROM delivery_requests dr 
        WHERE dr.provider_id = delivery_providers.id 
        AND dr.builder_id = p.id 
        AND dr.status IN ('accepted', 'in_progress', 'completed')
      )
    )
  )
);