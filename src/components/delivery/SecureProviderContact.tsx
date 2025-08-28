import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useDeliveryAuth } from "./useDeliveryAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecureProviderContactProps {
  providerId: string;
  requestId?: string;
  showContactInfo?: boolean;
}

interface SecureProviderInfo {
  id: string;
  provider_name: string;
  provider_type: string;
  vehicle_types: string[];
  service_areas: string[];
  capacity_kg: number;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_deliveries: number;
  can_view_contact: boolean;
  phone: string;
  email: string;
  address: string;
  hourly_rate: number;
  per_km_rate: number;
}

const SecureProviderContact: React.FC<SecureProviderContactProps> = ({ 
  providerId, 
  requestId, 
  showContactInfo = false 
}) => {
  const [providerInfo, setProviderInfo] = useState<SecureProviderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const { toast } = useToast();
  const { user, hasRole, authenticated } = useDeliveryAuth();

  useEffect(() => {
    if (authenticated && providerId) {
      fetchSecureProviderInfo();
    }
  }, [authenticated, providerId]);

  const fetchSecureProviderInfo = async () => {
    try {
      setLoading(true);
      
      // Use the secure function to get provider information
      const { data, error } = await supabase.rpc('get_secure_provider_info', {
        provider_uuid: providerId
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setProviderInfo(data[0]);
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this provider's information.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching secure provider info:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load provider information. Access may be restricted."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactAccess = () => {
    if (!providerInfo?.can_view_contact) {
      toast({
        title: "Contact Restricted",
        description: "Contact information is only available for active delivery partners.",
        variant: "destructive",
      });
      return;
    }
    setShowSensitiveData(!showSensitiveData);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!providerInfo) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Provider information is not available or you don't have permission to view it.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {providerInfo.provider_name}
              {providerInfo.is_verified && (
                <Badge variant="default" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {providerInfo.provider_type} • Rating: {providerInfo.rating}/5 
              • {providerInfo.total_deliveries} deliveries
            </CardDescription>
          </div>
          
          {providerInfo.can_view_contact && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleContactAccess}
              className="flex items-center gap-2"
            >
              {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSensitiveData ? 'Hide' : 'Show'} Contact
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Information - Always Visible */}
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Vehicle Types:</span> {providerInfo.vehicle_types?.join(', ') || 'Various'}
          </div>
          <div className="text-sm">
            <span className="font-medium">Service Areas:</span> {
              providerInfo.service_areas?.length > 0 
                ? `${providerInfo.service_areas[0]}${providerInfo.service_areas.length > 1 ? ' +' + (providerInfo.service_areas.length - 1) + ' more' : ''}`
                : 'Available on request'
            }
          </div>
          {providerInfo.capacity_kg && (
            <div className="text-sm">
              <span className="font-medium">Capacity:</span> {providerInfo.capacity_kg} kg
            </div>
          )}
        </div>

        {/* Contact Information - Conditionally Visible */}
        {providerInfo.can_view_contact ? (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Authorized Contact Information
            </h4>
            
            {showSensitiveData ? (
              <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{providerInfo.phone}</span>
                </div>
                
                {providerInfo.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{providerInfo.email}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{providerInfo.address}</span>
                </div>

                {(providerInfo.hourly_rate || providerInfo.per_km_rate) && (
                  <div className="flex gap-4 text-sm border-t pt-2">
                    {providerInfo.hourly_rate && (
                      <span><span className="font-medium">Hourly:</span> ${providerInfo.hourly_rate}/hr</span>
                    )}
                    {providerInfo.per_km_rate && (
                      <span><span className="font-medium">Per km:</span> ${providerInfo.per_km_rate}/km</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                Contact information is available. Click "Show Contact" to reveal.
              </div>
            )}
          </div>
        ) : (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Contact information is protected. Available after delivery request acceptance or for active business relationships.
            </AlertDescription>
          </Alert>
        )}

        {/* Access Control Notice */}
        <div className="text-xs text-muted-foreground border-t pt-2">
          {hasRole('admin') ? (
            "Admin access: All provider information visible"
          ) : (
            "Access logged for security compliance"
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureProviderContact;