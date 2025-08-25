import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeliveryRequest from "@/components/DeliveryRequest";
import DeliveryProviders from "@/components/DeliveryProviders";
import DelivererApplication from "@/components/DelivererApplication";

const Delivery = () => {
  const [activeTab, setActiveTab] = useState("request");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Delivery Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive delivery solutions for construction materials
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request" className="text-sm">
              Request Delivery
            </TabsTrigger>
            <TabsTrigger value="providers" className="text-sm">
              Delivery Providers
            </TabsTrigger>
            <TabsTrigger value="application" className="text-sm">
              Deliverer Application
            </TabsTrigger>
          </TabsList>

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
  );
};

export default Delivery;