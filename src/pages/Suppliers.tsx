import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, ShoppingBag, FileText, Package, Store } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SupplierRegistrationForm from "@/components/SupplierRegistrationForm";
import QRCodeManager from "@/components/QRCodeManager";
import DeliveryNoteForm from "@/components/DeliveryNoteForm";
import { SupplierGrid } from "@/components/suppliers/SupplierGrid";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from "@/types/supplier";
import { useToast } from "@/hooks/use-toast";

const Suppliers = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
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
        
        // If no profile exists, create one
        if (profileError && profileError.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              role: 'builder', // Default role
              user_type: 'individual',
              is_professional: false,
              full_name: user.email?.split('@')[0] || 'User'
            })
            .select('role')
            .single();
            
          if (!insertError) {
            profileData = newProfile;
          }
        }
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching user role:', profileError);
        } else {
          setUserRole(profileData?.role || 'builder');
          // Set default tab based on role
          if (profileData?.role === 'supplier') {
            setActiveTab("delivery-notes");
          } else {
            setActiveTab("suppliers");
          }
        }
      } else {
        // No user logged in, still show suppliers page
        setActiveTab("suppliers");
      }
    } catch (error) {
      console.error('Auth check error:', error);
      toast({
        title: "Authentication Error", 
        description: "Failed to check user authentication",
        variant: "destructive",
      });
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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-red-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Construction Materials & Supplies Marketplace</h1>
          <p className="text-xl mb-8 opacity-90">Connect with verified suppliers and find quality construction materials nationwide</p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
            <TabsList className={`grid w-full ${userRole === 'supplier' ? 'grid-cols-3' : 'grid-cols-1'}`}>
              <TabsTrigger value="suppliers" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Suppliers
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
            <SupplierGrid onSupplierSelect={handleSupplierSelect} />
            
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
