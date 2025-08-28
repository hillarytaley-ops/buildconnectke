import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Star, Package, Store, Filter, Grid, List, Building, ShoppingBag, FileText, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SupplierRegistrationForm from "@/components/SupplierRegistrationForm";
import QRCodeManager from "@/components/QRCodeManager";
import DeliveryNoteForm from "@/components/DeliveryNoteForm";
import SecureSuppliersDirectory from "@/components/SecureSuppliersDirectory";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';

const Suppliers = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("suppliers");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Get user role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching user role:', profileError);
        } else {
          setUserRole(profileData?.role);
          // Set default tab based on role
          if (profileData?.role === 'supplier') {
            setActiveTab("delivery-notes");
          } else {
            setActiveTab("suppliers");
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Materials data from the Materials page
  const materials = [
    {
      name: "Bamburi Cement 50kg",
      supplier: "Bamburi Cement",
      location: "Nairobi", 
      price: "KSh 650",
      rating: 4.8,
      image: "https://bamburigroup.com/wp-content/uploads/2025/03/buy-bamburi-Nguvu-cement-2.jpg",
      category: "Cement"
    },
    {
      name: "Steel Rebar 12mm",
      supplier: "Devki Steel Mills",
      location: "Ruiru",
      price: "KSh 85/meter",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop",
      category: "Steel"
    },
    {
      name: "Ceramic Floor Tiles",
      supplier: "RAK Ceramics",
      location: "Mombasa",
      price: "KSh 1,200/sqm",
      rating: 4.9,
      image: "https://tse2.mm.bing.net/th/id/OIP.40qwclKORLc6XF2y9jo47wHaGv?rs=1&pid=ImgDetMain&o=7&rm=3",
      category: "Tiles"
    },
    {
      name: "Quarry Stones",
      supplier: "Nairobi Quarries",
      location: "Kasarani",
      price: "KSh 3,500/tonne",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=400&h=300&fit=crop",
      category: "Aggregates"
    },
    {
      name: "Roofing Iron Sheets",
      supplier: "Mabati Rolling Mills",
      location: "Nakuru",
      price: "KSh 850/sheet",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&h=300&fit=crop",
      category: "Roofing"
    },
    {
      name: "Paint - Emulsion 20L",
      supplier: "Crown Paints",
      location: "Thika",
      price: "KSh 4,200",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=400&h=300&fit=crop",
      category: "Paint"
    }
  ];

  const materialCategories = [
    "All Categories", "Cement", "Steel", "Tiles", "Aggregates", 
    "Roofing", "Paint", "Timber", "Hardware", "Plumbing", "Electrical"
  ];

  if (showRegistrationForm) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-construction">
          <Navigation />
          <div className="container mx-auto px-4 py-8">
            <Button 
              variant="outline" 
              onClick={() => setShowRegistrationForm(false)}
              className="mb-6"
              aria-label="Go back to suppliers directory"
            >
              ← Back to Suppliers
            </Button>
            <SupplierRegistrationForm />
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-construction">
      <Navigation />

      {/* Professional Hero Section */}
      <section className="bg-gradient-hero text-text-on-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-earth-brown/20 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-card/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Verified Construction Marketplace</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Professional Construction 
              <span className="text-construction-orange block">Materials & Suppliers</span>
            </h1>
            <p className="text-xl mb-8 text-text-primary-light max-w-2xl mx-auto leading-relaxed">
              Connect with Kenya's most trusted suppliers. Quality materials, competitive pricing, and verified professionals for your construction projects.
            </p>
          
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl mx-auto mb-10">
              <TabsList className={`grid w-full ${userRole === 'supplier' ? 'grid-cols-4' : 'grid-cols-2'} bg-card/10 backdrop-blur-sm border border-white/20 p-1`}>
                <TabsTrigger value="suppliers" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Suppliers</span>
                </TabsTrigger>
                <TabsTrigger value="materials" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">Materials</span>
                </TabsTrigger>
                {userRole === 'supplier' && (
                  <>
                    <TabsTrigger value="qr-codes" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Package className="h-4 w-4" />
                      <span className="hidden sm:inline">QR Codes</span>
                    </TabsTrigger>
                    <TabsTrigger value="delivery-notes" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Notes</span>
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
            </Tabs>
          
            {/* Professional Search Interface */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary-light" />
                    <Input 
                      placeholder="Search materials, suppliers, or categories..." 
                      className="pl-12 py-4 text-lg bg-card border-white/20 text-foreground placeholder:text-text-secondary-light focus:border-construction-orange"
                    />
                  </div>
                  <Button size="lg" className="bg-construction-orange hover:bg-construction-orange/90 text-text-on-dark px-8 py-4 font-semibold">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Category Pills */}
              <div className="flex flex-wrap gap-3 justify-center">
                {materialCategories.slice(0, 6).map((category, index) => (
                  <Badge 
                    key={index} 
                    variant={index === 0 ? "default" : "secondary"} 
                    className={`cursor-pointer px-6 py-3 text-sm font-medium transition-all duration-200 ${
                      index === 0 
                        ? "bg-construction-orange text-text-on-dark hover:bg-construction-orange/90" 
                        : "bg-card/20 text-text-primary-light border-white/20 hover:bg-construction-orange/20 hover:border-construction-orange/50"
                    }`}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {userRole === 'supplier' && (
            <>
              <TabsContent value="qr-codes" className="space-y-8">
                <QRCodeManager />
              </TabsContent>
              
              <TabsContent value="delivery-notes" className="space-y-8">
                <DeliveryNoteForm />
              </TabsContent>
            </>
          )}
          
          <TabsContent value="suppliers" className="space-y-8">
            <div className="space-y-8">
              <SecureSuppliersDirectory />
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-8">
            {/* Professional Filters and View Options */}
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary">
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filters
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{materials.length}</span>
                      <span>materials available</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">View:</span>
                    <Button variant="outline" size="sm" className="border-primary/20">
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {materials.map((material, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-border bg-card overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                      <img 
                        src={material.image} 
                        alt={material.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                          {material.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <CardTitle className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                          {material.name}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          by <span className="font-medium text-foreground">{material.supplier}</span>
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{material.location}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-safety-yellow/10 px-2 py-1 rounded-full">
                          <Star className="h-4 w-4 text-safety-yellow fill-current" />
                          <span className="font-medium text-foreground">{material.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <div className="text-2xl font-bold text-construction-orange">{material.price}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary">
                            Quote
                          </Button>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Professional Load More Section */}
            <div className="text-center pt-8">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-12 py-4 font-semibold"
              >
                View All Materials
                <Package className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Suppliers;