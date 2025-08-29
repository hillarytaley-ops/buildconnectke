import { useState, useEffect } from "react";
import { SecureSupplierCard } from "./SecureSupplierCard";
import { AdvancedFilters } from "./AdvancedFilters";
import { DataSourceSelector } from "./DataSourceSelector";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useSuppliers } from "@/hooks/useSuppliers";
import { Supplier, SupplierFilters as SupplierFiltersType } from "@/types/supplier";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SUPPLIERS_PER_PAGE = 12;

// Sample/Demo suppliers data
const DEMO_SUPPLIERS: Supplier[] = [
  {
    id: "demo-1",
    company_name: "Bamburi Cement",
    address: "Mombasa",
    rating: 4.8,
    specialties: ["Cement", "Concrete", "Building Solutions"],
    materials_offered: ["Cement", "Lime", "Concrete Blocks"],
    is_verified: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user_id: "demo-user-1"
  },
  {
    id: "demo-2", 
    company_name: "Devki Steel Mills",
    address: "Ruiru",
    rating: 4.9,
    specialties: ["Steel", "Iron Sheets", "Wire Products"],
    materials_offered: ["Steel Bars", "Iron Sheets", "Wire Mesh"],
    is_verified: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user_id: "demo-user-2"
  },
  {
    id: "demo-3",
    company_name: "Crown Paints Kenya", 
    address: "Nairobi",
    rating: 4.7,
    specialties: ["Paint", "Coatings", "Construction Chemicals"],
    materials_offered: ["Emulsion Paint", "Primer", "Wood Stain"],
    is_verified: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user_id: "demo-user-3"
  },
  {
    id: "demo-4",
    company_name: "Tile & Carpet Centre",
    address: "Nairobi",
    rating: 4.6,
    specialties: ["Tiles", "Carpets", "Flooring Solutions"],
    materials_offered: ["Ceramic Tiles", "Porcelain Tiles", "Carpets"],
    is_verified: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user_id: "demo-user-4"
  },
  {
    id: "demo-5",
    company_name: "Mabati Rolling Mills",
    address: "Nakuru", 
    rating: 4.8,
    specialties: ["Iron Sheets", "Roofing", "Steel Products"],
    materials_offered: ["Roofing Sheets", "Gutters", "Ridge Caps"],
    is_verified: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user_id: "demo-user-5"
  },
  {
    id: "demo-6",
    company_name: "Homa Lime Company",
    address: "Homa Bay",
    rating: 4.4,
    specialties: ["Lime", "Aggregates", "Mining Products"],
    materials_offered: ["Lime", "Sand", "Ballast"],
    is_verified: false,
    created_at: "2024-01-01T00:00:00Z", 
    updated_at: "2024-01-01T00:00:00Z",
    user_id: "demo-user-6"
  }
];

type SupplierSource = "registered" | "sample";

interface SupplierGridProps {
  onSupplierSelect?: (supplier: Supplier) => void;
  onQuoteRequest?: (supplier: Supplier) => void;
}

export const SupplierGrid = ({ onSupplierSelect, onQuoteRequest }: SupplierGridProps) => {
  const [filters, setFilters] = useState<SupplierFiltersType & {
    deliveryRadius?: number;
    priceRange?: [number, number];
    hasDelivery?: boolean;
  }>({
    search: "",
    category: "All Categories",
    location: "",
    rating: 0,
    verified: null,
    deliveryRadius: 50,
    priceRange: [0, 10000],
    hasDelivery: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [supplierSource, setSupplierSource] = useState<SupplierSource>("sample");
  const [retryCount, setRetryCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          setIsAdmin(profile?.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, []);

  const { suppliers: dbSuppliers, loading, error, totalCount, refetch } = useSuppliers(
    filters,
    supplierSource === "registered" ? currentPage : 1,
    SUPPLIERS_PER_PAGE
  );

  // Enhanced fallback and error handling
  const [showingFallback, setShowingFallback] = useState(false);
  const [lastSuccessfulFetch, setLastSuccessfulFetch] = useState<Date | null>(null);
  
  useEffect(() => {
    // Enhanced fallback logic with retry mechanism
    if (supplierSource === "registered") {
      if (loading) {
        const timer = setTimeout(() => {
          if (loading || (dbSuppliers.length === 0 && !error)) {
            setSupplierSource("sample");
            setShowingFallback(true);
          }
        }, 5000); // Increased timeout for better UX
        return () => clearTimeout(timer);
      } else if (!error && dbSuppliers.length > 0) {
        setLastSuccessfulFetch(new Date());
        setShowingFallback(false);
      }
    }
  }, [loading, dbSuppliers.length, error, supplierSource]);

  // Filter demo suppliers based on current filters
  const getFilteredDemoSuppliers = () => {
    let filtered = DEMO_SUPPLIERS;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.company_name.toLowerCase().includes(searchLower) ||
        supplier.specialties.some(s => s.toLowerCase().includes(searchLower)) ||
        supplier.materials_offered.some(m => m.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.category && filters.category !== "All Categories") {
      filtered = filtered.filter(supplier =>
        supplier.specialties.includes(filters.category)
      );
    }
    
    if (filters.rating > 0) {
      filtered = filtered.filter(supplier => supplier.rating >= filters.rating);
    }
    
    if (filters.verified !== null) {
      filtered = filtered.filter(supplier => supplier.is_verified === filters.verified);
    }
    
    return filtered;
  };

  const demoSuppliers = getFilteredDemoSuppliers();
  const demoTotalPages = Math.ceil(demoSuppliers.length / SUPPLIERS_PER_PAGE);
  const paginatedDemoSuppliers = demoSuppliers.slice(
    (currentPage - 1) * SUPPLIERS_PER_PAGE,
    currentPage * SUPPLIERS_PER_PAGE
  );

  // Always ensure we have suppliers to display
  const suppliers = supplierSource === "registered" 
    ? (dbSuppliers.length > 0 ? dbSuppliers : (loading ? [] : paginatedDemoSuppliers))
    : paginatedDemoSuppliers;
    
  const currentTotalCount = supplierSource === "registered" 
    ? (totalCount > 0 ? totalCount : (loading ? 0 : demoSuppliers.length))
    : demoSuppliers.length;
    
  const totalPages = supplierSource === "registered" 
    ? (totalCount > 0 ? Math.ceil(totalCount / SUPPLIERS_PER_PAGE) : (loading ? 0 : demoTotalPages))
    : demoTotalPages;
    
  const isLoading = supplierSource === "registered" ? loading : false;

  const handleViewCatalog = (supplier: Supplier) => {
    console.log("View catalog for:", supplier.company_name);
    onSupplierSelect?.(supplier);
  };

  const handleRequestQuote = (supplier: Supplier) => {
    console.log("Request quote from:", supplier.company_name);
    onQuoteRequest?.(supplier);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSourceChange = (source: SupplierSource) => {
    setSupplierSource(source);
    setCurrentPage(1); // Reset to first page when source changes
    setShowingFallback(false);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  if (error && supplierSource === "registered") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <p className="font-medium">Unable to load registered suppliers</p>
            <p className="text-sm mt-1">
              {error} {lastSuccessfulFetch && `(Last successful fetch: ${lastSuccessfulFetch.toLocaleTimeString()})`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSourceChange("sample")}>
              View Sample Data
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Enhanced Data Source Selection */}
        <DataSourceSelector
          currentSource={supplierSource}
          onSourceChange={handleSourceChange}
          registeredCount={totalCount}
          sampleCount={DEMO_SUPPLIERS.length}
          isLoading={isLoading}
          hasError={!!error}
          showingFallback={showingFallback}
        />

        <AdvancedFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          resultCount={currentTotalCount}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner message="Loading suppliers..." />
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-12">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                No suppliers found matching your criteria.
              </p>
              {supplierSource === "registered" && (
                <p className="text-sm text-muted-foreground">
                  Try switching to "Sample Suppliers" to see demo data.
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Admin Security Notice */}
            {isAdmin && (
              <Alert className="border-amber-200 bg-amber-50">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Admin Notice:</strong> You are viewing the secure supplier directory with full contact information. 
                  All supplier data including emails, phone numbers, and addresses are visible to you.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suppliers.map((supplier) => (
                <SecureSupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onViewCatalog={handleViewCatalog}
                  onRequestQuote={handleRequestQuote}
                  isAdminView={isAdmin}
                  showSensitiveInfo={isAdmin}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};