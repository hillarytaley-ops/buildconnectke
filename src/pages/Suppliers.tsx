import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, ShoppingBag, FileText, Package, Store, Database, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SupplierRegistrationForm from "@/components/SupplierRegistrationForm";
import QRCodeManager from "@/components/QRCodeManager";
import DeliveryNoteForm from "@/components/DeliveryNoteForm";
import { SupplierGrid } from "@/components/suppliers/SupplierGrid";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from "@/types/supplier";
import { useToast } from "@/hooks/use-toast";

const Suppliers = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("suppliers");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Get user role - try to get profile, create if doesn't exist
        let { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (profileError || !profileData) {
          console.log('No profile found or error, using default role');
          // Set default role if no profile found
          setUserRole('builder');
          setIsAdmin(false);
          setActiveTab("suppliers");
        } else {
          setUserRole(profileData?.role);
          setIsAdmin(profileData?.role === 'admin');
          // Set default tab based on role
          if (profileData?.role === 'supplier') {
            setActiveTab("delivery-notes");
          } else {
            setActiveTab("suppliers");
          }
        }
      } else {
        // No authenticated user, set default values to allow page viewing
        setUser(null);
        setUserRole(null);
        setIsAdmin(false);
        setActiveTab("suppliers");
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Don't show error toast, just set defaults to allow page viewing
      setUser(null);
      setUserRole(null);
      setIsAdmin(false);
      setActiveTab("suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierSelect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    toast({
      title: "Supplier Selected",
      description: `Viewing ${supplier.company_name} catalog`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-construction flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading suppliers directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-construction">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-red-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Construction Materials & Supplies Marketplace</h1>
          <p className="text-xl mb-8 opacity-90">Connect with verified suppliers and find quality construction materials nationwide</p>
          
          {/* Admin Controls */}
          <div className="flex justify-center gap-4 mb-8">
            {isAdmin && (
              <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                Admin View - Full Access
              </Badge>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
            <TabsList className={`grid w-full ${userRole === 'supplier' ? 'grid-cols-3' : isAdmin ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <TabsTrigger value="suppliers" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Suppliers
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="registered-users" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Registered Users
                </TabsTrigger>
              )}
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

          {isAdmin && (
            <TabsContent value="registered-users" className="space-y-8">
              <div className="bg-muted rounded-lg p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-4">Registered Users Management</h3>
                <p className="text-lg mb-6 opacity-90">Admin view of all registered builders and suppliers</p>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Admin Dashboard - Coming Soon
                </Badge>
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="suppliers" className="space-y-8">
            <SupplierGrid onSupplierSelect={handleSupplierSelect} />
            
            {/* Join as Supplier Section */}
            <div className="bg-accent rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Grow Your Business?</h3>
              <p className="text-lg mb-6 opacity-90">Join our marketplace and connect with builders across Kenya</p>
              <Button 
                size="lg" 
                onClick={() => toast({
                  title: "Supplier Registration",
                  description: "Registration system coming soon! Contact us for early access.",
                })}
                className="bg-primary hover:bg-primary/90"
              >
                <Store className="h-5 w-5 mr-2" />
                Register as Supplier
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>


      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Verified Suppliers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">15,000+</div>
              <div className="text-muted-foreground">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">47</div>
              <div className="text-muted-foreground">Counties Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Suppliers;
