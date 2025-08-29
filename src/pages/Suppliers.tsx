import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, ShoppingBag, FileText, Package, Store, Database, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SupplierRegistrationForm from "@/components/SupplierRegistrationForm";
import QRCodeManager from "@/components/QRCodeManager";
import DeliveryNoteForm from "@/components/DeliveryNoteForm";
import { SupplierGrid } from "@/components/suppliers/SupplierGrid";
import { QuoteRequestModal } from "@/components/modals/QuoteRequestModal";
import { SupplierCatalogModal } from "@/components/modals/SupplierCatalogModal";
import PurchasingWorkflow from "@/components/PurchasingWorkflow";
import { RealTimeStats } from "@/components/suppliers/RealTimeStats";
import { SecurityAlert } from "@/components/security/SecurityAlert";
import { AdminAccessGuard } from "@/components/security/AdminAccessGuard";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from "@/types/supplier";
import { useToast } from "@/hooks/use-toast";
import { ModalProvider, useModal } from "@/contexts/ModalContext";

const SuppliersContent = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("suppliers");
  const { toast } = useToast();
  const { 
    modals, 
    openQuoteModal, 
    openCatalogModal, 
    openRegistrationModal,
    closeQuoteModal,
    closeCatalogModal,
    closeRegistrationModal
  } = useModal();

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
    openCatalogModal(supplier);
  };

  const handleQuoteRequest = (supplier: Supplier) => {
    openQuoteModal(supplier);
  };

  const handleShowRegistration = () => {
    openRegistrationModal();
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
    <AdminAccessGuard requiredRole="admin">
      <div className="min-h-screen bg-gradient-construction">
        <Navigation />

        {/* Admin-Only Hero Section */}
        <section className="bg-gradient-to-br from-black via-red-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">
              🔒 Secure Supplier Directory - Admin Access
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Confidential supplier database with full contact information and business details
            </p>
            
            {/* Security Notice */}
            <div className="flex justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                🛡️ Admin Only - Sensitive Data
              </Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                📊 {isAdmin ? 'Full Access' : 'Limited View'}
              </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
              <TabsList className={`grid w-full ${userRole === 'supplier' ? 'grid-cols-4' : isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <TabsTrigger value="suppliers" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Suppliers
                </TabsTrigger>
                <TabsTrigger value="purchase" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Purchase
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
          {/* Enhanced Security Alert for Admin */}
          <SecurityAlert 
            isAuthenticated={!!user}
            userRole={userRole}
            showContactInfo={isAdmin || userRole === 'supplier'}
            adminMessage="⚠️ ADMIN ACCESS: You are viewing sensitive supplier data including contact information, addresses, and business details. Handle with care."
          />

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
            {modals.registrationModal.isOpen ? (
              <SupplierRegistrationForm />
            ) : (
              <SupplierGrid 
                onSupplierSelect={handleSupplierSelect}
                onQuoteRequest={handleQuoteRequest}
              />
            )}
            
            {!modals.registrationModal.isOpen && (
              <div className="bg-accent rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Grow Your Business?</h3>
                <p className="text-lg mb-6 opacity-90">Join our marketplace and connect with builders across Kenya</p>
                <Button 
                  size="lg" 
                  onClick={handleShowRegistration}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Store className="h-5 w-5 mr-2" />
                  Register as Supplier
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="purchase" className="space-y-8">
            <PurchasingWorkflow />
          </TabsContent>
        </Tabs>
      </main>

      {/* Quote Request Modal */}
      {modals.quoteModal.supplier && (
        <QuoteRequestModal
          supplier={modals.quoteModal.supplier}
          isOpen={modals.quoteModal.isOpen}
          onClose={closeQuoteModal}
        />
      )}

      {/* Catalog Modal */}
      {modals.catalogModal.supplier && (
        <SupplierCatalogModal
          supplier={modals.catalogModal.supplier}
          isOpen={modals.catalogModal.isOpen}
          onClose={closeCatalogModal}
          onRequestQuote={handleQuoteRequest}
        />
      )}

      {/* Real-time Stats Section */}
      <RealTimeStats />

      <Footer />
    </div>
  </AdminAccessGuard>
  );
};

const Suppliers = () => {
  return (
    <ModalProvider>
      <SuppliersContent />
    </ModalProvider>
  );
};

export default Suppliers;
