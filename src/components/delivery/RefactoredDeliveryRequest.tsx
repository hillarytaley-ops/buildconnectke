import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Package, Truck, Calendar, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDeliveryAuth } from "./useDeliveryAuth";
import DeliveryEmptyState from "./DeliveryEmptyStates";

interface DeliveryRequestFormData {
  pickupAddress: string;
  deliveryAddress: string;
  preferredDate: string;
  preferredTime: string;
  specialInstructions: string;
  budgetRange: string;
  requiredVehicleType: string;
  materialType: string;
  quantity: string;
  weight: string;
}

const RefactoredDeliveryRequest: React.FC = () => {
  const { user, authenticated, requireAuth } = useDeliveryAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DeliveryRequestFormData>({
    pickupAddress: "",
    deliveryAddress: "",
    preferredDate: "",
    preferredTime: "",
    specialInstructions: "",
    budgetRange: "",
    requiredVehicleType: "",
    materialType: "",
    quantity: "1",
    weight: ""
  });
  const { toast } = useToast();

  const materialTypes = [
    "Cement", "Steel Bars", "Bricks", "Sand", "Gravel", "Tiles", 
    "Timber", "Paint", "Hardware", "Mixed Materials", "Other"
  ];

  const vehicleTypes = [
    "Small Van", "Large Van", "Pickup Truck", "Small Truck", 
    "Large Truck", "Trailer", "Any Available"
  ];

  const budgetRanges = [
    "Under KSh 5,000", "KSh 5,000 - 10,000", "KSh 10,000 - 20,000", 
    "KSh 20,000 - 50,000", "Over KSh 50,000", "Contact for Quote"
  ];

  const handleInputChange = (field: keyof DeliveryRequestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const required = ['pickupAddress', 'deliveryAddress', 'preferredDate', 'materialType'];
    const missing = required.filter(field => !formData[field as keyof DeliveryRequestFormData].trim());
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missing.join(', ').replace(/([A-Z])/g, ' $1').toLowerCase()}`,
        variant: "destructive",
      });
      return false;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast({
        title: "Invalid Date",
        description: "Pickup date cannot be in the past.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    requireAuth(async () => {
      if (!validateForm()) return;
      
      setLoading(true);
      try {
        if (!user?.profile?.id) {
          throw new Error('User profile not found');
        }

        // Validate user has builder role for additional security
        if (user.profile.role !== 'builder' && user.profile.role !== 'admin') {
          throw new Error('Only builders can submit delivery requests');
        }

        // Sanitize and validate input data
        const sanitizedData = {
          builder_id: user.profile.id,
          pickup_address: formData.pickupAddress.trim().substring(0, 500), // Limit length
          delivery_address: formData.deliveryAddress.trim().substring(0, 500), // Limit length
          pickup_date: formData.preferredDate,
          preferred_time: formData.preferredTime || null,
          special_instructions: formData.specialInstructions ? formData.specialInstructions.trim().substring(0, 1000) : null,
          budget_range: formData.budgetRange || null,
          required_vehicle_type: formData.requiredVehicleType || null,
          material_type: formData.materialType.trim(),
          quantity: Math.max(1, Math.min(10000, parseInt(formData.quantity) || 1)), // Limit quantity
          weight_kg: formData.weight ? Math.max(0, Math.min(100000, parseFloat(formData.weight))) : null, // Limit weight
          status: 'pending'
        };

        const { error } = await supabase
          .from('delivery_requests')
          .insert(sanitizedData);

        if (error) throw error;

        toast({
          title: "Request Submitted",
          description: "Your delivery request has been submitted successfully. You'll be notified when providers respond.",
        });

        // Reset form after successful submission
        setFormData({
          pickupAddress: "",
          deliveryAddress: "",
          preferredDate: "",
          preferredTime: "",
          specialInstructions: "",
          budgetRange: "",
          requiredVehicleType: "",
          materialType: "",
          quantity: "1",
          weight: ""
        });
      } catch (error) {
        console.error('Error submitting delivery request:', error);
        const errorMessage = error instanceof Error ? error.message : "Failed to submit delivery request. Please try again.";
        toast({
          title: "Submission Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    });
  };

  if (!authenticated) {
    return (
      <DeliveryEmptyState
        type="error"
        title="Authentication Required"
        description="Please sign in to submit delivery requests. Only registered users can access delivery services."
        actionLabel="Sign In"
        onAction={() => window.location.href = '/auth'}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-r from-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Package className="h-5 w-5" />
            Request Professional Delivery Service
          </CardTitle>
          <CardDescription>
            Submit a delivery request for construction materials. Our verified providers will respond with quotes and availability.
          </CardDescription>
        </CardHeader>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Service Coverage:</strong> Currently available in Nairobi, Mombasa, Kisumu, and surrounding areas. 
          Delivery fees vary based on distance and material type.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pickup Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Pickup Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address *</Label>
                <Textarea
                  id="pickupAddress"
                  placeholder="Enter detailed pickup address including landmarks"
                  value={formData.pickupAddress}
                  onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                  required
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Pickup Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Textarea
                  id="deliveryAddress"
                  placeholder="Enter detailed delivery address including landmarks"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  required
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special handling, access instructions, or timing requirements"
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Material Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Material Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="materialType">Material Type *</Label>
              <Select onValueChange={(value) => handleInputChange('materialType', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Number of units"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Estimated Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                placeholder="Weight in kg"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Requirements & Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Requirements & Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Required Vehicle Type</Label>
              <Select onValueChange={(value) => handleInputChange('requiredVehicleType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select onValueChange={(value) => handleInputChange('budgetRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={loading}
            size="lg"
            className="px-8"
          >
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Submit Delivery Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RefactoredDeliveryRequest;