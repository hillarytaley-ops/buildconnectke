import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Package, Truck, Calendar } from "lucide-react";

const DeliveryRequest = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    purchaseOrderId: "",
    pickupAddress: "",
    deliveryAddress: "",
    preferredDate: "",
    preferredTime: "",
    specialInstructions: "",
    budgetRange: "",
    requiredVehicleType: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('id, po_number, supplier_id, status, total_amount, items')
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchaseOrders(data || []);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load purchase orders"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Create delivery request
      const { error } = await supabase
        .from('delivery_requests')
        .insert({
          builder_id: profile.id,
          pickup_address: formData.pickupAddress,
          delivery_address: formData.deliveryAddress,
          pickup_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          special_instructions: formData.specialInstructions,
          budget_range: formData.budgetRange,
          required_vehicle_type: formData.requiredVehicleType,
          material_type: 'Mixed Materials', // Default for now
          quantity: 1,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery request submitted successfully"
      });

      // Reset form
      setFormData({
        purchaseOrderId: "",
        pickupAddress: "",
        deliveryAddress: "",
        preferredDate: "",
        preferredTime: "",
        specialInstructions: "",
        budgetRange: "",
        requiredVehicleType: ""
      });
    } catch (error) {
      console.error('Error submitting delivery request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit delivery request"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Request Delivery Service
          </CardTitle>
          <CardDescription>
            Submit a delivery request for your confirmed purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="purchaseOrder">Purchase Order</Label>
                <Select
                  value={formData.purchaseOrderId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, purchaseOrderId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a purchase order" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseOrders.map((po: any) => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.po_number} - ${po.total_amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleType">Required Vehicle Type</Label>
                <Select
                  value={formData.requiredVehicleType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, requiredVehicleType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="pickup">Pickup Truck</SelectItem>
                    <SelectItem value="trailer">Trailer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Pickup Address
                </Label>
                <Textarea
                  id="pickupAddress"
                  placeholder="Enter the pickup location..."
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </Label>
                <Textarea
                  id="deliveryAddress"
                  placeholder="Enter the delivery location..."
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferredDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Preferred Date
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetRange">Budget Range</Label>
              <Select
                value={formData.budgetRange}
                onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200-500">$200 - $500</SelectItem>
                  <SelectItem value="over-500">Over $500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Any special handling requirements or additional notes..."
                value={formData.specialInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Truck className="h-4 w-4 mr-2" />
              {loading ? "Submitting..." : "Submit Delivery Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryRequest;