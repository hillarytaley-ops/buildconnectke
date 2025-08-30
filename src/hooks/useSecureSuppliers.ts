import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecureSupplierData {
  id: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  specialties: string[];
  materials_offered: string[];
  rating: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  can_view_contact?: boolean;
  contact_access_reason?: string;
  contact_info_status?: string;
  business_verified?: boolean;
}

interface UseSecureSuppliersResult {
  suppliers: SecureSupplierData[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  getSupplierWithContact: (supplierId: string) => Promise<SecureSupplierData | null>;
}

export const useSecureSuppliers = (): UseSecureSuppliersResult => {
  const [suppliers, setSuppliers] = useState<SecureSupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchSuppliers = async () => {
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
        }

        // Fetch suppliers using enhanced secure directory function
        const { data, error: fetchError } = await supabase
          .rpc('get_secure_suppliers_directory');

        if (fetchError) {
          throw fetchError;
        }

        setSuppliers(data || []);
      } catch (err) {
        console.error('Error fetching secure suppliers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
        setSuppliers([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchSuppliers();
  }, []);

  const getSupplierWithContact = async (supplierId: string): Promise<SecureSupplierData | null> => {
    try {
      // Use enhanced secure contact access function
      const { data, error } = await supabase
        .rpc('get_supplier_with_secure_contact', { supplier_uuid: supplierId });

      if (error) {
        console.error('Error fetching supplier contact:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (err) {
      console.error('Error in getSupplierWithContact:', err);
      return null;
    }
  };

  return {
    suppliers,
    loading,
    error,
    isAuthenticated,
    userRole,
    getSupplierWithContact
  };
};