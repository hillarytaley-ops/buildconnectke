import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecureSupplier {
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
}

export const useSecureSuppliers = () => {
  const [suppliers, setSuppliers] = useState<SecureSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchSecureSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication status
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        // For authenticated users, try to get suppliers with contact info
        const { data: secureSuppliers, error: secureError } = await supabase
          .from('suppliers')
          .select('*')
          .order('rating', { ascending: false });

        if (secureError) {
          throw secureError;
        }

        // Transform data to include contact access status
        const transformedSuppliers = (secureSuppliers || []).map(supplier => ({
          ...supplier,
          can_view_contact: true, // Will be determined by RLS policies
        }));

        setSuppliers(transformedSuppliers);
      } else {
        // For public users, use the public directory function
        const { data: publicSuppliers, error: publicError } = await supabase
          .rpc('get_suppliers_directory');

        if (publicError) {
          throw publicError;
        }

        setSuppliers(publicSuppliers || []);
      }
    } catch (err) {
      console.error('Error fetching secure suppliers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const getSupplierWithContact = async (supplierId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_supplier_with_contact', { supplier_id: supplierId });

      if (error) {
        throw error;
      }

      return data?.[0] || null;
    } catch (err) {
      console.error('Error fetching supplier contact:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchSecureSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    isAuthenticated,
    refetch: fetchSecureSuppliers,
    getSupplierWithContact,
  };
};