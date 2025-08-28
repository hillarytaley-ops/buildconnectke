import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BuilderProfileSetup } from "@/components/builders/BuilderProfileSetup";
import { BuilderTabNavigation } from "@/components/builders/BuilderTabNavigation";
import { BuilderOverviewCards } from "@/components/builders/BuilderOverviewCards";
import { getTabsForUserType } from "@/config/builderTabs";
import { UserProfile, getUserBuilderState } from "@/types/userProfile";
import { useToast } from "@/hooks/use-toast";

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

const Builders = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    setProfileLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!user) {
        // Create a demo profile for now to show content
        const demoProfile: UserProfile = {
          id: 'demo-id',
          user_id: 'demo-user-id',
          role: 'builder',
          user_type: 'individual',
          is_professional: false,
          full_name: 'Demo Builder',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUserProfile(demoProfile);
        setLoading(false);
        setProfileLoading(false);
        return;
      }
      
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      // If no profile exists, create one
      if (profileError && profileError.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            role: 'builder',
            user_type: 'individual',
            is_professional: false,
            full_name: user.email?.split('@')[0] || 'User'
          })
          .select()
          .single();
          
        if (insertError) {
          throw new Error(`Profile creation error: ${insertError.message}`);
        }
        profile = newProfile;
      } else if (profileError) {
        throw new Error(`Profile fetch error: ${profileError.message}`);
      }
      
      setUserProfile(profile as UserProfile);
    } catch (error) {
      console.error('Error checking user profile:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setProfileLoading(false);
    }
  };

  // Loading component with more granular states
  const LoadingSpinner = ({ message = "Loading dashboard..." }: { message?: string }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );

  // Error component with retry functionality
  const ErrorState = () => (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Profile</AlertTitle>
          <AlertDescription className="mb-4">{error}</AlertDescription>
          <button 
            onClick={() => {
              setError(null);
              checkUserProfile();
            }}
            className="bg-destructive-foreground text-destructive px-4 py-2 rounded-md text-sm hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
        </Alert>
      </main>
      <Footer />
    </div>
  );

  // Handle keyboard navigation
  const handleKeyboardNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const tabs = ['overview', ...tabConfigs.map(tab => tab.id)];
      const currentIndex = tabs.indexOf(activeTab);
      
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
  };

  if (loading || profileLoading) return <LoadingSpinner message={profileLoading ? "Updating profile..." : "Loading dashboard..."} />;
  if (error) return <ErrorState />;
  
  // Show guest view for unauthenticated users
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-4">Builder Dashboard</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional tools for construction management and material sourcing
            </p>
            <div className="bg-card rounded-lg p-8 border max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">
                Access comprehensive tools for purchase orders, delivery management, and invoicing
              </p>
              <button 
                onClick={() => window.location.href = '/auth'}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!userProfile.role) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <BuilderProfileSetup userId={userProfile?.user_id} />
        <Footer />
      </div>
    );
  }

  const builderState = getUserBuilderState(userProfile);
  const { isProfessionalBuilder, isPrivateBuilder, isDeliveryProvider } = builderState;

  // Get tab configuration based on user type
  const tabConfigs = getTabsForUserType(isProfessionalBuilder, isPrivateBuilder, isDeliveryProvider);

  // Calculate dynamic grid columns
  const totalTabs = tabConfigs.length + 1; // +1 for overview tab
  const gridCols = Math.min(totalTabs, 8); // Max 8 columns to prevent overflow

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
          <BuilderTabNavigation 
            tabConfigs={tabConfigs}
            gridCols={gridCols}
            onKeyDown={handleKeyboardNavigation}
          />

          <TabsContent value="overview" className="space-y-6">
            <BuilderOverviewCards 
              tabConfigs={tabConfigs}
              userProfile={userProfile}
              onTabChange={setActiveTab}
            />
          </TabsContent>

          {/* Lazy loaded tab contents with enhanced suspense */}
          {tabConfigs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading {tab.label}...</p>
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