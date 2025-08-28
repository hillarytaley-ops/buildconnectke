import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Package, Phone, Mail, Store } from "lucide-react";
import { Supplier } from "@/types/supplier";

interface SupplierCardProps {
  supplier: Supplier;
  onViewCatalog: (supplier: Supplier) => void;
  onRequestQuote: (supplier: Supplier) => void;
}

export const SupplierCard = ({ supplier, onViewCatalog, onRequestQuote }: SupplierCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <Store className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{supplier.company_name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              {supplier.address && (
                <>
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{supplier.address}</span>
                </>
              )}
            </CardDescription>
          </div>
          {supplier.is_verified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">{supplier.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            {supplier.materials_offered.length} products
          </div>
        </div>

        {supplier.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {supplier.specialties.slice(0, 3).map((specialty, idx) => (
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
            <Mail className="h-4 w-4 mr-1" />
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