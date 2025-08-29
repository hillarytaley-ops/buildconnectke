import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DeliveryAccessGuard } from "@/components/security/DeliveryAccessGuard";
import DeliveryRequest from "@/components/DeliveryRequest";
import DeliveryProviders from "@/components/DeliveryProviders";
import DelivererApplication from "@/components/DelivererApplication";
import { Shield, Truck, UserCheck, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Delivery = () => {
  const [activeTab, setActiveTab] = useState("request");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        setUserRole(profile?.role || null);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-construction flex items-center justify-center">
        <LoadingSpinner message="Loading delivery services..." />
      </div>
    );
  }

  return (
    <DeliveryAccessGuard requiredAuth={true} allowedRoles={['builder', 'supplier', 'admin']} feature="delivery management">
      <div className="min-h-screen bg-gradient-construction">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {/* Secure Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Secure Delivery Management
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Comprehensive delivery solutions with privacy protection
            </p>
            
            {/* Security & Access Notice */}
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <UserCheck className="h-3 w-3 mr-1" />
                Authenticated Access
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                <Shield className="h-3 w-3 mr-1" />
                Privacy Protected
              </Badge>
              {userRole && (
                <Badge variant="outline" className="capitalize">
                  {userRole} Access
                </Badge>
              )}
            </div>

            {/* Privacy Notice */}
            <Alert className="max-w-2xl mx-auto mb-6 border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Privacy Protection:</strong> Sensitive information like addresses and financial details 
                are protected based on your role and business relationships. All delivery data is secured.
              </AlertDescription>
            </Alert>
          </div>

        <div className="mb-6 border-b border-border">
          <nav className="flex space-x-8" aria-label="Delivery Management">
            <button
              onClick={() => setActiveTab("request")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "request"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Request Delivery
            </button>
            <button
              onClick={() => setActiveTab("providers")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "providers"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Delivery Providers
            </button>
            <button
              onClick={() => setActiveTab("application")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "application"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Deliverer Application
            </button>
          </nav>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="request" className="space-y-6">
            <DeliveryRequest />
          </TabsContent>

          <TabsContent value="providers" className="space-y-6">
            <DeliveryProviders />
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <DelivererApplication />
          </TabsContent>

        </Tabs>
      </main>
      <Footer />
    </div>
  </DeliveryAccessGuard>
  );
};

export default Delivery;