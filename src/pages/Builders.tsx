import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Package, FileText, Truck, CreditCard, FileSignature, Receipt, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComprehensivePurchaseOrder from "@/components/ComprehensivePurchaseOrder";
import PrivateBuilderDirectPurchase from "@/components/PrivateBuilderDirectPurchase";
import BuilderDeliveryNotes from "@/components/BuilderDeliveryNotes";
import DeliveryAcknowledgment from "@/components/DeliveryAcknowledgment";
import IndividualBuilderPayment from "@/components/IndividualBuilderPayment";
import GoodsReceivedNote from "@/components/GoodsReceivedNote";
import DeliveryNoteSigning from "@/components/DeliveryNoteSigning";
import InvoiceManager from "@/components/InvoiceManager";
import DeliveryProviderNotifications from "@/components/DeliveryProviderNotifications";

const Builders = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
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
      console.error('Error checking user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isProfessionalBuilder = userProfile?.role === 'builder' && 
    (userProfile?.user_type === 'company' || userProfile?.is_professional);
  const isPrivateBuilder = userProfile?.role === 'builder' && userProfile?.user_type === 'individual';
  const isDeliveryProvider = userProfile && userProfile.role === 'delivery_provider';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Builder Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive tools for construction professionals and material management
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-8">
            <TabsTrigger value="overview">
              <Building className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            
            {isProfessionalBuilder && (
              <>
                <TabsTrigger value="purchase-orders">
                  <Package className="h-4 w-4 mr-2" />
                  Purchase Orders
                </TabsTrigger>
                <TabsTrigger value="delivery-signing">
                  <FileSignature className="h-4 w-4 mr-2" />
                  Sign Delivery Notes
                </TabsTrigger>
                <TabsTrigger value="invoices">
                  <Receipt className="h-4 w-4 mr-2" />
                  Invoice Manager
                </TabsTrigger>
                <TabsTrigger value="delivery-notes">
                  <FileText className="h-4 w-4 mr-2" />
                  Delivery Notes
                </TabsTrigger>
                <TabsTrigger value="acknowledgments">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Acknowledge & Pay
                </TabsTrigger>
                <TabsTrigger value="goods-received">
                  <FileText className="h-4 w-4 mr-2" />
                  Goods Received
                </TabsTrigger>
              </>
            )}
            
            {isPrivateBuilder && (
              <>
                <TabsTrigger value="direct-purchase">
                  <Package className="h-4 w-4 mr-2" />
                  Direct Purchase
                </TabsTrigger>
                <TabsTrigger value="private-payment">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Center
                </TabsTrigger>
              </>
            )}
            
            {isDeliveryProvider && (
              <TabsTrigger value="delivery-requests">
                <Truck className="h-4 w-4 mr-2" />
                Delivery Requests
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isProfessionalBuilder && (
                <>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("purchase-orders")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Purchase Orders
                      </CardTitle>
                      <CardDescription>
                        Create formal purchase orders with suppliers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Professional/Company</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("delivery-signing")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileSignature className="h-5 w-5 text-primary" />
                        Sign Delivery Notes
                      </CardTitle>
                      <CardDescription>
                        Digitally sign delivery notes before payment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Required Before Payment</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("invoices")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        Invoice Manager
                      </CardTitle>
                      <CardDescription>
                        Create and manage professional invoices
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Professional/Company</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("acknowledgments")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Acknowledge & Pay
                      </CardTitle>
                      <CardDescription>
                        Acknowledge deliveries and process payments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Secure Payments</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("goods-received")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Goods Received Notes
                      </CardTitle>
                      <CardDescription>
                        Generate GRN for delivered items
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Inventory Management</Badge>
                    </CardContent>
                  </Card>
                </>
              )}

              {isPrivateBuilder && (
                <>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("direct-purchase")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Direct Purchase
                      </CardTitle>
                      <CardDescription>
                        Buy materials directly from suppliers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Private Builders</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("private-payment")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Payment Center
                      </CardTitle>
                      <CardDescription>
                        Manage payments for delivered items
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Secure Payments</Badge>
                    </CardContent>
                  </Card>
                </>
              )}

              {isDeliveryProvider && (
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("delivery-requests")}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Delivery Requests
                    </CardTitle>
                    <CardDescription>
                      View and respond to delivery requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">Delivery Provider</Badge>
                  </CardContent>
                </Card>
              )}

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Profile & Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your builder profile and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">
                    {userProfile?.user_type === 'company' ? 'Company' : 
                     userProfile?.is_professional ? 'Professional' : 'Individual'}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isProfessionalBuilder && (
            <>
              <TabsContent value="purchase-orders">
                <ComprehensivePurchaseOrder />
              </TabsContent>

              <TabsContent value="delivery-signing">
                <DeliveryNoteSigning />
              </TabsContent>

              <TabsContent value="invoices">
                <InvoiceManager />
              </TabsContent>

              <TabsContent value="delivery-notes">
                <BuilderDeliveryNotes />
              </TabsContent>

              <TabsContent value="acknowledgments">
                <DeliveryAcknowledgment />
              </TabsContent>

              <TabsContent value="goods-received">
                <GoodsReceivedNote />
              </TabsContent>
            </>
          )}

          {isPrivateBuilder && (
            <>
              <TabsContent value="direct-purchase">
                <PrivateBuilderDirectPurchase />
              </TabsContent>

              <TabsContent value="private-payment">
                <IndividualBuilderPayment />
              </TabsContent>
            </>
          )}

          {isDeliveryProvider && (
            <TabsContent value="delivery-requests">
              <DeliveryProviderNotifications />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Builders;