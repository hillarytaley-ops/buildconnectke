
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Star, Users, Hammer, Building, Calculator, CheckCircle, ShoppingCart, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MaterialCalculationForm from "@/components/MaterialCalculationForm";
import ApprovalRequestForm from "@/components/ApprovalRequestForm";
import SourcingQuotationForm from "@/components/SourcingQuotationForm";
import ComprehensivePurchaseOrder from "@/components/ComprehensivePurchaseOrder";
import BuilderDeliveryNotes from "@/components/BuilderDeliveryNotes";
import GoodsReceivedNote from "@/components/GoodsReceivedNote";
import DeliveryAcknowledgment from "@/components/DeliveryAcknowledgment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Builders = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error checking user access:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthorizedBuilder = userProfile && 
    userProfile.role === 'builder' && 
    (userProfile.user_type === 'company' || userProfile.is_professional);

  const builders = [
    {
      name: "Kamau Construction Ltd",
      location: "Nairobi",
      rating: 4.8,
      projects: 45,
      specialties: ["Residential", "Commercial"],
      image: "/placeholder.svg"
    },
    {
      name: "Mwangi Builders",
      location: "Kisumu",
      rating: 4.6,
      projects: 32,
      specialties: ["Infrastructure", "Industrial"],
      image: "/placeholder.svg"
    },
    {
      name: "Njeri Construction",
      location: "Mombasa",
      rating: 4.9,
      projects: 28,
      specialties: ["Residential", "Renovation"],
      image: "/placeholder.svg"
    },
    {
      name: "Otieno Contractors",
      location: "Nakuru",
      rating: 4.7,
      projects: 38,
      specialties: ["Commercial", "Infrastructure"],
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-construction">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="text-text-on-dark py-16 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/lovable-uploads/6ea15a8f-a981-4c02-a56e-64ed62ab7a57.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Trusted Builders in Kenya</h1>
          <p className="text-xl mb-8 text-text-secondary-light">Connect with verified construction professionals across the country</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search builders by name or specialty..." 
                className="pl-10 py-6 text-lg bg-background"
              />
            </div>
            <Button size="lg" className="bg-construction-orange hover:bg-construction-orange/90 px-8">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground">1,000+</div>
              <div className="text-muted-foreground">Registered Builders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-construction-orange">5,000+</div>
              <div className="text-muted-foreground">Completed Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">47</div>
              <div className="text-muted-foreground">Counties Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">95%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Builders Directory */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-secondary-foreground">Featured Builders</h2>
            <Button variant="outline">View All Builders</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {builders.map((builder, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src="/lovable-uploads/1359401c-47a1-40bb-be90-d89521e64ed5.png" 
                      alt="UjenziPro Builder Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{builder.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {builder.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="h-4 w-4 text-construction-orange fill-current" />
                    <span className="font-semibold">{builder.rating}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Hammer className="h-4 w-4" />
                      {builder.projects} projects
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4 justify-center">
                    {builder.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-16 text-text-on-dark relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/lovable-uploads/6ea15a8f-a981-4c02-a56e-64ed62ab7a57.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Are You a Builder?</h2>
          <p className="text-xl mb-8 text-text-secondary-light">Join UjenziPro and expand your business reach</p>
          <Button size="lg" className="bg-construction-orange hover:bg-construction-orange/90 text-foreground text-lg px-8 py-4">
            Register as Builder
          </Button>
        </div>
      </section>

      {/* Professional Builder Tools Section */}
      {isAuthorizedBuilder && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Professional Builder Tools</h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive tools for professional builders and companies
              </p>
            </div>
            
            <Tabs defaultValue="materials" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="materials" className="text-sm">
                  Material Calculation
                </TabsTrigger>
                <TabsTrigger value="approval" className="text-sm">
                  Approval Request
                </TabsTrigger>
                <TabsTrigger value="sourcing" className="text-sm">
                  Sourcing & Quotation
                </TabsTrigger>
                <TabsTrigger value="purchase" className="text-sm">
                  Purchase Order
                </TabsTrigger>
                <TabsTrigger value="delivery" className="text-sm">
                  Delivery Notes
                </TabsTrigger>
                <TabsTrigger value="acknowledgment" className="text-sm">
                  Acknowledge & Pay
                </TabsTrigger>
                <TabsTrigger value="grn" className="text-sm">
                  Goods Received Note
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="materials" className="mt-6">
                <MaterialCalculationForm />
              </TabsContent>
              
              <TabsContent value="approval" className="mt-6">
                <ApprovalRequestForm />
              </TabsContent>
              
              <TabsContent value="sourcing" className="mt-6">
                <SourcingQuotationForm />
              </TabsContent>
              
              <TabsContent value="purchase" className="mt-6">
                <ComprehensivePurchaseOrder />
              </TabsContent>
              
              <TabsContent value="delivery" className="mt-6">
                <BuilderDeliveryNotes />
              </TabsContent>

              <TabsContent value="acknowledgment" className="mt-6">
                <DeliveryAcknowledgment />
              </TabsContent>

              <TabsContent value="grn" className="mt-6">
                <GoodsReceivedNote />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Builders;
