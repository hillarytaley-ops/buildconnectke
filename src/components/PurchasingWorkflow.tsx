import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, User, ShoppingCart, FileText, ArrowRight, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUserBuilderState, type UserProfile } from "@/types/userProfile";
import ComprehensivePurchaseOrder from "./ComprehensivePurchaseOrder";
import PrivateBuilderDirectPurchase from "./PrivateBuilderDirectPurchase";

const PurchasingWorkflow = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<'tender' | 'direct' | null>(null);

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load user profile');
        return;
      }

      setUserProfile(profile as UserProfile);
      
      // Auto-select workflow based on user type
      const builderState = getUserBuilderState(profile as UserProfile);
      if (builderState.isProfessionalBuilder) {
        setSelectedWorkflow('tender');
      } else if (builderState.isPrivateBuilder) {
        setSelectedWorkflow('direct');
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      toast.error('Authentication error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please log in to access the purchasing system.
          </p>
        </CardContent>
      </Card>
    );
  }

  const builderState = getUserBuilderState(userProfile);

  // Non-builders should not access this component
  if (!builderState.isProfessionalBuilder && !builderState.isPrivateBuilder) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This purchasing system is exclusively for builders.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If workflow is already selected, show the appropriate component
  if (selectedWorkflow === 'tender') {
    return <ComprehensivePurchaseOrder />;
  }

  if (selectedWorkflow === 'direct') {
    return <PrivateBuilderDirectPurchase />;
  }

  // Show workflow selection (this should rarely be seen due to auto-selection)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Material Purchasing System</CardTitle>
          <CardDescription>
            Choose your purchasing method based on your builder type
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Builder - Tender Process */}
        <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          builderState.isProfessionalBuilder ? 'border-primary shadow-sm' : 'opacity-60'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Professional Builder / Company
              {builderState.isProfessionalBuilder && (
                <Badge variant="default" className="ml-auto">Your Type</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Formal tender process with purchase orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span>Create formal purchase orders</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>Supplier tender responses</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight className="h-4 w-4" />
                <span>Approval workflow</span>
              </div>
            </div>
            
            {builderState.isProfessionalBuilder && (
              <Button 
                onClick={() => setSelectedWorkflow('tender')} 
                className="w-full"
              >
                Start Purchase Order Process
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            {!builderState.isProfessionalBuilder && (
              <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                Available for professional builders and companies only
              </div>
            )}
          </CardContent>
        </Card>

        {/* Private Builder - Direct Purchase */}
        <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          builderState.isPrivateBuilder ? 'border-primary shadow-sm' : 'opacity-60'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Private / Individual Builder
              {builderState.isPrivateBuilder && (
                <Badge variant="default" className="ml-auto">Your Type</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Direct purchasing from suppliers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <ShoppingCart className="h-4 w-4" />
                <span>Buy directly from suppliers</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>Instant payment processing</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight className="h-4 w-4" />
                <span>Immediate receipt & QR codes</span>
              </div>
            </div>
            
            {builderState.isPrivateBuilder && (
              <Button 
                onClick={() => setSelectedWorkflow('direct')} 
                className="w-full"
              >
                Start Direct Purchase
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            {!builderState.isPrivateBuilder && (
              <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                Available for private/individual builders only
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workflow Explanation */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Professional Builders</h4>
              <p className="text-xs text-muted-foreground">
                Must follow formal procurement processes with purchase orders, supplier responses, 
                and approval workflows for compliance and audit trails.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Private Builders</h4>
              <p className="text-xs text-muted-foreground">
                Can purchase materials directly from suppliers with immediate payment processing, 
                automatic receipt generation, and QR code creation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchasingWorkflow;