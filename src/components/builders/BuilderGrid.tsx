import { useState } from "react";
import { BuilderCard } from "./BuilderCard";
import { BuilderFilters } from "./BuilderFilters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Users, AlertCircle } from "lucide-react";
import { UserProfile } from "@/types/userProfile";
import { useToast } from "@/hooks/use-toast";

// Demo builders data
const DEMO_BUILDERS = [
  {
    id: 'builder-1',
    user_id: 'builder-1',
    full_name: 'John Kamau',
    company_name: 'Kamau Construction Ltd',
    role: 'builder' as const,
    user_type: 'company' as const,
    is_professional: true,
    phone: '+254 722 123 456',
    email: 'info@kamauconstruction.co.ke',
    location: 'Nairobi',
    rating: 4.8,
    total_projects: 45,
    specialties: ['Residential Construction', 'Commercial Construction', 'Renovation & Remodeling'],
    description: 'Leading construction company with over 10 years of experience in Nairobi and surrounding areas.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'builder-2',
    user_id: 'builder-2',
    full_name: 'Grace Wanjiku',
    company_name: 'Elite Builders Kenya',
    role: 'builder' as const,
    user_type: 'company' as const,
    is_professional: true,
    phone: '+254 733 456 789',
    email: 'contact@elitebuilders.co.ke',
    location: 'Mombasa',
    rating: 4.9,
    total_projects: 62,
    specialties: ['Commercial Construction', 'Interior Design', 'HVAC Systems'],
    description: 'Premium construction services specializing in commercial and luxury residential projects.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'builder-3',
    user_id: 'builder-3',
    full_name: 'David Ochieng',
    role: 'builder' as const,
    user_type: 'individual' as const,
    is_professional: true,
    phone: '+254 745 678 901',
    email: 'david.ochieng@gmail.com',
    location: 'Kisumu',
    rating: 4.6,
    total_projects: 28,
    specialties: ['Electrical Installation', 'Solar Installation', 'Plumbing Systems'],
    description: 'Certified electrical and solar installation specialist with focus on sustainable solutions.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'builder-4',
    user_id: 'builder-4',
    full_name: 'Mary Njeri',
    company_name: 'Njeri Masonry Works',
    role: 'builder' as const,
    user_type: 'company' as const,
    is_professional: true,
    phone: '+254 756 789 012',
    email: 'mary@njerimasonry.co.ke',
    location: 'Nakuru',
    rating: 4.7,
    total_projects: 38,
    specialties: ['Masonry', 'Foundation Work', 'Concrete Works'],
    description: 'Expert masonry and foundation work throughout Central Kenya region.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'builder-5',
    user_id: 'builder-5',
    full_name: 'Peter Mwangi',
    role: 'builder' as const,
    user_type: 'individual' as const,
    is_professional: true,
    phone: '+254 767 890 123',
    email: 'peter.mwangi@yahoo.com',
    location: 'Eldoret',
    rating: 4.5,
    total_projects: 22,
    specialties: ['Roofing', 'Carpentry', 'Painting & Finishing'],
    description: 'Specialized in roofing and finishing work with attention to detail.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'builder-6',
    user_id: 'builder-6',
    full_name: 'Sarah Mutua',
    company_name: 'Mutua Engineering Solutions',
    role: 'builder' as const,
    user_type: 'company' as const,
    is_professional: true,
    phone: '+254 778 901 234',
    email: 'info@mutuaengineering.co.ke',
    location: 'Thika',
    rating: 4.9,
    total_projects: 54,
    specialties: ['Road Construction', 'Bridge Construction', 'Drainage Systems'],
    description: 'Civil engineering company specializing in infrastructure development.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const BUILDERS_PER_PAGE = 12;

type BuilderSource = "demo" | "registered";

interface BuilderGridProps {
  onBuilderContact?: (builder: UserProfile & { company_name?: string; phone?: string; email?: string }) => void;
  onBuilderProfile?: (builder: UserProfile & { company_name?: string; phone?: string; email?: string }) => void;
  isAdmin?: boolean;
}

export const BuilderGrid = ({ onBuilderContact, onBuilderProfile, isAdmin = false }: BuilderGridProps) => {
  const [filters, setFilters] = useState<BuilderFilters>({
    search: "",
    location: "All Counties",
    specialties: [],
    rating: 0,
    professionalOnly: false,
    companyOnly: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [builderSource, setBuilderSource] = useState<BuilderSource>("demo");
  const { toast } = useToast();

  // Filter demo builders based on current filters
  const getFilteredDemoBuilders = () => {
    return DEMO_BUILDERS.filter(builder => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          builder.full_name?.toLowerCase().includes(searchLower) ||
          builder.company_name?.toLowerCase().includes(searchLower) ||
          builder.specialties?.some(s => s.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location && filters.location !== "All Counties") {
        if (builder.location !== filters.location) return false;
      }

      // Rating filter
      if (filters.rating > 0) {
        if (!builder.rating || builder.rating < filters.rating) return false;
      }

      // Professional only filter
      if (filters.professionalOnly && !builder.is_professional) return false;

      // Company only filter
      if (filters.companyOnly && builder.user_type !== 'company') return false;

      // Specialties filter
      if (filters.specialties.length > 0) {
        const hasMatchingSpecialty = filters.specialties.some(filterSpecialty =>
          builder.specialties?.includes(filterSpecialty)
        );
        if (!hasMatchingSpecialty) return false;
      }

      return true;
    });
  };

  const demoBuilders = getFilteredDemoBuilders();
  const demoTotalPages = Math.ceil(demoBuilders.length / BUILDERS_PER_PAGE);
  const paginatedDemoBuilders = demoBuilders.slice(
    (currentPage - 1) * BUILDERS_PER_PAGE,
    currentPage * BUILDERS_PER_PAGE
  );

  // Choose data source - always use demo for now
  const builders = paginatedDemoBuilders;
  const currentTotalCount = demoBuilders.length;
  const totalPages = demoTotalPages;

  const handleContactBuilder = (builder: UserProfile & { company_name?: string; phone?: string; email?: string }) => {
    onBuilderContact?.(builder);
    toast({
      title: "Contact Information",
      description: `Contacting ${builder.company_name || builder.full_name}`,
    });
  };

  const handleFiltersChange = (newFilters: BuilderFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSourceChange = (source: BuilderSource) => {
    setBuilderSource(source);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Source Selection - Only show for admin */}
      {isAdmin && (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Builder Directory</h2>
            <div className="flex items-center gap-2">
              <Button
                variant={builderSource === "demo" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSourceChange("demo")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Public Builders
                <Badge variant="secondary" className="ml-1">
                  {demoBuilders.length}
                </Badge>
              </Button>
              <Button
                variant={builderSource === "registered" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSourceChange("registered")}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Registered Users
                <Badge variant="secondary" className="ml-1">
                  Admin Only
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      )}

      <BuilderFilters 
        filters={filters} 
        onFiltersChange={handleFiltersChange} 
      />

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {builders.length} of {currentTotalCount} professional builders
          </p>
          {builderSource === "demo" && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Professional Directory
            </Badge>
          )}
        </div>

        {builders.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No builders found matching your criteria. Try adjusting your filters.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builders.map((builder) => (
                <BuilderCard
                  key={builder.id}
                  builder={builder}
                  onContactClick={handleContactBuilder}
                  onViewProfile={onBuilderProfile}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};