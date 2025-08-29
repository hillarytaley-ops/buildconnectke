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
      
      // Use the business transparency function for authenticated users
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // No user authenticated - component will use demo data
        setSuppliers([]);
        setTotalCount(0);
        return;
      }

      // Use the secure business info function
      const { data: businessSuppliers, error: businessError } = await supabase
        .rpc('get_supplier_business_info');

      if (businessError) {
        console.log('Business suppliers query failed, using demo data');
        setSuppliers([]);
        setTotalCount(0);
        return;
      }

      let filteredSuppliers = businessSuppliers || [];

      // Apply client-side filters for better UX
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredSuppliers = filteredSuppliers.filter((supplier: any) => 
          supplier.company_name?.toLowerCase().includes(searchLower) ||
          supplier.specialties?.some((s: string) => s.toLowerCase().includes(searchLower)) ||
          supplier.materials_offered?.some((m: string) => m.toLowerCase().includes(searchLower))
        );
      }

      if (filters.category && filters.category !== 'All Categories') {
        filteredSuppliers = filteredSuppliers.filter((supplier: any) =>
          supplier.specialties?.includes(filters.category)
        );
      }

      if (filters.rating > 0) {
        filteredSuppliers = filteredSuppliers.filter((supplier: any) => 
          supplier.rating >= filters.rating
        );
      }

      if (filters.verified !== null) {
        filteredSuppliers = filteredSuppliers.filter((supplier: any) => 
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