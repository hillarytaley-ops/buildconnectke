import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Package, Eye, EyeOff, Phone, Mail, Building } from "lucide-react";

interface SupplierInfo {
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

interface SupplierCardProps {
  supplier: SupplierInfo;
  onRequestContactAccess: (supplierId: string) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onRequestContactAccess }) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-border bg-card overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
              <Building className="h-5 w-5" />
              {supplier.company_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{supplier.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              {supplier.is_verified ? (
                <Badge variant="default" className="text-xs">
                  ✓ Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  ⏳ Pending
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Specialties */}
        {supplier.specialties && supplier.specialties.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {supplier.specialties.slice(0, 3).map((specialty, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {supplier.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{supplier.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-2 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Contact Information</span>
            {supplier.can_view_contact ? (
              <Badge variant="default" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Authorized
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <EyeOff className="h-3 w-3 mr-1" />
                Protected
              </Badge>
            )}
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3 text-muted-foreground" />
              <span>{supplier.contact_person}</span>
            </div>
            
            {supplier.can_view_contact ? (
              <>
                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-mono">{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-mono">{supplier.phone}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{supplier.address}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-muted-foreground">
                Contact details available after establishing business relationship
              </div>
            )}
          </div>
          
          {!supplier.can_view_contact && (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={() => onRequestContactAccess(supplier.id)}
            >
              Request Contact Access
            </Button>
          )}
        </div>

        {/* Member Since */}
        <div className="text-xs text-muted-foreground">
          Member since {new Date(supplier.created_at).getFullYear()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierCard;