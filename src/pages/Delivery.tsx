import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeliveryRequest from "@/components/DeliveryRequest";
import DeliveryProviders from "@/components/DeliveryProviders";
import DelivererApplication from "@/components/DelivererApplication";
import SiteMaterialRegister from "@/components/SiteMaterialRegister";

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

        <div className="mb-6 border-b border-border">
          <nav className="flex space-x-8" aria-label="Delivery Management">
            <button
              onClick={() => setActiveTab("request")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "request"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Request Delivery
            </button>
            <button
              onClick={() => setActiveTab("providers")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "providers"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Delivery Providers
            </button>
            <button
              onClick={() => setActiveTab("application")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "application"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Deliverer Application
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "register"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Material Register
            </button>
          </nav>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="request" className="space-y-6">
            <DeliveryRequest />
          </TabsContent>

          <TabsContent value="providers" className="space-y-6">
            <DeliveryProviders />
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <DelivererApplication />
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <SiteMaterialRegister />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Delivery;