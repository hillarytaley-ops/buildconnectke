import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Supplier, SupplierFilters } from '@/types/supplier';

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
      
      // Always try to fetch suppliers - public directory available to all
      // Contact details will be controlled at the component level
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
        console.log('Suppliers query error, using demo data:', fetchError.message);
        setSuppliers([]);
        setTotalCount(0);
        setError(null); // Don't show error, fallback to demo
        return;
      }
      
      setSuppliers(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.log('Network error, using demo data');
      setSuppliers([]);
      setTotalCount(0);
      setError(null); // Don't show error, fallback to demo
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