import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentProvider {
  id: string;
  name: string;
  type: 'mobile_money' | 'bank' | 'card' | 'digital_wallet';
  enabled: boolean;
  config: any;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  provider: string;
  phoneNumber?: string;
  reference: string;
  description: string;
}

export const usePaymentIntegrations = () => {
  const [providers] = useState<PaymentProvider[]>([
    {
      id: 'mpesa',
      name: 'M-Pesa',
      type: 'mobile_money',
      enabled: true,
      config: {
        shortcode: '174379',
        passkey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
      }
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      type: 'mobile_money',
      enabled: true,
      config: {}
    },
    {
      id: 'equity_bank',
      name: 'Equity Bank',
      type: 'bank',
      enabled: true,
      config: {}
    },
    {
      id: 'kcb',
      name: 'KCB Bank',
      type: 'bank',
      enabled: true,
      config: {}
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'digital_wallet',
      enabled: true,
      config: {}
    }
  ]);

  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  const processPayment = useCallback(async (request: PaymentRequest) => {
    try {
      const provider = providers.find(p => p.id === request.provider);
      if (!provider) {
        throw new Error('Payment provider not found');
      }

      // Create payment record
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          amount: request.amount,
          currency: request.currency,
          provider: request.provider,
          phone_number: request.phoneNumber,
          reference: request.reference,
          description: request.description,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Process based on provider type
      let result;
      switch (provider.type) {
        case 'mobile_money':
          result = await processMobileMoneyPayment(provider, request, payment.id);
          break;
        case 'bank':
          result = await processBankPayment(provider, request, payment.id);
          break;
        case 'digital_wallet':
          result = await processDigitalWalletPayment(provider, request, payment.id);
          break;
        default:
          throw new Error('Unsupported payment provider type');
      }

      // Update payment status
      await supabase
        .from('payments')
        .update({
          status: result.success ? 'completed' : 'failed',
          transaction_id: result.transactionId,
          provider_response: result.response
        })
        .eq('id', payment.id);

      return result;

    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }, [providers]);

  const processMobileMoneyPayment = async (provider: PaymentProvider, request: PaymentRequest, paymentId: string) => {
    // Simulate M-Pesa STK Push
    if (provider.id === 'mpesa') {
      return await simulateMpesaPayment(request, paymentId);
    }
    
    // Simulate Airtel Money
    if (provider.id === 'airtel_money') {
      return await simulateAirtelMoneyPayment(request, paymentId);
    }

    throw new Error('Mobile money provider not implemented');
  };

  const processBankPayment = async (provider: PaymentProvider, request: PaymentRequest, paymentId: string) => {
    // Simulate bank transfer
    return {
      success: Math.random() > 0.1, // 90% success rate
      transactionId: `BNK_${Date.now()}`,
      response: {
        bankCode: provider.id,
        accountNumber: '****1234',
        transferMode: 'instant'
      }
    };
  };

  const processDigitalWalletPayment = async (provider: PaymentProvider, request: PaymentRequest, paymentId: string) => {
    // Simulate digital wallet payment
    return {
      success: Math.random() > 0.05, // 95% success rate
      transactionId: `DW_${Date.now()}`,
      response: {
        walletType: provider.id,
        confirmationCode: Math.random().toString(36).substr(2, 9).toUpperCase()
      }
    };
  };

  const simulateMpesaPayment = async (request: PaymentRequest, paymentId: string) => {
    // Simulate M-Pesa STK Push
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.15; // 85% success rate
        resolve({
          success,
          transactionId: success ? `MP${Date.now()}` : null,
          response: {
            merchantRequestID: `mer_${Date.now()}`,
            checkoutRequestID: `ws_CO_${Date.now()}`,
            responseCode: success ? '0' : '1',
            responseDescription: success ? 'Success' : 'Payment failed',
            customerMessage: success ? 'Payment successful' : 'Payment was declined'
          }
        });
      }, 3000); // 3 second delay to simulate processing
    });
  };

  const simulateAirtelMoneyPayment = async (request: PaymentRequest, paymentId: string) => {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        resolve({
          success,
          transactionId: success ? `AM${Date.now()}` : null,
          response: {
            transactionId: success ? `AM${Date.now()}` : null,
            status: success ? 'SUCCESS' : 'FAILED',
            message: success ? 'Transaction successful' : 'Insufficient balance'
          }
        });
      }, 2000);
    });
  };

  const getPaymentHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentHistory(data || []);
      return data;
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      return [];
    }
  }, []);

  const validatePayment = useCallback(async (transactionId: string) => {
    try {
      // Call payment provider API to validate transaction
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Payment validation failed:', error);
      return null;
    }
  }, []);

  return {
    providers,
    paymentHistory,
    processPayment,
    getPaymentHistory,
    validatePayment
  };
};