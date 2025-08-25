import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Star, Truck, MapPin, Phone, CheckCircle, XCircle } from "lucide-react";

const DeliveryProviders = () => {
  const [providers, setProviders] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
    fetchPendingRequests();
  }, []);

  const fetchProviders = async () => {
    try {
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
        title: "Error",
        description: "Failed to load delivery providers"
      });
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingRequests(data || []);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleProviderResponse = async (requestId: string, providerId: string, response: 'accept' | 'reject') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('delivery_requests')
        .update({
          provider_id: response === 'accept' ? providerId : null,
          status: response === 'accept' ? 'accepted' : 'rejected',
          provider_response: response,
          response_date: new Date().toISOString(),
          response_notes: response === 'accept' ? 'Request accepted by provider' : 'Request declined by provider'
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Delivery request ${response}ed successfully`
      });

      fetchPendingRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update delivery request"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Pending Delivery Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Delivery Requests</CardTitle>
            <CardDescription>
              Active delivery requests waiting for provider response
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

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleProviderResponse(request.id, 'provider-id', 'accept')}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProviderResponse(request.id, 'provider-id', 'reject')}
                      disabled={loading}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Delivery Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Available Delivery Providers</CardTitle>
          <CardDescription>
            Verified delivery providers in your area
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
                        <span>{provider.service_areas?.join(', ') || 'Service areas available'}</span>
                      </div>

                      {provider.capacity_kg && (
                        <div>
                          <span className="font-medium">Capacity:</span> {provider.capacity_kg} kg
                        </div>
                      )}

                      <div className="flex justify-between">
                        {provider.hourly_rate && (
                          <span>${provider.hourly_rate}/hr</span>
                        )}
                        {provider.per_km_rate && (
                          <span>${provider.per_km_rate}/km</span>
                        )}
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Contact Provider",
                          description: "Contact functionality will be available soon"
                        });
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Provider
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {providers.length === 0 && (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Providers Available</h3>
              <p className="text-muted-foreground">
                No verified delivery providers are currently available in your area.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryProviders;