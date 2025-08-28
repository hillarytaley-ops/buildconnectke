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
      <div className="min-h-screen bg-gradient-construction">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setShowRegistrationForm(false)}
            className="mb-6"
          >
            ← Back to Suppliers
          </Button>
          <SupplierRegistrationForm />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-construction">
      <Navigation />

      {/* Hero Section - Combined Materials & Suppliers */}
      <section className="bg-gradient-to-br from-black via-red-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Construction Materials & Supplies Marketplace</h1>
          <p className="text-xl mb-8 opacity-90">Find the best prices for quality construction materials and connect with verified suppliers nationwide</p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto mb-8">
            <TabsList className={`grid w-full ${userRole === 'supplier' ? 'grid-cols-4' : 'grid-cols-2'}`}>
              <TabsTrigger value="suppliers" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Materials
              </TabsTrigger>
              {userRole === 'supplier' && (
                <>
                  <TabsTrigger value="qr-codes" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    QR Codes
                  </TabsTrigger>
                  <TabsTrigger value="delivery-notes" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Delivery Notes
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search for materials, suppliers, or categories..." 
                  className="pl-10 py-6 text-lg bg-white"
                />
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                Search
              </Button>
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {materialCategories.slice(0, 6).map((category, index) => (
                <Badge 
                  key={index} 
                  variant={index === 0 ? "default" : "secondary"} 
                  className="cursor-pointer hover:bg-green-100 hover:text-green-800 px-4 py-2"
                >
                  {category}
                </Badge>
              ))}
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
            <SecureSuppliersDirectory />
            
            {/* Supplier Registration CTA */}
            <Card className="bg-gradient-to-r from-red-50 to-green-50 border-primary">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Are you a construction material supplier?</h3>
                    <p className="text-muted-foreground">
                      Join our network of verified suppliers and reach thousands of builders across Kenya
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => setShowRegistrationForm(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Register as Supplier
                    </Button>
                    <Button variant="outline">
                      Learn More
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Free Registration
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Verified Badge
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Nationwide Reach
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-8">
            {/* Filters and View Options for Materials */}
            <div className="flex justify-between items-center py-6 bg-muted rounded-lg px-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <span className="text-sm text-gray-600">Showing {materials.length} materials</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Featured Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={material.image} 
                        alt={material.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{material.name}</CardTitle>
                        <CardDescription className="mt-1">
                          by {material.supplier}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{material.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{material.location}</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{material.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-green-600">{material.price}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Quote</Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Select
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="text-center">
              <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                View All Materials
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Suppliers;