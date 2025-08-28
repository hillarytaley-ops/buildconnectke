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
  const { toast } = useToast();

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use secure function instead of direct table query
      const { data, error: fetchError } = await supabase
        .rpc('get_secure_supplier_data');
      
      if (fetchError) throw fetchError;
      
      let filteredSuppliers = data || [];
      
      // Apply client-side filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredSuppliers = filteredSuppliers.filter(supplier => 
          supplier.company_name.toLowerCase().includes(searchLower) ||
          supplier.specialties.some(s => s.toLowerCase().includes(searchLower)) ||
          supplier.materials_offered.some(m => m.toLowerCase().includes(searchLower))
        );
      }

      if (filters.category && filters.category !== 'All Categories') {
        filteredSuppliers = filteredSuppliers.filter(supplier =>
          supplier.specialties.includes(filters.category)
        );
      }

      if (filters.rating > 0) {
        filteredSuppliers = filteredSuppliers.filter(supplier =>
          supplier.rating >= filters.rating
        );
      }

      if (filters.verified !== null) {
        filteredSuppliers = filteredSuppliers.filter(supplier =>
          supplier.is_verified === filters.verified
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);
      
      setSuppliers(paginatedSuppliers);
      setTotalCount(filteredSuppliers.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suppliers';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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