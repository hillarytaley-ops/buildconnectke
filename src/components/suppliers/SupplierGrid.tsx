import { useState } from "react";
import { SupplierCard } from "./SupplierCard";
import { SupplierFilters } from "./SupplierFilters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useSuppliers } from "@/hooks/useSuppliers";
import { Supplier, SupplierFilters as SupplierFiltersType } from "@/types/supplier";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Database, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
}

export const SupplierGrid = ({ onSupplierSelect }: SupplierGridProps) => {
  const [filters, setFilters] = useState<SupplierFiltersType>({
    search: "",
    category: "All Categories",
    location: "",
    rating: 0,
    verified: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [supplierSource, setSupplierSource] = useState<SupplierSource>("registered");

  const { suppliers: dbSuppliers, loading, error, totalCount, refetch } = useSuppliers(
    filters,
    currentPage,
    SUPPLIERS_PER_PAGE
  );

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

  // Choose data source based on selected option
  const suppliers = supplierSource === "registered" ? dbSuppliers : paginatedDemoSuppliers;
  const currentTotalCount = supplierSource === "registered" ? totalCount : demoSuppliers.length;
  const totalPages = supplierSource === "registered" 
    ? Math.ceil(totalCount / SUPPLIERS_PER_PAGE)
    : demoTotalPages;
  const isLoading = supplierSource === "registered" ? loading : false;

  const handleViewCatalog = (supplier: Supplier) => {
    console.log("View catalog for:", supplier.company_name);
    onSupplierSelect?.(supplier);
  };

  const handleRequestQuote = (supplier: Supplier) => {
    console.log("Request quote from:", supplier.company_name);
    // TODO: Implement quote request functionality
  };

  const handleFiltersChange = (newFilters: SupplierFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSourceChange = (source: SupplierSource) => {
    setSupplierSource(source);
    setCurrentPage(1); // Reset to first page when source changes
  };

  if (error && supplierSource === "registered") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <button 
            onClick={refetch}
            className="ml-2 underline hover:no-underline"
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Source Selection */}
        <div className="flex items-center justify-between bg-muted rounded-lg p-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Supplier Directory</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={supplierSource === "registered" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSourceChange("registered")}
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                Registered Suppliers
                <Badge variant="secondary" className="ml-1">
                  {supplierSource === "registered" ? totalCount : "Live"}
                </Badge>
              </Button>
              <Button
                variant={supplierSource === "sample" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSourceChange("sample")}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Sample Suppliers
                <Badge variant="secondary" className="ml-1">
                  {DEMO_SUPPLIERS.length}
                </Badge>
              </Button>
            </div>
          </div>
          {supplierSource === "sample" && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Demo Data
            </Badge>
          )}
        </div>

        <SupplierFilters
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onViewCatalog={handleViewCatalog}
                  onRequestQuote={handleRequestQuote}
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