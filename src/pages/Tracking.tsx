import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DeliveryManagement from '@/components/DeliveryManagement';
import SiteMaterialRegister from '@/components/SiteMaterialRegister';
import { Package, Plane, MessageCircle, Truck } from 'lucide-react';

const Tracking = () => {
  const [activeTab, setActiveTab] = useState('delivery');

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
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Delivery Management Hub
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Material Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="delivery" className="space-y-6">
              <DeliveryManagement />
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <SiteMaterialRegister />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tracking;