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

  const tabs = [
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

  // Check if user is a stakeholder (admin, builder, or supplier)
  const isStakeholder = ['admin', 'builder', 'supplier'].includes(userRole || '');
  
  if (!isStakeholder) {
    return (
      <div className="min-h-screen bg-gradient-construction">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h2>
              <p className="text-muted-foreground mb-6">
                The delivery dashboard is only accessible to registered stakeholders (Builders, Suppliers, and Administrators).
              </p>
              <div className="text-sm text-muted-foreground">
                Current role: <span className="font-medium capitalize">{userRole || 'Not assigned'}</span>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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