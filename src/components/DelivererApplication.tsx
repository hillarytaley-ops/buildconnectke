import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, Truck, User, MapPin } from "lucide-react";

const DelivererApplication = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    providerName: "",
    providerType: "individual",
    phone: "",
    email: "",
    address: "",
    vehicleTypes: [],
    serviceAreas: [],
    capacityKg: "",
    hourlyRate: "",
    perKmRate: "",
    drivingLicenseNumber: "",
    drivingLicenseClass: "",
    drivingLicenseExpiry: "",
    contactPerson: ""
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  const vehicleOptions = [
    { value: "van", label: "Van" },
    { value: "truck", label: "Truck" },
    { value: "pickup", label: "Pickup Truck" },
    { value: "trailer", label: "Trailer" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "bicycle", label: "Bicycle" }
  ];

  const serviceAreaOptions = [
    { value: "nairobi", label: "Nairobi" },
    { value: "mombasa", label: "Mombasa" },
    { value: "kisumu", label: "Kisumu" },
    { value: "nakuru", label: "Nakuru" },
    { value: "eldoret", label: "Eldoret" },
    { value: "thika", label: "Thika" }
  ];

  const handleVehicleTypeChange = (vehicleType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      vehicleTypes: checked
        ? [...prev.vehicleTypes, vehicleType]
        : prev.vehicleTypes.filter(type => type !== vehicleType)
    }));
  };

  const handleServiceAreaChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: checked
        ? [...prev.serviceAreas, area]
        : prev.serviceAreas.filter(a => a !== area)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 5MB"
        });
        return;
      }
      setLicenseFile(file);
    }
  };

  const uploadLicenseDocument = async (userId: string) => {
    if (!licenseFile) return null;

    const fileExt = licenseFile.name.split('.').pop();
    const fileName = `${userId}/driving-license.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('driving-licenses')
      .upload(fileName, licenseFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading license:', error);
      throw error;
    }

    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "Please agree to the terms and conditions"
      });
      return;
    }

    if (formData.vehicleTypes.length === 0) {
      toast({
        variant: "destructive",
        title: "Vehicle Type Required",
        description: "Please select at least one vehicle type"
      });
      return;
    }

    if (formData.serviceAreas.length === 0) {
      toast({
        variant: "destructive",
        title: "Service Area Required",
        description: "Please select at least one service area"
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Upload license document if provided
      let licensePath = null;
      if (licenseFile) {
        licensePath = await uploadLicenseDocument(profile.id);
      }

      // Create delivery provider application
      const { error } = await supabase
        .from('delivery_providers')
        .insert({
          user_id: profile.id,
          provider_name: formData.providerName,
          provider_type: formData.providerType,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          contact_person: formData.contactPerson,
          vehicle_types: formData.vehicleTypes,
          service_areas: formData.serviceAreas,
          capacity_kg: formData.capacityKg ? parseFloat(formData.capacityKg) : null,
          hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
          per_km_rate: formData.perKmRate ? parseFloat(formData.perKmRate) : null,
          driving_license_number: formData.drivingLicenseNumber,
          driving_license_class: formData.drivingLicenseClass,
          driving_license_expiry: formData.drivingLicenseExpiry || null,
          driving_license_document_path: licensePath,
          driving_license_verified: false,
          is_verified: false,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your deliverer application has been submitted for review"
      });

      // Reset form
      setFormData({
        providerName: "",
        providerType: "individual",
        phone: "",
        email: "",
        address: "",
        vehicleTypes: [],
        serviceAreas: [],
        capacityKg: "",
        hourlyRate: "",
        perKmRate: "",
        drivingLicenseNumber: "",
        drivingLicenseClass: "",
        drivingLicenseExpiry: "",
        contactPerson: ""
      });
      setLicenseFile(null);
      setAgreedToTerms(false);

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit application. Please try again."
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
            <User className="h-5 w-5" />
            Become a Delivery Provider
          </CardTitle>
          <CardDescription>
            Apply to join our network of verified delivery providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="providerName">Provider Name *</Label>
                  <Input
                    id="providerName"
                    value={formData.providerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, providerName: e.target.value }))}
                    placeholder="Your name or company name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="providerType">Provider Type *</Label>
                  <Select
                    value={formData.providerType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, providerType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+254 700 000 000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Your business or home address"
                />
              </div>

              {formData.providerType === "company" && (
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Main contact person name"
                  />
                </div>
              )}
            </div>

            {/* Vehicle & Service Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Vehicle & Service Information
              </h3>

              <div className="space-y-2">
                <Label>Vehicle Types * (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vehicleOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={formData.vehicleTypes.includes(option.value)}
                        onCheckedChange={(checked) => handleVehicleTypeChange(option.value, checked as boolean)}
                      />
                      <Label htmlFor={option.value} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Service Areas * (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {serviceAreaOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`area-${option.value}`}
                        checked={formData.serviceAreas.includes(option.value)}
                        onCheckedChange={(checked) => handleServiceAreaChange(option.value, checked as boolean)}
                      />
                      <Label htmlFor={`area-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacityKg">Vehicle Capacity (kg)</Label>
                  <Input
                    id="capacityKg"
                    type="number"
                    value={formData.capacityKg}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacityKg: e.target.value }))}
                    placeholder="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="25.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perKmRate">Per KM Rate (USD)</Label>
                  <Input
                    id="perKmRate"
                    type="number"
                    step="0.01"
                    value={formData.perKmRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, perKmRate: e.target.value }))}
                    placeholder="1.50"
                  />
                </div>
              </div>
            </div>

            {/* Driving License Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Driving License Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.drivingLicenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, drivingLicenseNumber: e.target.value }))}
                    placeholder="DL123456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseClass">License Class</Label>
                  <Select
                    value={formData.drivingLicenseClass}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, drivingLicenseClass: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Class A - Motorcycle</SelectItem>
                      <SelectItem value="B">Class B - Light Vehicle</SelectItem>
                      <SelectItem value="C">Class C - Medium Vehicle</SelectItem>
                      <SelectItem value="D">Class D - Heavy Vehicle</SelectItem>
                      <SelectItem value="E">Class E - Articulated Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                  <Input
                    id="licenseExpiry"
                    type="date"
                    value={formData.drivingLicenseExpiry}
                    onChange={(e) => setFormData(prev => ({ ...prev, drivingLicenseExpiry: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseUpload">Upload Driving License (PDF, JPG, PNG - Max 5MB)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="licenseUpload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  {licenseFile && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Upload className="h-4 w-4" />
                      {licenseFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and privacy policy *
                </Label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting Application..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DelivererApplication;