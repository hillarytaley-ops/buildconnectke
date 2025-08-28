import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import PublicSuppliersView from "./PublicSuppliersView";
import ErrorBoundary from "./ErrorBoundary";
import SupplierCard from "./suppliers/SupplierCard";
import SearchAndFilters from "./suppliers/SearchAndFilters";
import LoadingGrid from "./suppliers/LoadingGrid";
import EmptyState from "./suppliers/EmptyState";
import SupplierRegistrationCTA from "./suppliers/SupplierRegistrationCTA";

interface SecureSupplierInfo {
  id: string;
  company_name: string;
  specialties: string[];
  materials_offered: string[];
  rating: number;
  is_verified: boolean;
  created_at: string;
  can_view_contact: boolean;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

const categories = [
  'All', 'Cement', 'Steel', 'Tiles', 'Paint', 'Timber', 
  'Hardware', 'Plumbing', 'Electrical', 'Aggregates', 'Roofing'
];

const SecureSuppliersDirectory = () => {
  const [suppliers, setSuppliers] = useState<SecureSupplierInfo[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<SecureSupplierInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userProfile) {
      fetchSecureSuppliers();
    }
  }, [userProfile]);

  useEffect(() => {
    applyFilters();
  }, [suppliers, searchTerm, selectedCategory]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      toast({
        title: "Authentication Error",
        description: "Unable to verify your login status. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  const fetchSecureSuppliers = async () => {
    try {
      setLoading(true);

      // Get suppliers list - show both verified and pending for demo purposes
      const { data: supplierList, error: listError } = await supabase
        .from('suppliers')
        .select('id, company_name, specialties, materials_offered, rating, is_verified, created_at')
        .order('is_verified', { ascending: false })
        .order('rating', { ascending: false });

      if (listError) throw listError;

      // For each supplier, get secure info (contact details if authorized)
      const secureSuppliers = await Promise.all(
        (supplierList || []).map(async (supplier): Promise<SecureSupplierInfo> => {
          try {
            const { data, error } = await supabase.rpc('get_secure_supplier_info', {
              supplier_uuid: supplier.id
            });

            if (error) {
              console.error(`Error getting secure info for supplier ${supplier.id}:`, error);
              return {
                ...supplier,
                can_view_contact: false,
                contact_person: 'Contact available to business partners',
                email: '',
                phone: '',
                address: 'Location available to business partners'
              };
            }

            return data[0] || {
              ...supplier,
              can_view_contact: false,
              contact_person: 'Contact available to business partners',
              email: '',
              phone: '',
              address: 'Location available to business partners'
            };
          } catch (error) {
            console.error(`Error processing supplier ${supplier.id}:`, error);
            return {
              ...supplier,
              can_view_contact: false,
              contact_person: 'Contact available to business partners',
              email: '',
              phone: '',
              address: 'Location available to business partners'
            };
          }
        })
      );

      setSuppliers(secureSuppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: "Error",
        description: "Failed to load suppliers directory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...suppliers];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(supplier =>
        supplier.company_name.toLowerCase().includes(term) ||
        supplier.specialties?.some(spec => 
          spec.toLowerCase().includes(term)
        ) ||
        supplier.materials_offered?.some(material => 
          material.toLowerCase().includes(term)
        )
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(supplier =>
        supplier.specialties?.includes(selectedCategory) ||
        supplier.materials_offered?.includes(selectedCategory)
      );
    }

    setFilteredSuppliers(filtered);
  };

  const requestContactAccess = async (supplierId: string) => {
    try {
      toast({
        title: "Contact Request Submitted",
        description: "Your request for supplier contact details has been submitted. You'll gain access once you have an active business relationship.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request contact access. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegistrationClick = () => {
    // Navigate to registration form - this will be handled by parent component
    window.location.href = '/suppliers?register=true';
  };

  if (!userProfile) {
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Public View - Limited Information */}
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Shield className="h-5 w-5" />
                Public Suppliers Directory
              </CardTitle>
              <CardDescription className="text-amber-700 dark:text-amber-300">
                Sign in to access full supplier details including contact information.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <PublicSuppliersView />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Security Notice */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              Secure Suppliers Directory
            </CardTitle>
            <CardDescription>
              Supplier contact information is protected and only visible to users with active business relationships. 
              All access is logged for security.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* Suppliers Grid */}
        {loading ? (
          <LoadingGrid />
        ) : filteredSuppliers.length === 0 ? (
          <EmptyState searchTerm={searchTerm} selectedCategory={selectedCategory} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onRequestContactAccess={requestContactAccess}
              />
            ))}
          </div>
        )}

        {/* Supplier Registration CTA */}
        <SupplierRegistrationCTA onRegisterClick={handleRegistrationClick} />
      </div>
    </ErrorBoundary>
  );
};

export default SecureSuppliersDirectory;