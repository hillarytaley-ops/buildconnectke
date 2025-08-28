import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProviderRotationRequest {
  request_id: string;
  rejected_provider_id: string;
  rejection_reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { request_id, rejected_provider_id, rejection_reason }: ProviderRotationRequest = await req.json();

    console.log('Processing provider rejection for request:', request_id, 'provider:', rejected_provider_id);

    // Call the database function to handle rejection
    const { data: rotationResult, error: rotationError } = await supabaseClient
      .rpc('handle_provider_rejection', {
        _request_id: request_id,
        _provider_id: rejected_provider_id
      });

    if (rotationError) {
      console.error('Error handling provider rejection:', rotationError);
      throw rotationError;
    }

    console.log('Rotation result:', rotationResult);

    // Get updated request status
    const { data: requestData, error: requestError } = await supabaseClient
      .from('delivery_requests')
      .select(`
        *,
        delivery_provider_queue!inner(
          provider_id,
          queue_position,
          status,
          delivery_providers(provider_name)
        )
      `)
      .eq('id', request_id)
      .single();

    if (requestError) {
      console.error('Error fetching updated request:', requestError);
    }

    let message = '';
    let next_provider = null;

    if (rotationResult) {
      // Successfully rotated to next provider
      const nextProviderInQueue = requestData?.delivery_provider_queue?.find(
        (q: any) => q.status === 'contacted'
      );

      if (nextProviderInQueue) {
        next_provider = {
          provider_id: nextProviderInQueue.provider_id,
          provider_name: nextProviderInQueue.delivery_providers?.provider_name || 'Unknown Provider',
          queue_position: nextProviderInQueue.queue_position
        };
        message = `Request automatically rotated to next provider: ${next_provider.provider_name}`;
      } else {
        message = 'Request rotated to next provider';
      }

      // Notify the next provider via background task
      EdgeRuntime.waitUntil(notifyNextProvider(supabaseClient, request_id, next_provider?.provider_id));

    } else {
      // No more providers available or rotation failed
      if (requestData?.status === 'rotation_failed') {
        message = 'All providers have been attempted. Request rotation completed.';
      } else if (requestData?.status === 'no_providers_available') {
        message = 'No more providers available for this request.';
      } else {
        message = 'Provider rotation could not continue.';
      }
    }

    // Log the rotation activity
    await supabaseClient
      .from('delivery_communications')
      .insert({
        delivery_request_id: request_id,
        sender_id: 'system',
        sender_type: 'system',
        sender_name: 'Auto-Rotation System',
        message_type: 'provider_rotation',
        content: `Provider rejected request. ${message} ${rejection_reason ? `Reason: ${rejection_reason}` : ''}`,
        metadata: {
          rotation_successful: rotationResult,
          rejected_provider_id,
          next_provider,
          rejection_reason
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        rotation_successful: rotationResult,
        message,
        next_provider,
        request_status: requestData?.status,
        attempted_providers_count: requestData?.attempted_providers?.length || 0
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in auto-rotate-provider function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to rotate to next provider'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      }
    );
  }
};

// Background task to notify the next provider
async function notifyNextProvider(supabaseClient: any, requestId: string, providerId?: string) {
  if (!providerId) return;

  try {
    console.log('Notifying next provider:', providerId, 'for request:', requestId);

    // Get request details for notification
    const { data: requestData } = await supabaseClient
      .from('delivery_requests')
      .select(`
        *,
        profiles!delivery_requests_builder_id_fkey(full_name)
      `)
      .eq('id', requestId)
      .single();

    if (!requestData) return;

    // Get provider details
    const { data: providerData } = await supabaseClient
      .from('delivery_providers')
      .select('user_id, provider_name')
      .eq('id', providerId)
      .single();

    if (!providerData) return;

    // Create notification for the provider
    await supabaseClient
      .from('delivery_communications')
      .insert({
        delivery_request_id: requestId,
        sender_id: requestData.builder_id,
        sender_type: 'builder',
        sender_name: requestData.profiles?.full_name || 'Builder',
        message_type: 'delivery_request_available',
        content: `New delivery opportunity available! Material: ${requestData.material_type}, Quantity: ${requestData.quantity}. This request was automatically assigned to you after previous provider declined.`,
        metadata: {
          pickup_address: requestData.pickup_address,
          delivery_address: requestData.delivery_address,
          material_type: requestData.material_type,
          quantity: requestData.quantity,
          budget_range: requestData.budget_range,
          auto_rotated: true,
          original_request_id: requestId
        }
      });

    console.log('Successfully notified next provider');

  } catch (error) {
    console.error('Error notifying next provider:', error);
  }
}

serve(handler);