import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Star, Package, Store, Filter, Grid, List, Building, ShoppingBag, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SupplierRegistrationForm from "@/components/SupplierRegistrationForm";
import QRCodeManager from "@/components/QRCodeManager";
import DeliveryNoteForm from "@/components/DeliveryNoteForm";
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

  const suppliers = [
    {
      name: "Bamburi Cement",
      location: "Mombasa", 
      rating: 4.8,
      products: 150,
      categories: ["Cement", "Concrete", "Building Solutions"],
      logo: "https://sl.bing.net/cQRoNrqCKWq"
    },
    {
      name: "Simba Cement",
      location: "Nairobi",
      rating: 4.7,
      products: 120,
      categories: ["Cement", "Lime", "Concrete Products"],
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "ARM Cement",
      location: "Kaloleni",
      rating: 4.6,
      products: 110,
      categories: ["Cement", "Steel", "Construction Materials"],
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Devki Steel Mills",
      location: "Ruiru",
      rating: 4.9,
      products: 200,
      categories: ["Steel", "Iron Sheets", "Wire Products"],
      logo: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Kenbro Industries",
      location: "Nairobi",
      rating: 4.5,
      products: 180,
      categories: ["Tiles", "Ceramics", "Sanitary Ware"],
      logo: "https://images.unsplash.com/photo-1616047006789-b7af710a8688?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Crown Paints Kenya",
      location: "Nairobi",
      rating: 4.7,
      products: 300,
      categories: ["Paint", "Coatings", "Construction Chemicals"],
      logo: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Sadolin Paints",
      location: "Nairobi",
      rating: 4.6,
      products: 250,
      categories: ["Paint", "Wood Finishes", "Industrial Coatings"],
      logo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Athi River Steel Plant",
      location: "Athi River",
      rating: 4.4,
      products: 160,
      categories: ["Steel", "Iron Bars", "Construction Steel"],
      logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Tile & Carpet Centre",
      location: "Nairobi",
      rating: 4.6,
      products: 240,
      categories: ["Tiles", "Carpets", "Flooring Solutions"],
      logo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Mabati Rolling Mills",
      location: "Nairobi",
      rating: 4.8,
      products: 180,
      categories: ["Iron Sheets", "Roofing", "Steel Products"],
      logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Chandaria Industries",
      location: "Nairobi",
      rating: 4.6,
      products: 170,
      categories: ["Pipes", "Plumbing", "Water Systems"],
      logo: "https://images.unsplash.com/photo-1621905252472-e8be3d5a2c8d?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Homa Lime Company",
      location: "Homa Bay",
      rating: 4.4,
      products: 90,
      categories: ["Lime", "Aggregates", "Mining Products"],
      logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "East African Portland Cement",
      location: "Athi River",
      rating: 4.5,
      products: 130,
      categories: ["Cement", "Lime", "Aggregates"],
      logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Kenblest Steel Fabricators",
      location: "Nairobi",
      rating: 4.7,
      products: 220,
      categories: ["Steel Fabrication", "Structural Steel", "Metalwork"],
      logo: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Kaluworks Company",
      location: "Nairobi",
      rating: 4.5,
      products: 200,
      categories: ["Aluminum", "Roofing", "Windows & Doors"],
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "General Plastics Limited",
      location: "Nairobi",
      rating: 4.4,
      products: 150,
      categories: ["Plastic Products", "Pipes", "Water Tanks"],
      logo: "https://images.unsplash.com/photo-1621905252472-e8be3d5a2c8d?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Nakuru Steel Fabricators",
      location: "Nakuru",
      rating: 4.3,
      products: 140,
      categories: ["Steel", "Iron Bars", "Fabrication"],
      logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Kisumu Hardware Depot",
      location: "Kisumu",
      rating: 4.5,
      products: 320,
      categories: ["Hardware", "Tools", "Building Materials"],
      logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Eldoret Building Supplies",
      location: "Eldoret",
      rating: 4.4,
      products: 280,
      categories: ["Timber", "Hardware", "Roofing Materials"],
      logo: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Mombasa Timber Merchants",
      location: "Mombasa",
      rating: 4.6,
      products: 210,
      categories: ["Timber", "Plywood", "Wood Products"],
      logo: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Thika Steel Works",
      location: "Thika",
      rating: 4.3,
      products: 160,
      categories: ["Steel", "Wire", "Construction Steel"],
      logo: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Machakos Quarries",
      location: "Machakos",
      rating: 4.2,
      products: 80,
      categories: ["Aggregates", "Stone", "Sand"],
      logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Nyeri Building Materials",
      location: "Nyeri",
      rating: 4.4,
      products: 190,
      categories: ["Cement", "Hardware", "Roofing"],
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=center"
    },
    {
      name: "Meru Construction Supplies",
      location: "Meru",
      rating: 4.3,
      products: 170,
      categories: ["Tiles", "Paint", "Hardware"],
      logo: "https://images.unsplash.com/photo-1616047006789-b7af710a8688?w=80&h=80&fit=crop&crop=center"
    }
  ];

  const categories = [
    { name: "Cement", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&h=150&fit=crop" },
    { name: "Steel", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=150&h=150&fit=crop" },
    { name: "Tiles", image: "https://images.unsplash.com/photo-1616047006789-b7af710a8688?w=150&h=150&fit=crop" },
    { name: "Paint", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=150&h=150&fit=crop" },
    { name: "Timber", image: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=150&h=150&fit=crop" },
    { name: "Hardware", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&h=150&fit=crop" },
    { name: "Plumbing", image: "https://images.unsplash.com/photo-1621905252472-e8be3d5a2c8d?w=150&h=150&fit=crop" },
    { name: "Electrical", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop" }
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
            {/* Filters and View Options */}
            <div className="flex justify-between items-center py-6 bg-muted rounded-lg px-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <span className="text-sm text-gray-600">Showing {suppliers.length} suppliers</span>
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

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={supplier.logo} 
                          alt={supplier.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {supplier.location}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Products</span>
                        <span className="font-medium">{supplier.products}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{supplier.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {supplier.categories.slice(0, 3).map((category, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Quote
                        </Button>
                        <Button size="sm" className="flex-1">
                          Select
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Join as Supplier Section */}
            <div className="bg-accent rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Grow Your Business?</h3>
              <p className="text-lg mb-6 opacity-90">Join our marketplace and connect with builders across Kenya</p>
              <Button 
                size="lg" 
                onClick={() => setShowRegistrationForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Store className="h-5 w-5 mr-2" />
                Register as Supplier
              </Button>
            </div>
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

      {/* Categories Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Material Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="text-center cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="py-6">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-sm font-medium">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Buy Section */}
      <section className="bg-accent py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Who Can Buy?</h2>
          <p className="text-lg opacity-90 mb-12">Our marketplace serves everyone in the construction ecosystem</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏗️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Professional Builders</h3>
              <p className="opacity-90">Construction companies and contractors working on large-scale projects</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Homeowners</h3>
              <p className="opacity-90">Private individuals building or renovating their homes</p>
            </div>
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔨</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">DIY Enthusiasts</h3>
              <p className="opacity-90">Individuals working on home improvement and personal projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-black">500+</div>
              <div className="text-gray-600">Verified Suppliers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">15,000+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">47</div>
              <div className="text-gray-600">Counties Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Suppliers Directory */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Verified Material Suppliers</h2>
            <Button variant="outline">View All Suppliers</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {suppliers.map((supplier, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {supplier.logo ? (
                      <img 
                        src={supplier.logo} 
                        alt={`${supplier.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="h-8 w-8 text-gray-600" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {supplier.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{supplier.rating}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Package className="h-4 w-4" />
                      {supplier.products} products
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4 justify-center">
                    {supplier.categories.map((category, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    View Catalog
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Price Alert CTA */}
      <section 
        className="text-white py-16 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/lovable-uploads/6ea15a8f-a981-4c02-a56e-64ed62ab7a57.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Get Price Alerts & Become a Supplier</h2>
          <p className="text-lg opacity-90 mb-8">Never miss a great deal! Set up alerts for your favorite materials or register as a supplier to reach thousands of builders</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Set Up Price Alerts
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white text-black hover:bg-gray-100"
              onClick={() => setShowRegistrationForm(true)}
            >
              Register as Supplier
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Suppliers;
