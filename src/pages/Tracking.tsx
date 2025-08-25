import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DeliveryManagement from '@/components/DeliveryManagement';
import SiteMaterialRegister from '@/components/SiteMaterialRegister';
import { Package, Plane, MessageCircle, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Tracking = () => {
  const [activeTab, setActiveTab] = useState('delivery');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Get user profile and role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (!profileError && profileData) {
          setUserRole(profileData.role);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">UjenziPro Tracking & Monitoring Center</h1>
            <p className="text-lg text-muted-foreground">Track deliveries, monitor sites with drones, and communicate with your team</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full mb-8 ${userRole === 'admin' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Delivery Management Hub
              </TabsTrigger>
              {userRole === 'admin' && (
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Material Register
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="delivery" className="space-y-6">
              <DeliveryManagement userRole={userRole} user={user} />
            </TabsContent>

            {userRole === 'admin' && (
              <TabsContent value="register" className="space-y-6">
                <SiteMaterialRegister />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tracking;