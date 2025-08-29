import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { DeliveryAccessGuard } from '@/components/security/DeliveryAccessGuard';
import DeliveryManagement from '@/components/DeliveryManagement';
import SiteMaterialRegister from '@/components/SiteMaterialRegister';
import { Package, Truck, Shield, Eye, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import DroneMonitor from '@/components/DroneMonitor';
import { SecurityAlert } from '@/components/security/SecurityAlert';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';

const Tracking = () => {
  const [activeTab, setActiveTab] = useState('delivery');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Enhanced security monitoring
  const { 
    validateSession, 
    monitorDataAccess, 
    checkRateLimit, 
    logSecurityEvent 
  } = useSecurityMonitor();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Enhanced security: Validate session and check rate limits
      const sessionValid = await validateSession();
      if (!sessionValid) {
        logSecurityEvent('invalid_session_access', 'Invalid session detected on tracking page', 'high');
        setLoading(false);
        return;
      }

      // Check rate limiting for tracking page access
      const rateLimitOk = await checkRateLimit('tracking_page', 50);
      if (!rateLimitOk) {
        logSecurityEvent('rate_limit_tracking', 'Rate limit exceeded for tracking page', 'medium');
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Monitor data access for profile information
        const accessAllowed = await monitorDataAccess('user_profiles', 'read');
        if (!accessAllowed) {
          logSecurityEvent('unauthorized_profile_access', 'Unauthorized profile access attempt', 'high');
          setLoading(false);
          return;
        }
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, is_professional, user_type')
          .eq('user_id', user.id)
          .single();
        
        if (profileData) {
          setUserRole(profileData.role);
          logSecurityEvent('tracking_page_access', `User with role ${profileData.role} accessed tracking page`, 'low');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      logSecurityEvent('auth_check_error', `Authentication check failed: ${error}`, 'medium');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-construction flex items-center justify-center">
        <LoadingSpinner message="Loading tracking dashboard..." />
      </div>
    );
  }

  return (
    <DeliveryAccessGuard requiredAuth={false} allowedRoles={['builder', 'supplier', 'admin']} feature="tracking dashboard">
      <div className="min-h-screen flex flex-col bg-gradient-construction">
        <SecurityAlert />
        <Navigation />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Simplified Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Secure Tracking & Monitoring
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Monitor deliveries and manage materials with privacy protection
              </p>

              {/* Access Control Notice */}
              <div className="flex justify-center gap-2 mb-6">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <Eye className="h-3 w-3 mr-1" />
                  Authorized Access
                </Badge>
                {userRole && (
                  <Badge variant="outline" className="capitalize">
                    {userRole} Dashboard
                  </Badge>
                )}
              </div>

              {/* Privacy Protection Alert */}
              <Alert className="max-w-2xl mx-auto mb-6 border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Secure Monitoring:</strong> All tracking data is protected. Location information 
                  and sensitive details are only visible to authorized personnel based on your role.
                </AlertDescription>
              </Alert>
            </div>

            {/* Simplified Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full mb-8 ${userRole === 'admin' ? 'grid-cols-3' : userRole === 'builder' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Delivery Hub
            </TabsTrigger>
            {(userRole === 'builder' || userRole === 'admin') && (
              <TabsTrigger value="drone" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Drone Observation
              </TabsTrigger>
            )}
            {userRole === 'admin' && (
              <TabsTrigger value="register" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Material Register
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="delivery" className="space-y-6">
            <DeliveryManagement userRole={userRole} user={user} />
          </TabsContent>

          {(userRole === 'builder' || userRole === 'admin') && (
            <TabsContent value="drone" className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50 mb-6">
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <strong>Drone Observation:</strong> Aerial monitoring for remote site observation. 
                  {userRole === 'admin' ? 'Full control available for administrators.' : 'View-only access for builders.'}
                </AlertDescription>
              </Alert>
              <DroneMonitor userRole={userRole} user={user} />
            </TabsContent>
          )}

          {userRole === 'admin' && (
            <TabsContent value="register" className="space-y-6">
              <Alert className="border-amber-200 bg-amber-50 mb-6">
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <strong>Admin Feature:</strong> Material register management is restricted to administrators. 
                  All data modifications are logged for security.
                </AlertDescription>
              </Alert>
              <SiteMaterialRegister />
            </TabsContent>
          )}
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </DeliveryAccessGuard>
  );
};

export default Tracking;