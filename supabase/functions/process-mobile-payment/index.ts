import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  amount: number;
  currency: string;
  provider: string;
  phoneNumber?: string;
  reference: string;
  description: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const paymentRequest: PaymentRequest = await req.json();

    // Process payment based on provider
    let result;
    switch (paymentRequest.provider) {
      case 'mpesa':
        result = await processMpesaPayment(paymentRequest);
        break;
      case 'airtel_money':
        result = await processAirtelMoneyPayment(paymentRequest);
        break;
      case 'equity_bank':
      case 'kcb':
        result = await processBankPayment(paymentRequest);
        break;
      default:
        throw new Error('Unsupported payment provider');
    }

    // Save payment record
    const { error: insertError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        provider: paymentRequest.provider,
        phone_number: paymentRequest.phoneNumber,
        reference: paymentRequest.reference,
        description: paymentRequest.description,
        status: result.success ? 'completed' : 'failed',
        transaction_id: result.transactionId,
        provider_response: result.response
      });

    if (insertError) throw insertError;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function processMpesaPayment(request: PaymentRequest) {
  // Simulate M-Pesa STK Push integration
  // In production, integrate with Safaricom M-Pesa API
  return {
    success: Math.random() > 0.15, // 85% success rate
    transactionId: `MP${Date.now()}`,
    response: {
      merchantRequestID: `mer_${Date.now()}`,
      checkoutRequestID: `ws_CO_${Date.now()}`,
      responseCode: '0',
      responseDescription: 'Success',
      customerMessage: 'Payment request sent to your phone'
    }
  };
}

async function processAirtelMoneyPayment(request: PaymentRequest) {
  // Simulate Airtel Money integration
  return {
    success: Math.random() > 0.2, // 80% success rate
    transactionId: `AM${Date.now()}`,
    response: {
      transactionId: `AM${Date.now()}`,
      status: 'SUCCESS',
      message: 'Payment processed successfully'
    }
  };
}

async function processBankPayment(request: PaymentRequest) {
  // Simulate bank integration
  return {
    success: Math.random() > 0.1, // 90% success rate
    transactionId: `BNK_${Date.now()}`,
    response: {
      bankReference: `REF${Date.now()}`,
      status: 'COMPLETED',
      accountNumber: '****1234'
    }
  };
}