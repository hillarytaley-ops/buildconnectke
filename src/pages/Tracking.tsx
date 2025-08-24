import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DeliveryManagement from '@/components/DeliveryManagement';
import DroneMonitor from '@/components/DroneMonitor';
import DeliveryCommunication from '@/components/DeliveryCommunication';
import { Package, Plane, MessageCircle, Truck } from 'lucide-react';

const Tracking = () => {
  const [activeTab, setActiveTab] = useState('delivery');

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">JengaPro Tracking & Monitoring Center</h1>
            <p className="text-lg text-muted-foreground">Track deliveries, monitor sites with drones, and communicate with your team</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Delivery Management
              </TabsTrigger>
              <TabsTrigger value="drone" className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Drone Monitoring
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Communication Hub
              </TabsTrigger>
            </TabsList>

            <TabsContent value="delivery" className="space-y-6">
              <DeliveryManagement />
            </TabsContent>

            <TabsContent value="drone" className="space-y-6">
              <DroneMonitor />
            </TabsContent>

            <TabsContent value="communication" className="space-y-6">
              <DeliveryCommunication />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tracking;