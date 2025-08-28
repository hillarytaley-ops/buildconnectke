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

// Function to filter sensitive supplier information based on user role
const filterSupplierData = (supplier: Supplier, userRole: string | null, isAdmin: boolean): Supplier => {
  // If user is admin, return all data
  if (isAdmin) {
    return supplier;
  }

  // For non-admin users, hide sensitive contact information
  return {
    ...supplier,
    phone: userRole ? 'Contact via platform' : undefined,
    email: userRole ? 'Available after connection' : undefined,
    address: supplier.address ? 'Location available to verified users' : undefined,
    contact_person: userRole ? 'Contact available' : undefined
  };
};

export const useSuppliers = (
  filters: SupplierFilters,
  page: number = 1,
  limit: number = 12
): UseSuppliersResult => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check user role for data filtering
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          if (profile) {
            setUserRole(profile.role);
            setIsAdmin(profile.role === 'admin');
          }
        }
      } catch (err) {
        console.log('No user authenticated, showing public data only');
      }
    };

    checkUserRole();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use secure function instead of direct table query
      let query = supabase.rpc('get_secure_supplier_data')
        .select('*', { count: 'exact' })
        .range((page - 1) * limit, page * limit - 1)
        .order('rating', { ascending: false });

      // Apply filters (note: filters work on the already-secure data)
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
        console.log('Secure function call failed, using demo data fallback');
        throw fetchError;
      }
      
      // Data is already filtered by the secure function based on user role
      setSuppliers(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suppliers';
      setError(errorMessage);
      // Don't show toast error for security reasons - just use demo data
      console.log('Using demo data due to:', errorMessage);
      
      // Fallback to empty array - the component will use demo data
      setSuppliers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [filters, page, limit, userRole, isAdmin]);

  return {
    suppliers,
    loading,
    error,
    totalCount,
    refetch: fetchSuppliers
  };
};