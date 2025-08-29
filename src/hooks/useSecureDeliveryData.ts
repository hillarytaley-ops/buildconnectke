import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecureDeliveryData {
  id: string;
  tracking_number: string;
  material_type: string;
  quantity: number;
  status: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  created_at: string;
  updated_at: string;
  // Conditionally included sensitive data
  pickup_address?: string;
  delivery_address?: string;
  driver_name?: string;
  driver_phone?: string;
  budget_range?: string;
  can_view_addresses: boolean;
  can_view_contact: boolean;
  can_view_financial: boolean;
}

export const useSecureDeliveryData = () => {
  const [deliveries, setDeliveries] = useState<SecureDeliveryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSecureDeliveries();
  }, []);

  const fetchSecureDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user role first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_professional, user_type')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('User profile not found');
      }

      setUserRole(profile.role);

      // Use secure function to get deliveries with appropriate data filtering
      const { data, error } = await supabase.rpc('get_user_deliveries');

      if (error) {
        throw error;
      }

      // Transform data to include access control flags
      const secureDeliveries = (data || []).map((delivery: any) => ({
        ...delivery,
        // Sensitive data access control
        pickup_address: delivery.can_view_locations ? delivery.pickup_address : 'Address available to authorized parties',
        delivery_address: delivery.can_view_locations ? delivery.delivery_address : 'Address available to authorized parties',
        driver_name: delivery.can_view_driver_contact ? delivery.driver_name : 'Driver assigned',
        driver_phone: delivery.can_view_driver_contact ? delivery.driver_phone : null,
        budget_range: profile.role === 'admin' ? delivery.budget_range : null, // Financial data only for admins
      }));

      setDeliveries(secureDeliveries);
    } catch (err: any) {
      console.error('Error fetching secure deliveries:', err);
      setError(err.message || 'Failed to fetch delivery data');
      toast({
        variant: "destructive",
        title: "Access Error",
        description: "Unable to load delivery data. Please check your permissions."
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      if (userRole !== 'supplier' && userRole !== 'admin') {
        throw new Error('Insufficient permissions to update delivery status');
      }

      const { error } = await supabase
        .from('deliveries')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', deliveryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery status updated successfully"
      });

      // Refresh data
      await fetchSecureDeliveries();
    } catch (err: any) {
      console.error('Error updating delivery status:', err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Failed to update delivery status"
      });
    }
  };

  const createDeliveryRequest = async (requestData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Validate required fields
      if (!requestData.material_type || !requestData.pickup_address || !requestData.delivery_address) {
        throw new Error('Missing required fields');
      }

      const { error } = await supabase
        .from('delivery_requests')
        .insert({
          builder_id: profile.id,
          ...requestData,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery request submitted successfully"
      });

      // Refresh data
      await fetchSecureDeliveries();
    } catch (err: any) {
      console.error('Error creating delivery request:', err);
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: err.message || "Failed to create delivery request"
      });
      throw err;
    }
  };

  return {
    deliveries,
    loading,
    error,
    userRole,
    refetch: fetchSecureDeliveries,
    updateDeliveryStatus,
    createDeliveryRequest
  };
};