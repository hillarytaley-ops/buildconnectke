import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building, Package, FileText, Truck, CreditCard, FileSignature, Receipt, Users, AlertCircle, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Lazy load components for better performance
const ComprehensivePurchaseOrder = lazy(() => import("@/components/ComprehensivePurchaseOrder"));
const PrivateBuilderDirectPurchase = lazy(() => import("@/components/PrivateBuilderDirectPurchase"));
const BuilderDeliveryNotes = lazy(() => import("@/components/BuilderDeliveryNotes"));
const DeliveryAcknowledgment = lazy(() => import("@/components/DeliveryAcknowledgment"));
const IndividualBuilderPayment = lazy(() => import("@/components/IndividualBuilderPayment"));
const GoodsReceivedNote = lazy(() => import("@/components/GoodsReceivedNote"));
const DeliveryNoteSigning = lazy(() => import("@/components/DeliveryNoteSigning"));
const InvoiceManager = lazy(() => import("@/components/InvoiceManager"));
const DeliveryProviderNotifications = lazy(() => import("@/components/DeliveryProviderNotifications"));

// TypeScript interfaces for better type safety
interface UserProfile {
  id: string;
  user_id: string;
  role: 'builder' | 'delivery_provider' | 'admin' | null;
  user_type: 'individual' | 'company' | null;
  is_professional: boolean;
  email?: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Array<'professional' | 'private' | 'delivery_provider'>;
  badge?: string;
}

const Builders = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profileError) {
          throw new Error(`Profile fetch error: ${profileError.message}`);
        }
        
        setUserProfile(profile as UserProfile);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  // Error component
  const ErrorState = () => (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Profile</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </main>
      <Footer />
    </div>
  );

  // Role assignment component
  const RoleAssignmentPrompt = () => (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Complete Your Profile
            </CardTitle>
            <CardDescription>
              Please complete your profile setup to access builder tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You need to set up your builder role and type to use this dashboard.
            </p>
            <Button onClick={() => window.location.href = '/auth'} className="w-full">
              Complete Profile Setup
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState />;
  if (!userProfile || !userProfile.role) return <RoleAssignmentPrompt />;

  const isProfessionalBuilder = userProfile.role === 'builder' && 
    (userProfile.user_type === 'company' || userProfile.is_professional);
  const isPrivateBuilder = userProfile.role === 'builder' && userProfile.user_type === 'individual';
  const isDeliveryProvider = userProfile.role === 'delivery_provider';

  // Dynamic tab configuration
  const tabConfigs: TabConfig[] = [
    // Professional Builder tabs
    ...(isProfessionalBuilder ? [
      { id: 'purchase-orders', label: 'Purchase Orders', icon: Package, roles: ['professional' as const], badge: 'Professional/Company' },
      { id: 'delivery-signing', label: 'Sign Delivery Notes', icon: FileSignature, roles: ['professional' as const], badge: 'Required Before Payment' },
      { id: 'invoices', label: 'Invoice Manager', icon: Receipt, roles: ['professional' as const], badge: 'Professional/Company' },
      { id: 'delivery-notes', label: 'Delivery Notes', icon: FileText, roles: ['professional' as const] },
      { id: 'acknowledgments', label: 'Acknowledge & Pay', icon: CreditCard, roles: ['professional' as const], badge: 'Secure Payments' },
      { id: 'goods-received', label: 'Goods Received', icon: FileText, roles: ['professional' as const], badge: 'Inventory Management' },
    ] : []),
    // Private Builder tabs
    ...(isPrivateBuilder ? [
      { id: 'direct-purchase', label: 'Direct Purchase', icon: Package, roles: ['private' as const], badge: 'Private Builders' },
      { id: 'private-payment', label: 'Payment Center', icon: CreditCard, roles: ['private' as const], badge: 'Secure Payments' },
    ] : []),
    // Delivery Provider tabs
    ...(isDeliveryProvider ? [
      { id: 'delivery-requests', label: 'Delivery Requests', icon: Truck, roles: ['delivery_provider' as const], badge: 'Delivery Provider' },
    ] : []),
  ];

  // Calculate dynamic grid columns
  const totalTabs = tabConfigs.length + 1; // +1 for overview tab
  const gridCols = Math.min(totalTabs, 8); // Max 8 columns to prevent overflow

  // Helper function to get tab descriptions
  const getTabDescription = (tabId: string): string => {
    const descriptions: Record<string, string> = {
      'purchase-orders': 'Create formal purchase orders with suppliers',
      'delivery-signing': 'Digitally sign delivery notes before payment',
      'invoices': 'Create and manage professional invoices',
      'delivery-notes': 'View and download delivery notes',
      'acknowledgments': 'Acknowledge deliveries and process payments',
      'goods-received': 'Generate GRN for delivered items',
      'direct-purchase': 'Buy materials directly from suppliers',
      'private-payment': 'Manage payments for delivered items',
      'delivery-requests': 'View and respond to delivery requests',
    };
    return descriptions[tabId] || '';
  };

  // Helper function to render tab content
  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case 'purchase-orders':
        return <ComprehensivePurchaseOrder />;
      case 'delivery-signing':
        return <DeliveryNoteSigning />;
      case 'invoices':
        return <InvoiceManager />;
      case 'delivery-notes':
        return <BuilderDeliveryNotes />;
      case 'acknowledgments':
        return <DeliveryAcknowledgment />;
      case 'goods-received':
        return <GoodsReceivedNote />;
      case 'direct-purchase':
        return <PrivateBuilderDirectPurchase />;
      case 'private-payment':
        return <IndividualBuilderPayment />;
      case 'delivery-requests':
        return <DeliveryProviderNotifications />;
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Builder Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive tools for construction professionals and material management
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="mr-2">
              Role: {userProfile.role}
            </Badge>
            <Badge variant="outline">
              Type: {userProfile.user_type === 'company' ? 'Company' : 
                     userProfile.is_professional ? 'Professional' : 'Individual'}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full mb-8 ${
            gridCols <= 4 ? 'grid-cols-4' : 
            gridCols <= 6 ? 'grid-cols-6' : 
            'grid-cols-8'
          }`}>
            <TabsTrigger value="overview">
              <Building className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            
            {tabConfigs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id}>
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tabConfigs.map((tab) => {
                const Icon = tab.icon;
                const description = getTabDescription(tab.id);
                
                return (
                  <Card 
                    key={tab.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer" 
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {tab.label}
                      </CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {tab.badge && <Badge variant="secondary">{tab.badge}</Badge>}
                    </CardContent>
                  </Card>
                );
              })}

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
                    {userProfile.user_type === 'company' ? 'Company' : 
                     userProfile.is_professional ? 'Professional' : 'Individual'}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lazy loaded tab contents with suspense */}
          {tabConfigs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }>
                {renderTabContent(tab.id)}
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Builders;