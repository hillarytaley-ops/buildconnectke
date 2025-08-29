import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Package, Store, Shield, Lock } from "lucide-react";
import { Supplier } from "@/types/supplier";

interface SecureSupplierCardProps {
  supplier: Supplier | any; // For the limited data structure
  onViewCatalog: (supplier: any) => void;
  onRequestQuote: (supplier: any) => void;
  isAdminView?: boolean;
  showSensitiveInfo?: boolean;
}

export const SecureSupplierCard = ({ 
  supplier, 
  onViewCatalog, 
  onRequestQuote,
  isAdminView = false,
  showSensitiveInfo = false 
}: SecureSupplierCardProps) => {
  
  // Determine what information to show based on access level
  const displayAddress = () => {
    if (isAdminView && showSensitiveInfo) {
      return supplier.address;
    }
    // Show only city for non-admin users
    return supplier.location_city || supplier.address?.split(',').slice(-1)[0]?.trim() || 'Location Available';
  };

  const displayContactInfo = () => {
    if (!isAdminView || !showSensitiveInfo) {
      return null;
    }
    return (
      <div className="mt-2 pt-2 border-t space-y-1">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Lock className="h-3 w-3" />
          <span>Sensitive Information (Admin Only)</span>
        </div>
        {supplier.contact_person && (
          <p className="text-xs">Contact: {supplier.contact_person}</p>
        )}
        {supplier.email && (
          <p className="text-xs">Email: {supplier.email}</p>
        )}
        {supplier.phone && (
          <p className="text-xs">Phone: {supplier.phone}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <Store className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate flex items-center gap-2">
              {supplier.company_name}
              {isAdminView && (
                <Shield className="h-4 w-4 text-primary" />
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{displayAddress()}</span>
            </CardDescription>
            {displayContactInfo()}
          </div>
          <div className="flex flex-col gap-1">
            {supplier.is_verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Verified
              </Badge>
            )}
            {isAdminView && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                Admin View
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">{supplier.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            {supplier.materials_offered?.length || 0} products
          </div>
        </div>

        {supplier.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {supplier.specialties.slice(0, 3).map((specialty: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {supplier.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{supplier.specialties.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onRequestQuote(supplier)}
          >
            <Package className="h-4 w-4 mr-1" />
            Quote
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onViewCatalog(supplier)}
          >
            <Store className="h-4 w-4 mr-1" />
            Catalog
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};