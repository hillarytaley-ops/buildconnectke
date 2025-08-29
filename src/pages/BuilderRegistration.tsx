import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const KENYAN_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi",
  "Kitale", "Garissa", "Nyeri", "Machakos", "Meru", "Kericho", "Embu",
  "Migori", "Kakamega", "Lamu", "Naivasha", "Nanyuki", "Voi", "Kilifi",
  "Lodwar", "Wajir", "Marsabit", "Moyale", "Chuka", "Kiambu", "Kajiado",
  "Murang'a", "Kirinyaga", "Nyandarua", "Laikipia", "Samburu", "Trans Nzoia",
  "Uasin Gishu", "Elgeyo Marakwet", "Nandi", "Baringo", "West Pokot", 
  "Turkana", "Bomet", "Narok", "Makueni", "Kitui", "Mwingi", "Tharaka Nithi", 
  "Isiolo", "Mandera", "Garissa"
];

const BUILDER_SPECIALTIES = [
  "Residential Construction", "Commercial Construction", "Road Construction",
  "Bridge Construction", "Electrical Installation", "Plumbing Systems",
  "Roofing", "Interior Design", "Landscaping", "Renovation & Remodeling",
  "Concrete Works", "Steel Construction", "HVAC Systems", "Solar Installation",
  "Water Systems", "Drainage Systems", "Foundation Work", "Masonry",
  "Carpentry", "Painting & Finishing"
];

const registrationSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  user_type: z.enum(["individual", "company"], {
    required_error: "Please select a builder type",
  }),
  company_name: z.string().optional(),
  registration_number: z.string().optional(),
  location: z.string().min(1, "Please select your location"),
  specialties: z.array(z.string()).min(1, "Please select at least one specialty"),
  years_experience: z.number().min(0, "Years of experience cannot be negative"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  license_number: z.string().optional(),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
  privacy_accepted: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy policy"
  })
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const BuilderRegistration = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      specialties: [],
      years_experience: 0,
      terms_accepted: false,
      privacy_accepted: false
    }
  });

  const userType = form.watch("user_type");

  const handleSpecialtyToggle = (specialty: string) => {
    const currentSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty];
    
    setSelectedSpecialties(currentSpecialties);
    form.setValue("specialties", currentSpecialties);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    try {
      // Here you would typically save to Supabase
      // For now, we'll simulate a successful registration
      
      console.log("Registration data:", {
        ...data,
        // Don't log sensitive data in production
        sensitive_data_protected: true
      });

      toast({
        title: "Registration Submitted Successfully",
        description: "Your application will be reviewed within 2-3 business days. You'll receive an email with next steps.",
      });

      // Reset form
      form.reset();
      setSelectedSpecialties([]);

    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Builder Network</h1>
            <p className="text-xl mb-8 opacity-90">
              Expand your business reach and connect with clients across Kenya
            </p>
            
            <Link to="/builders">
              <Button variant="outline" className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Data Protection Notice */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                Your Information is Protected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Secure Encryption</p>
                    <p className="text-muted-foreground">All data transmitted using industry-standard SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Verified Process</p>
                    <p className="text-muted-foreground">Manual review ensures quality and authenticity</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Privacy Compliant</p>
                    <p className="text-muted-foreground">Data used only for verification and platform services</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Builder Registration Application</CardTitle>
              <p className="text-muted-foreground">
                Complete the form below to join our network of professional builders
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="+254 700 000 000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>County *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your county" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {KENYAN_COUNTIES.map((county) => (
                                  <SelectItem key={county} value={county}>
                                    {county}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Business Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="user_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Builder Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select builder type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="individual">Individual Builder</SelectItem>
                              <SelectItem value="company">Construction Company</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {userType === "company" && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="company_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="registration_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Registration Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter registration number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="years_experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="license_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional License Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter license number (if applicable)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Specialties</h3>
                    <FormField
                      control={form.control}
                      name="specialties"
                      render={() => (
                        <FormItem>
                          <FormLabel>Select Your Specialties *</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {BUILDER_SPECIALTIES.map((specialty) => (
                              <div key={specialty} className="flex items-center space-x-2">
                                <Checkbox
                                  id={specialty}
                                  checked={selectedSpecialties.includes(specialty)}
                                  onCheckedChange={() => handleSpecialtyToggle(specialty)}
                                />
                                <Label htmlFor={specialty} className="text-sm font-normal">
                                  {specialty}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {selectedSpecialties.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedSpecialties.map((specialty) => (
                                <Badge key={specialty} variant="secondary">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Profile Description</h3>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Your Services *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your services, experience, and what makes you unique (minimum 50 characters)"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Terms and Privacy */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Terms & Conditions</h3>
                    
                    <FormField
                      control={form.control}
                      name="terms_accepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              I accept the Terms and Conditions *
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              By checking this box, you agree to our platform terms of service
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="privacy_accepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              I accept the Privacy Policy *
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              We handle your data securely and never share personal information without consent
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Registration"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuilderRegistration;