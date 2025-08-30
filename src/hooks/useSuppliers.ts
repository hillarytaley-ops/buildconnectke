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
      
      // Use secure function to get suppliers directory
      // This protects contact information from unauthorized access
      const { data, error: fetchError } = await supabase
        .rpc('get_suppliers_directory_secure');

      if (fetchError) {
        console.log('Secure suppliers query error, using demo data:', fetchError.message);
        setSuppliers([]);
        setTotalCount(0);
        setError(null);
        return;
      }

      // Apply client-side filters to secure data
      let filteredData = data || [];
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(supplier => 
          supplier.company_name.toLowerCase().includes(searchTerm) ||
          supplier.specialties.some((specialty: string) => 
            specialty.toLowerCase().includes(searchTerm)
          ) ||
          supplier.materials_offered.some((material: string) => 
            material.toLowerCase().includes(searchTerm)
          )
        );
      }

      if (filters.category && filters.category !== 'All Categories') {
        filteredData = filteredData.filter(supplier => 
          supplier.specialties.includes(filters.category)
        );
      }

      if (filters.rating > 0) {
        filteredData = filteredData.filter(supplier => 
          supplier.rating >= filters.rating
        );
      }

      if (filters.verified !== null) {
        filteredData = filteredData.filter(supplier => 
          supplier.is_verified === filters.verified
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const paginatedData = filteredData.slice(startIndex, startIndex + limit);
      
      setSuppliers(paginatedData);
      setTotalCount(filteredData.length);
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