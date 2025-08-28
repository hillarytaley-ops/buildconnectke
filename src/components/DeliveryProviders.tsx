import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Star, Truck, MapPin, Phone, CheckCircle, XCircle, AlertCircle, Shield } from "lucide-react";
import { useDeliveryAuth } from "./delivery/useDeliveryAuth";
import ProviderSecurityNotice from "./delivery/ProviderSecurityNotice";

const DeliveryProviders = () => {
  const [providers, setProviders] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, userRole, authenticated, hasRole, requireRole } = useDeliveryAuth();

  useEffect(() => {
    if (authenticated && user?.profile?.id) {
      fetchProviders();
      // Only fetch pending requests for delivery providers and admins
      if (hasRole(['delivery_provider', 'admin'])) {
        fetchPendingRequests(user.profile.id);
      }
    }
  }, [authenticated, user, hasRole]);

  const fetchProviders = async () => {
    try {
      // Use the public view which already has restricted access
      const { data, error } = await supabase
        .from('delivery_providers_public')
        .select('*')
        .eq('is_active', true)
        .eq('is_verified', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        variant: "destructive",
        title: "Access Restricted",
        description: "Unable to load provider information. You may need appropriate permissions."
      });
      setProviders([]);
    }
  };

  const fetchPendingRequests = async (profileId: string) => {
    try {
      // Only allow delivery providers and admins to see pending requests
      if (!hasRole(['delivery_provider', 'admin'])) {
        setPendingRequests([]);
        return;
      }

      // For delivery providers, check if they have a provider profile
      if (hasRole('delivery_provider')) {
        const { data: providerData } = await supabase
          .from('delivery_providers')
          .select('id')
          .eq('user_id', profileId)
          .single();

        if (!providerData) {
          toast({
            title: "Provider Profile Required",
            description: "You need to complete your delivery provider profile to see requests.",
            variant: "destructive",
          });
          setPendingRequests([]);
          return;
        }
      }

      const { data, error } = await supabase
        .from('delivery_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter to only show requests that haven't been claimed by other providers
      const availableRequests = (data || []).filter(request => !request.provider_id);
      setPendingRequests(availableRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setPendingRequests([]);
    }
  };

  const handleProviderResponse = async (requestId: string, response: 'accept' | 'reject') => {
    // Only allow delivery providers to respond to requests
    requireRole('delivery_provider', async () => {
      if (!user?.profile?.id) {
        toast({
          title: "Authentication Error",
          description: "User profile not found",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      try {
        // Get the current user's delivery provider profile
        const { data: providerData, error: providerError } = await supabase
          .from('delivery_providers')
          .select('id')
          .eq('user_id', user.profile.id)
          .single();

        if (providerError || !providerData) {
          throw new Error('Delivery provider profile not found. Please complete your provider registration.');
        }

        // Update the delivery request with proper provider ID
        const { error } = await supabase
          .from('delivery_requests')
          .update({
            provider_id: response === 'accept' ? providerData.id : null,
            status: response === 'accept' ? 'accepted' : 'rejected',
            provider_response: response,
            response_date: new Date().toISOString(),
            response_notes: response === 'accept' ? 'Request accepted by provider' : 'Request declined by provider'
          })
          .eq('id', requestId)
          .eq('status', 'pending'); // Additional security check

        if (error) throw error;

        toast({
          title: "Success",
          description: `Delivery request ${response}ed successfully`
        });

        // Refresh the pending requests list
        if (user.profile?.id) {
          await fetchPendingRequests(user.profile.id);
        }
      } catch (error) {
        console.error('Error updating request:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update delivery request."
        });
      } finally {
        setLoading(false);
      }
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Show access denied message if user is not authenticated or doesn't have proper role
  if (!authenticated) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-muted-foreground">
          Please sign in to view delivery providers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <ProviderSecurityNotice 
        userRole={userRole}
        hasActiveRequest={hasRole(['delivery_provider', 'admin'])}
        isAdmin={hasRole('admin')}
      />

      {/* Pending Delivery Requests - Only for delivery providers and admins */}
      {hasRole(['delivery_provider', 'admin']) && pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Delivery Requests</CardTitle>
            <CardDescription>
              {hasRole('admin') 
                ? "All pending delivery requests (Admin View)" 
                : "Active delivery requests waiting for provider response"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request: any) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{request.material_type}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {request.quantity} | Budget: {request.budget_range}
                      </p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Pickup: {request.pickup_address?.substring(0, 50)}...
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Delivery: {request.delivery_address?.substring(0, 50)}...
                    </div>
                  </div>

                  {/* Only show response buttons for delivery providers */}
                  {hasRole('delivery_provider') && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleProviderResponse(request.id, 'accept')}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProviderResponse(request.id, 'reject')}
                        disabled={loading}
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  )}
                  {/* Admin view indicator */}
                  {hasRole('admin') && !hasRole('delivery_provider') && (
                    <div className="text-sm text-muted-foreground">
                      Admin View - Contact delivery providers directly to manage requests
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Delivery Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Available Delivery Providers
          </CardTitle>
          <CardDescription>
            Verified delivery providers - Contact information protected by security protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider: any) => (
              <Card key={provider.id} className="border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{provider.provider_name}</h3>
                      <Badge variant={provider.is_verified ? "default" : "secondary"}>
                        {provider.is_verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      {renderStars(Math.floor(provider.rating))}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({provider.total_deliveries} deliveries)
                      </span>
                    </div>

                     <div className="space-y-2 text-sm">
                       <div className="flex items-center gap-2">
                         <Truck className="h-4 w-4" />
                         <span>{provider.vehicle_types?.join(', ') || 'Various vehicles'}</span>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         <MapPin className="h-4 w-4" />
                         <span>
                           {provider.service_areas?.length > 0 
                             ? `${provider.service_areas[0]}${provider.service_areas.length > 1 ? ' +' + (provider.service_areas.length - 1) + ' more' : ''}`
                             : 'Service areas available'
                           }
                         </span>
                       </div>

                       {provider.capacity_kg && (
                         <div>
                           <span className="font-medium">Capacity:</span> {provider.capacity_kg} kg
                         </div>
                       )}

                       <div className="text-xs text-muted-foreground border-t pt-2">
                         <div>Contact information available after request acceptance</div>
                         <div>Rates disclosed during quote process</div>
                       </div>
                     </div>

                     <Button 
                       size="sm" 
                       className="w-full"
                       onClick={() => {
                         toast({
                           title: "Contact via Request",
                           description: "Submit a delivery request to contact this provider securely."
                         });
                       }}
                     >
                       <Phone className="h-4 w-4 mr-2" />
                       Request Quote
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {providers.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Providers Available</h3>
              <p className="text-muted-foreground">
                No verified delivery providers are currently available, or you may need appropriate permissions to view them.
              </p>
              {!hasRole(['builder', 'admin']) && (
                <p className="text-sm text-muted-foreground mt-2">
                  Builder role required to view delivery providers.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryProviders;