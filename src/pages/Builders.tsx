import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Settings, Shield, ShoppingCart, Camera } from "lucide-react";
import { BuilderGrid } from "@/components/builders/BuilderGrid";
import { ContactBuilderModal } from "@/components/modals/ContactBuilderModal";
import { BuilderProfileModal } from "@/components/modals/BuilderProfileModal";
import { SecurityAlert } from "@/components/security/SecurityAlert";
import ProfessionalBuilderDashboard from "@/components/ProfessionalBuilderDashboard";
import PrivateBuilderDirectPurchase from "@/components/PrivateBuilderDirectPurchase";
import MonitoringServiceRequest from "@/components/MonitoringServiceRequest";
import { UserProfile } from "@/types/userProfile";
import { useToast } from "@/hooks/use-toast";

const Builders = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState<UserProfile & {
    company_name?: string;
    phone?: string;
    email?: string;
    location?: string;
  } | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Handle missing auth session gracefully - this is expected when not logged in
      if (authError || !user) {
        console.log('No authenticated user, showing public directory');
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profile) {
        setUserProfile(profile as UserProfile);
        setIsAdmin(profile.role === 'admin');
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuilderContact = (builder: UserProfile & { company_name?: string; phone?: string; email?: string; location?: string }) => {
    setSelectedBuilder(builder);
    setShowContactModal(true);
  };

  const handleBuilderProfile = (builder: UserProfile & { company_name?: string; phone?: string; email?: string; location?: string }) => {
    setSelectedBuilder(builder);
    setShowProfileModal(true);
  };

  const handleOpenContactFromProfile = () => {
    setShowProfileModal(false);
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading builders directory...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and a builder, show option to access dashboard
  const canAccessDashboard = userProfile && userProfile.role === 'builder';
  const isProfessionalBuilder = userProfile && userProfile.role === 'builder' && 
    (userProfile.is_professional || userProfile.user_type === 'company');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Professional Builders Directory</h1>
          <p className="text-xl mb-8 opacity-90">
            Find certified construction professionals across Kenya
          </p>
          
          {/* Admin/Builder Controls */}
          <div className="flex justify-center gap-4">
            {isAdmin && (
              <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                Admin View
              </Badge>
            )}
            {canAccessDashboard && (
              <Button
                variant="secondary"
                onClick={() => setShowDashboard(!showDashboard)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {showDashboard ? 'View Public Directory' : 'Builder Dashboard'}
              </Button>
            )}
            {!userProfile && (
              <Button
                variant="outline"
                onClick={() => window.location.href = '/builders/register'}
                className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
              >
                Register as Builder
              </Button>
            )}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Security Alert */}
        <SecurityAlert />

        {/* Dashboard for authenticated builders */}
        {showDashboard && canAccessDashboard ? (
          isProfessionalBuilder ? (
            <ProfessionalBuilderDashboard />
          ) : (
            <div className="space-y-6">
              {/* Private Builder Header */}
              <Card className="border-primary bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Shield className="h-5 w-5" />
                    Private Builder Dashboard
                  </CardTitle>
                  <CardDescription>
                    Direct material purchase and project monitoring services with enhanced security features.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Tabs for Private Builder Features */}
              <Tabs defaultValue="direct-purchase" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="direct-purchase" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Direct Purchase
                  </TabsTrigger>
                  <TabsTrigger value="monitoring" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Project Monitoring
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="direct-purchase" className="space-y-6">
                  <PrivateBuilderDirectPurchase />
                </TabsContent>

                <TabsContent value="monitoring" className="space-y-6">
                  <MonitoringServiceRequest />
                </TabsContent>
              </Tabs>
            </div>
          )
        ) : (
          /* Public Directory */
          <BuilderGrid 
            onBuilderContact={handleBuilderContact}
            onBuilderProfile={handleBuilderProfile}
            isAdmin={isAdmin}
          />
        )}
      </main>

      {/* Contact Modal */}
      {selectedBuilder && (
        <ContactBuilderModal
          builder={selectedBuilder}
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Profile Modal */}
      {selectedBuilder && (
        <BuilderProfileModal
          builder={selectedBuilder}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onContact={handleOpenContactFromProfile}
        />
      )}

      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="text-muted-foreground">Certified Builders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">500+</div>
              <div className="text-muted-foreground">Completed Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">47</div>
              <div className="text-muted-foreground">Counties Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Professional Support</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Builders;