import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecureDeliveryData {
  id: string;
  tracking_number: string;
  material_type: string;
  quantity: number;
  weight_kg?: number;
  pickup_address: string;
  delivery_address: string;
  status: string;
  pickup_date?: string;
  delivery_date?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  vehicle_details?: string;
  notes?: string;
  builder_id: string;
  supplier_id?: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
  // Secure driver information
  can_view_driver_contact: boolean;
  driver_display_name: string;
  driver_contact_info?: string;
  security_message: string;
}

interface SafeDeliveryListing {
  id: string;
  tracking_number: string;
  material_type: string;
  quantity: number;
  status: string;
  pickup_date?: string;
  delivery_date?: string;
  estimated_delivery_time?: string;
  created_at: string;
  builder_id: string;
  supplier_id?: string;
  has_driver_assigned: boolean;
  general_location: string;
  can_request_driver_contact: boolean;
}

interface UseSecureDeliveriesResult {
  deliveries: SafeDeliveryListing[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  getSecureDeliveryInfo: (deliveryId: string) => Promise<SecureDeliveryData | null>;
  logDriverContactAccess: (deliveryId: string, justification: string) => Promise<void>;
}

export const useSecureDeliveries = (): UseSecureDeliveriesResult => {
  const [deliveries, setDeliveries] = useState<SafeDeliveryListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchDeliveries = async () => {
      try {
        setLoading(true);
        
        // Check authentication status
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          setUserRole(profile?.role || null);

          // Use enhanced secure delivery listings function
          const { data, error: fetchError } = await supabase
            .rpc('get_secure_delivery_listings');

          if (fetchError) {
            throw fetchError;
          }

          setDeliveries(data || []);
        } else {
          setDeliveries([]);
        }
      } catch (err) {
        console.error('Error fetching secure deliveries:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch deliveries');
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchDeliveries();
  }, []);

  const getSecureDeliveryInfo = async (deliveryId: string): Promise<SecureDeliveryData | null> => {
    try {
      // Use enhanced secure function that properly protects driver data
      const { data, error } = await supabase
        .rpc('get_delivery_with_secure_driver_info', { delivery_uuid: deliveryId });

      if (error) {
        console.error('Error fetching secure delivery info:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (err) {
      console.error('Error in getSecureDeliveryInfo:', err);
      return null;
    }
  };

  const logDriverContactAccess = async (deliveryId: string, justification: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get delivery status for logging
      const { data: delivery } = await supabase
        .from('deliveries')
        .select('status')
        .eq('id', deliveryId)
        .single();

      // Log the access attempt
      const { error } = await supabase
        .from('driver_contact_access_log')
        .insert([{
          user_id: user.id,
          delivery_id: deliveryId,
          access_type: 'driver_contact_requested',
          delivery_status: delivery?.status,
          user_role: userRole,
          authorized: true,
          business_justification: justification
        }]);

      if (error) {
        console.error('Error logging driver contact access:', error);
      }
    } catch (err) {
      console.error('Error in logDriverContactAccess:', err);
    }
  };

  return {
    deliveries,
    loading,
    error,
    isAuthenticated,
    userRole,
    getSecureDeliveryInfo,
    logDriverContactAccess
  };
};