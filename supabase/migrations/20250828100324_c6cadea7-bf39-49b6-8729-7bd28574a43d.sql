-- Add provider rotation tracking to delivery requests
ALTER TABLE public.delivery_requests 
ADD COLUMN IF NOT EXISTS attempted_providers UUID[] DEFAULT ARRAY[]::UUID[],
ADD COLUMN IF NOT EXISTS auto_rotation_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS rotation_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS max_rotation_attempts INTEGER DEFAULT 5;

-- Create provider queue for automatic rotation
CREATE TABLE IF NOT EXISTS public.delivery_provider_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES delivery_requests(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES delivery_providers(id) ON DELETE CASCADE,
  queue_position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, contacted, rejected, accepted, timeout
  contacted_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  timeout_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 minutes'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(request_id, provider_id)
);

-- Enable RLS on provider queue
ALTER TABLE public.delivery_provider_queue ENABLE ROW LEVEL SECURITY;

-- Policy for provider queue access
CREATE POLICY "Users can view relevant provider queue entries" 
ON public.delivery_provider_queue 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM delivery_requests dr
    JOIN profiles p ON p.user_id = auth.uid()
    LEFT JOIN delivery_providers dp ON dp.user_id = p.id
    WHERE dr.id = delivery_provider_queue.request_id 
    AND (
      p.role = 'admin' OR
      p.id = dr.builder_id OR
      dp.id = delivery_provider_queue.provider_id
    )
  )
);

-- Function to get nearby providers in order of distance/priority
CREATE OR REPLACE FUNCTION public.get_provider_rotation_queue(
  _request_id UUID,
  _pickup_lat NUMERIC,
  _pickup_lng NUMERIC,
  _max_providers INTEGER DEFAULT 10
)
RETURNS TABLE(
  provider_id UUID,
  provider_name TEXT,
  distance_km NUMERIC,
  rating NUMERIC,
  priority_score NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dp.id,
    dp.provider_name,
    -- Simple distance calculation (replace with PostGIS for accuracy)
    SQRT(
      POWER(69.1 * (_pickup_lat - COALESCE(dp.current_latitude, 0)), 2) +
      POWER(69.1 * (_pickup_lng - COALESCE(dp.current_longitude, 0)) * COS(_pickup_lat / 57.3), 2)
    ) as distance,
    dp.rating,
    -- Priority score: rating * 0.7 + (1/distance) * 0.3
    (dp.rating * 0.7 + (1 / GREATEST(1, SQRT(
      POWER(69.1 * (_pickup_lat - COALESCE(dp.current_latitude, 0)), 2) +
      POWER(69.1 * (_pickup_lng - COALESCE(dp.current_longitude, 0)) * COS(_pickup_lat / 57.3), 2)
    ))) * 0.3) as priority
  FROM delivery_providers dp
  WHERE dp.is_active = true 
    AND dp.is_verified = true
    AND dp.id NOT IN (
      SELECT unnest(attempted_providers) 
      FROM delivery_requests 
      WHERE id = _request_id
    )
    AND SQRT(
      POWER(69.1 * (_pickup_lat - COALESCE(dp.current_latitude, 0)), 2) +
      POWER(69.1 * (_pickup_lng - COALESCE(dp.current_longitude, 0)) * COS(_pickup_lat / 57.3), 2)
    ) <= 50 -- Within 50km radius
  ORDER BY priority DESC, distance ASC
  LIMIT _max_providers;
END;
$$;

-- Function to setup provider rotation queue
CREATE OR REPLACE FUNCTION public.setup_provider_rotation_queue(_request_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _request_record delivery_requests%ROWTYPE;
  _provider_record RECORD;
  _queue_position INTEGER := 1;
  _inserted_count INTEGER := 0;
BEGIN
  -- Get request details
  SELECT * INTO _request_record
  FROM delivery_requests
  WHERE id = _request_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found';
  END IF;
  
  -- Clear existing queue for this request
  DELETE FROM delivery_provider_queue WHERE request_id = _request_id;
  
  -- Get ordered list of providers and create queue
  FOR _provider_record IN 
    SELECT * FROM get_provider_rotation_queue(
      _request_id,
      _request_record.pickup_latitude,
      _request_record.pickup_longitude,
      10
    )
  LOOP
    INSERT INTO delivery_provider_queue (
      request_id,
      provider_id,
      queue_position,
      status,
      timeout_at
    ) VALUES (
      _request_id,
      _provider_record.provider_id,
      _queue_position,
      'pending',
      NOW() + INTERVAL '30 minutes'
    );
    
    _queue_position := _queue_position + 1;
    _inserted_count := _inserted_count + 1;
  END LOOP;
  
  RETURN _inserted_count;
END;
$$;

-- Function to handle provider rejection and auto-rotate
CREATE OR REPLACE FUNCTION public.handle_provider_rejection(_request_id UUID, _provider_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _next_provider_id UUID;
  _current_attempts INTEGER;
  _max_attempts INTEGER;
BEGIN
  -- Update current provider status to rejected
  UPDATE delivery_provider_queue
  SET 
    status = 'rejected',
    responded_at = NOW(),
    updated_at = NOW()
  WHERE request_id = _request_id 
    AND provider_id = _provider_id;
  
  -- Add to attempted providers list
  UPDATE delivery_requests
  SET 
    attempted_providers = array_append(attempted_providers, _provider_id),
    updated_at = NOW()
  WHERE id = _request_id;
  
  -- Get current attempt count and max attempts
  SELECT 
    array_length(attempted_providers, 1), 
    max_rotation_attempts
  INTO _current_attempts, _max_attempts
  FROM delivery_requests
  WHERE id = _request_id;
  
  -- Check if we've exceeded max attempts
  IF _current_attempts >= _max_attempts THEN
    UPDATE delivery_requests
    SET 
      status = 'rotation_failed',
      rotation_completed_at = NOW(),
      updated_at = NOW()
    WHERE id = _request_id;
    
    RETURN FALSE;
  END IF;
  
  -- Find next provider in queue
  SELECT provider_id INTO _next_provider_id
  FROM delivery_provider_queue
  WHERE request_id = _request_id
    AND status = 'pending'
    AND timeout_at > NOW()
  ORDER BY queue_position ASC
  LIMIT 1;
  
  IF _next_provider_id IS NOT NULL THEN
    -- Update next provider status to contacted
    UPDATE delivery_provider_queue
    SET 
      status = 'contacted',
      contacted_at = NOW(),
      updated_at = NOW()
    WHERE request_id = _request_id 
      AND provider_id = _next_provider_id;
    
    -- Update request to show next provider
    UPDATE delivery_requests
    SET 
      provider_id = NULL, -- Clear current provider
      status = 'pending',
      updated_at = NOW()
    WHERE id = _request_id;
    
    RETURN TRUE;
  ELSE
    -- No more providers available
    UPDATE delivery_requests
    SET 
      status = 'no_providers_available',
      rotation_completed_at = NOW(),
      updated_at = NOW()
    WHERE id = _request_id;
    
    RETURN FALSE;
  END IF;
END;
$$;

-- Trigger to automatically setup queue when request is created
CREATE OR REPLACE FUNCTION public.auto_setup_provider_queue()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only setup queue for new requests with auto_rotation enabled
  IF NEW.auto_rotation_enabled = true AND 
     NEW.pickup_latitude IS NOT NULL AND 
     NEW.pickup_longitude IS NOT NULL THEN
    
    -- Setup provider queue in background
    PERFORM setup_provider_rotation_queue(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic queue setup
DROP TRIGGER IF EXISTS trigger_auto_setup_provider_queue ON delivery_requests;
CREATE TRIGGER trigger_auto_setup_provider_queue
  AFTER INSERT ON delivery_requests
  FOR EACH ROW
  EXECUTE FUNCTION auto_setup_provider_queue();