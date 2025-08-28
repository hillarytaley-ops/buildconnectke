import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Building2, Star, Users } from "lucide-react";
import { UserProfile } from "@/types/userProfile";

interface BuilderCardProps {
  builder: UserProfile & {
    company_name?: string;
    phone?: string;
    email?: string;
    rating?: number;
    total_projects?: number;
    location?: string;
    specialties?: string[];
    description?: string;
  };
  onContactClick?: (builder: BuilderCardProps['builder']) => void;
}

export const BuilderCard = ({ builder, onContactClick }: BuilderCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {builder.company_name || builder.full_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {builder.user_type === 'company' ? 'Company' : 'Individual'}
              </Badge>
              {builder.is_professional && (
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                  Professional
                </Badge>
              )}
            </div>
          </div>
          {builder.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{builder.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {builder.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {builder.description}
          </p>
        )}

        {builder.specialties && builder.specialties.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-1">
              {builder.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {builder.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{builder.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm text-muted-foreground">
          {builder.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{builder.location}</span>
            </div>
          )}
          
          {builder.total_projects && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{builder.total_projects} completed projects</span>
            </div>
          )}

          {builder.user_type === 'company' && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Company</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onContactClick?.(builder)}
          >
            <Phone className="h-4 w-4 mr-1" />
            Contact
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};