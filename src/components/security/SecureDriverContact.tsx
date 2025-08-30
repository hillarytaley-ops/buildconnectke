import { useState, useEffect } from 'react';
import { Shield, Lock, Phone, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSecureDeliveries } from '@/hooks/useSecureDeliveries';
import { useToast } from '@/hooks/use-toast';

interface SecureDriverContactProps {
  deliveryId: string;
  deliveryStatus: string;
  className?: string;
}

export const SecureDriverContact = ({ 
  deliveryId, 
  deliveryStatus, 
  className 
}: SecureDriverContactProps) => {
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const { getSecureDeliveryInfo, logDriverContactAccess, isAuthenticated, userRole } = useSecureDeliveries();
  const { toast } = useToast();

  const handleRequestDriverContact = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to access driver contact information."
      });
      return;
    }

    setLoading(true);
    try {
      // Log the access request
      await logDriverContactAccess(deliveryId, `Driver contact needed for ${deliveryStatus} delivery`);
      
      // Fetch secure delivery information
      const secureInfo = await getSecureDeliveryInfo(deliveryId);
      setDriverInfo(secureInfo);
      setHasRequested(true);

      if (secureInfo?.can_view_driver_contact) {
        toast({
          title: "Driver contact available",
          description: "You now have access to driver contact information."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Access restricted",
          description: secureInfo?.security_message || "Driver contact not available at this time."
        });
      }
    } catch (error) {
      console.error('Error requesting driver contact:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to retrieve driver contact information."
      });
    } finally {
      setLoading(false);
    }
  };

  const renderDriverInfo = () => {
    if (!hasRequested) {
      return (
        <Card className={className}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Secure Driver Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-3 w-3" />
                Driver contact information is protected
              </div>
              <Button 
                onClick={handleRequestDriverContact}
                disabled={loading}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Phone className="h-3 w-3 mr-2" />
                {loading ? 'Requesting...' : 'Request Driver Contact'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Contact access is logged for security and only available during active delivery phases.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!driverInfo) {
      return (
        <Card className={className}>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              No driver information available
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            Driver Information
            {driverInfo.can_view_driver_contact ? (
              <Badge variant="secondary" className="text-xs">Authorized</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Restricted</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium">
                {driverInfo.driver_display_name}
              </h4>
              {driverInfo.can_view_driver_contact && driverInfo.driver_contact_info ? (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3" />
                  <a 
                    href={`tel:${driverInfo.driver_contact_info}`}
                    className="text-blue-600 hover:underline"
                  >
                    {driverInfo.driver_contact_info}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>{driverInfo.security_message}</span>
                </div>
              )}
            </div>
            
            {!driverInfo.can_view_driver_contact && (
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-md">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium">Contact access restricted</p>
                  <p>Driver contact is only available during active delivery phases for authorized participants.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return renderDriverInfo();
};