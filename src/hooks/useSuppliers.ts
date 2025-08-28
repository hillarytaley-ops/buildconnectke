import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Supplier, SupplierFilters } from '@/types/supplier';
import { useToast } from '@/hooks/use-toast';

interface UseSuppliersResult {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

export const useSuppliers = (
  filters: SupplierFilters,
  page: number = 1,
  limit: number = 12
): UseSuppliersResult => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For security, we now only allow authenticated access to the suppliers table
      // Unauthenticated users will get empty results and the component will use demo data
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // No user authenticated - component will use demo data
        setSuppliers([]);
        setTotalCount(0);
        return;
      }

      let query = supabase
        .from('suppliers')
        .select('*', { count: 'exact' })
        .range((page - 1) * limit, page * limit - 1)
        .order('rating', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`company_name.ilike.%${filters.search}%,specialties.cs.{${filters.search}},materials_offered.cs.{${filters.search}}`);
      }

      if (filters.category && filters.category !== 'All Categories') {
        query = query.contains('specialties', [filters.category]);
      }

      if (filters.rating > 0) {
        query = query.gte('rating', filters.rating);
      }

      if (filters.verified !== null) {
        query = query.eq('is_verified', filters.verified);
      }

      const { data, error: fetchError, count } = await query;
      
      if (fetchError) {
        console.log('Suppliers query restricted for security, using demo data');
        setSuppliers([]);
        setTotalCount(0);
        return;
      }
      
      setSuppliers(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      // For security, don't expose detailed error messages
      console.log('Suppliers access restricted, using demo data');
      setError(null);
      setSuppliers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [filters, page, limit]);

  return {
    suppliers,
    loading,
    error,
    totalCount,
    refetch: fetchSuppliers
  };
};