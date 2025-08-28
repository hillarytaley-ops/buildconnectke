import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, UserPlus, BarChart3 } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import DeliveryHeader from "@/components/delivery/DeliveryHeader";
import DeliveryTrackingSection from "@/components/delivery/DeliveryTrackingSection";
import RefactoredDeliveryRequest from "@/components/delivery/RefactoredDeliveryRequest";
import DeliveryProviders from "@/components/DeliveryProviders";
import DelivererApplication from "@/components/DelivererApplication";
import DeliveryAnalyticsDashboard from "@/components/delivery/DeliveryAnalyticsDashboard";
import AutomatedOptimizationEngine from "@/components/delivery/AutomatedOptimizationEngine";
import ExternalLogisticsIntegrations from "@/components/delivery/ExternalLogisticsIntegrations";
import { useDeliveryAuth } from "@/components/delivery/useDeliveryAuth";

const Delivery = () => {
  const [activeTab, setActiveTab] = useState("track");
  const { userRole, hasRole, loading, user } = useDeliveryAuth();

  // Base tabs available to all users
  const baseTabs = [
    {
      value: "track",
      label: "Track Delivery",
      icon: Package,
      description: "Track your deliveries in real-time",
      component: <DeliveryTrackingSection userRole={userRole} canEdit={hasRole(['supplier', 'admin'])} userId={user?.profile?.id} />
    },
    {
      value: "request",
      label: "Request Delivery",
      icon: Truck,
      description: "Submit a new delivery request",
      component: <RefactoredDeliveryRequest />
    },
    {
      value: "providers",
      label: "Find Providers",
      icon: BarChart3,
      description: "Browse available delivery providers",
      component: <DeliveryProviders />
    },
    {
      value: "apply",
      label: "Become Provider",
      icon: UserPlus,
      description: "Apply to become a delivery provider",
      component: <DelivererApplication />
    }
  ];

  // Admin-only tabs
  const adminTabs = [
    {
      value: "all-deliveries",
      label: "All Deliveries",
      icon: Package,
      description: "View all delivery records",
      component: <DeliveryTrackingSection userRole={userRole} canEdit={true} userId={user?.profile?.id} />
    },
    {
      value: "pending",
      label: "Pending",
      icon: Package,
      description: "View pending deliveries",
      component: <DeliveryTrackingSection userRole={userRole} canEdit={true} userId={user?.profile?.id} />
    },
    {
      value: "in-transit",
      label: "In Transit",
      icon: Truck,
      description: "View deliveries in transit",
      component: <DeliveryTrackingSection userRole={userRole} canEdit={true} userId={user?.profile?.id} />
    },
    {
      value: "delivered",
      label: "Delivered",
      icon: Package,
      description: "View completed deliveries",
      component: <DeliveryTrackingSection userRole={userRole} canEdit={true} userId={user?.profile?.id} />
    },
    {
      value: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Advanced delivery analytics dashboard",
      component: <DeliveryAnalyticsDashboard userId={user?.profile?.id} userRole={userRole} />
    },
    {
      value: "optimization",
      label: "AI Optimization",
      icon: Package,
      description: "Automated delivery optimization engine",
      component: <AutomatedOptimizationEngine userId={user?.profile?.id} userRole={userRole} />
    },
    {
      value: "integrations",
      label: "Integrations",
      icon: Truck,
      description: "External logistics provider integrations",
      component: <ExternalLogisticsIntegrations userId={user?.profile?.id} userRole={userRole} />
    }
  ];

  // Combine tabs based on user role
  const tabs = userRole === 'admin' ? [...baseTabs, ...adminTabs] : baseTabs;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-construction">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading delivery management...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Dashboard is accessible to everyone
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-construction">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <DeliveryHeader userRole={userRole} />

          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-auto p-1 bg-muted/50">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs opacity-70 hidden sm:block">{tab.description}</div>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-6 space-y-6">
                  <ErrorBoundary>
                    {tab.component}
                  </ErrorBoundary>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Delivery;