import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Shield, Mail, MapPin, Building, AlertTriangle } from 'lucide-react';
import { useSecureSuppliers } from '@/hooks/useSecureSuppliers';
import { useToast } from '@/hooks/use-toast';

interface SecureSupplierContactRequestProps {
  supplierId: string;
  supplierName: string;
  className?: string;
}

export const SecureSupplierContactRequest: React.FC<SecureSupplierContactRequestProps> = ({
  supplierId,
  supplierName,
  className = ""
}) => {
  const [supplierInfo, setSupplierInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const { getSupplierWithContact, isAuthenticated, userRole } = useSecureSuppliers();
  const { toast } = useToast();

  const handleRequestSupplierContact = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request supplier contact information.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Get secure supplier info which includes controlled contact data
      const supplierData = await getSupplierWithContact(supplierId);
      
      if (supplierData) {
        setSupplierInfo(supplierData);
        setHasRequested(true);
        
        if (supplierData.can_view_contact && (supplierData.email || supplierData.phone)) {
          toast({
            title: "Contact Information Authorized",
            description: "You now have access to supplier contact details based on your business relationship.",
            variant: "default"
          });
        } else {
          toast({
            title: "Access Restricted",
            description: supplierData.contact_access_reason || "Supplier contact access requires an active business relationship.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Supplier Not Found",
          description: "Could not retrieve supplier information.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting supplier contact:', error);
      toast({
        title: "Request Failed",
        description: "Failed to process supplier contact request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSupplierInfo = () => {
    if (!hasRequested) {
      return (
        <Card className={`border-muted ${className}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Secure Supplier Contact</h3>
                <p className="text-sm text-muted-foreground">Request access to {supplierName} contact information</p>
              </div>
            </div>
            
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Supplier contact information is protected and only available to users with active business relationships 
                (purchase orders, quotations, or recent deliveries). All access requests are logged for security monitoring.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Role: {userRole || 'Unknown'}</Badge>
              <Badge variant="outline">Protected Contact</Badge>
            </div>

            <Button 
              onClick={handleRequestSupplierContact}
              disabled={loading || !isAuthenticated}
              className="w-full"
            >
              {loading ? 'Processing Request...' : 'Request Supplier Contact'}
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (!supplierInfo) {
      return (
        <Card className={`border-destructive ${className}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <div>
                <h3 className="font-semibold text-foreground">No Supplier Information Available</h3>
                <p className="text-sm text-muted-foreground">Supplier details are not currently accessible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`${supplierInfo.can_view_contact ? 'border-success' : 'border-warning'} ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Building className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{supplierInfo.company_name}</h3>
              <p className="text-sm text-muted-foreground">
                {supplierInfo.can_view_contact ? 'Authorized business contact' : 'Limited access'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Contact Person:</span>
              <span className="text-sm font-semibold text-foreground">
                {supplierInfo.contact_person}
              </span>
            </div>

            {supplierInfo.can_view_contact && supplierInfo.email ? (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Email:</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a 
                    href={`mailto:${supplierInfo.email}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {supplierInfo.email}
                  </a>
                </div>
              </div>
            ) : null}

            {supplierInfo.can_view_contact && supplierInfo.phone ? (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <a 
                    href={`tel:${supplierInfo.phone}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {supplierInfo.phone}
                  </a>
                </div>
              </div>
            ) : null}

            {supplierInfo.can_view_contact && supplierInfo.address ? (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Address:</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {supplierInfo.address}
                  </span>
                </div>
              </div>
            ) : null}

            {!supplierInfo.can_view_contact && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  {supplierInfo.contact_access_reason}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-2">
              <Badge variant={supplierInfo.can_view_contact ? "default" : "secondary"}>
                {supplierInfo.can_view_contact ? 'Access Authorized' : 'Access Restricted'}
              </Badge>
              <Badge variant="outline">Business Relationship Required</Badge>
              <Badge variant="outline">Logged & Monitored</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return renderSupplierInfo();
};