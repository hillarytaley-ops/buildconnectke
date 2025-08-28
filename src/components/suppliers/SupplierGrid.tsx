import { useState } from "react";
import { SupplierCard } from "./SupplierCard";
import { SupplierFilters } from "./SupplierFilters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useSuppliers } from "@/hooks/useSuppliers";
import { Supplier, SupplierFilters as SupplierFiltersType } from "@/types/supplier";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SUPPLIERS_PER_PAGE = 12;

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

  const { suppliers, loading, error, totalCount, refetch } = useSuppliers(
    filters,
    currentPage,
    SUPPLIERS_PER_PAGE
  );

  const totalPages = Math.ceil(totalCount / SUPPLIERS_PER_PAGE);

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

  if (error) {
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
        <SupplierFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          resultCount={totalCount}
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner message="Loading suppliers..." />
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No suppliers found matching your criteria.
            </p>
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