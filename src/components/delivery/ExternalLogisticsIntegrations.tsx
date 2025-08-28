import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Plug2, 
  Truck, 
  MapPin, 
  Package, 
  Globe,
  CheckCircle2,
  AlertTriangle,
  Settings,
  ExternalLink,
  RefreshCw,
  Link
} from "lucide-react";

interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  settings: Record<string, any>;
  lastSync?: Date;
  features: string[];
}

interface ExternalLogisticsIntegrationsProps {
  userId?: string;
  userRole?: string;
}

const ExternalLogisticsIntegrations: React.FC<ExternalLogisticsIntegrationsProps> = ({
  userId,
  userRole
}) => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = () => {
    // Load saved integrations and initialize with common logistics providers
    const savedIntegrations = localStorage.getItem(`logistics_integrations_${userId}`);
    
    const defaultIntegrations: IntegrationConfig[] = [
      {
        id: 'dhl',
        name: 'DHL Express',
        description: 'Global express delivery and logistics services',
        status: 'disconnected',
        settings: { trackingEnabled: true, autoQuotes: false },
        features: ['Real-time tracking', 'Rate quotes', 'Pickup scheduling', 'Proof of delivery']
      },
      {
        id: 'fedex',
        name: 'FedEx',
        description: 'International shipping and logistics solutions',
        status: 'disconnected',
        settings: { trackingEnabled: true, autoQuotes: true },
        features: ['Express shipping', 'Ground services', 'Freight solutions', 'Return management']
      },
      {
        id: 'ups',
        name: 'UPS',
        description: 'United Parcel Service logistics and shipping',
        status: 'connected',
        apiKey: 'ups_demo_key_123456',
        lastSync: new Date(Date.now() - 3600000), // 1 hour ago
        settings: { trackingEnabled: true, autoQuotes: true, smartRouting: true },
        features: ['Package tracking', 'Rate shopping', 'Address validation', 'Delivery notifications']
      },
      {
        id: 'sendy',
        name: 'Sendy Kenya',
        description: 'Local Kenyan delivery and logistics platform',
        status: 'connected',
        apiKey: 'sendy_demo_key_789012',
        lastSync: new Date(Date.now() - 1800000), // 30 minutes ago
        settings: { trackingEnabled: true, autoQuotes: true, instantDelivery: true },
        features: ['Same-day delivery', 'Local tracking', 'Kenyan coverage', 'Cost optimization']
      },
      {
        id: 'glovo',
        name: 'Glovo Business',
        description: 'On-demand delivery for business needs',
        status: 'disconnected',
        settings: { trackingEnabled: false, autoQuotes: false },
        features: ['Instant delivery', 'Business accounts', 'Bulk orders', 'API integration']
      },
      {
        id: 'aramex',
        name: 'Aramex',
        description: 'Regional logistics and courier services',
        status: 'error',
        apiKey: 'aramex_key_invalid',
        settings: { trackingEnabled: true, autoQuotes: false },
        features: ['Middle East & Africa coverage', 'E-commerce solutions', 'Cash on delivery', 'Warehousing']
      }
    ];

    if (savedIntegrations) {
      const saved = JSON.parse(savedIntegrations);
      setIntegrations(saved);
    } else {
      setIntegrations(defaultIntegrations);
    }
    
    setLoading(false);
  };

  const saveIntegrations = (updatedIntegrations: IntegrationConfig[]) => {
    setIntegrations(updatedIntegrations);
    if (userId) {
      localStorage.setItem(`logistics_integrations_${userId}`, JSON.stringify(updatedIntegrations));
    }
  };

  const testConnection = async (integrationId: string) => {
    setTestingConnection(integrationId);
    
    try {
      // Simulate API connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updated = integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'connected' as const, lastSync: new Date() }
          : integration
      );
      
      saveIntegrations(updated);
      
      toast({
        title: "Connection Successful",
        description: "Integration is working correctly and syncing data.",
      });
    } catch (error) {
      const updated = integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'error' as const }
          : integration
      );
      
      saveIntegrations(updated);
      
      toast({
        title: "Connection Failed",
        description: "Please check your API credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setTestingConnection(null);
    }
  };

  const updateApiKey = (integrationId: string, apiKey: string) => {
    const updated = integrations.map(integration => 
      integration.id === integrationId 
        ? { ...integration, apiKey, status: apiKey ? 'disconnected' as const : 'disconnected' as const }
        : integration
    );
    saveIntegrations(updated);
  };

  const updateSetting = (integrationId: string, settingKey: string, value: any) => {
    const updated = integrations.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            settings: { ...integration.settings, [settingKey]: value }
          }
        : integration
    );
    saveIntegrations(updated);
  };

  const syncIntegration = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration || integration.status !== 'connected') return;

    toast({
      title: "Syncing Data",
      description: `Syncing with ${integration.name}...`,
    });

    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updated = integrations.map(i => 
      i.id === integrationId 
        ? { ...i, lastSync: new Date() }
        : i
    );
    
    saveIntegrations(updated);

    toast({
      title: "Sync Complete",
      description: `Successfully synced with ${integration.name}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Plug2 className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading integrations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            Logistics Integrations
          </h2>
          <p className="text-muted-foreground">Connect with external logistics providers for enhanced delivery options</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            {connectedCount} Connected
          </Badge>
          {errorCount > 0 && (
            <Badge variant="outline" className="text-red-600">
              {errorCount} Error{errorCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{connectedCount}</p>
                <p className="text-sm text-muted-foreground">Active Integrations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">247</p>
                <p className="text-sm text-muted-foreground">Deliveries This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-muted-foreground">Provider Options</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations">Available Integrations</TabsTrigger>
          <TabsTrigger value="settings">Integration Settings</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        {integration.name}
                      </CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <Label className="text-sm font-medium">Features</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {integration.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* API Key Configuration */}
                  <div className="space-y-2">
                    <Label htmlFor={`${integration.id}-key`}>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`${integration.id}-key`}
                        type="password"
                        placeholder="Enter API key"
                        value={integration.apiKey || ''}
                        onChange={(e) => updateApiKey(integration.id, e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection(integration.id)}
                        disabled={!integration.apiKey || testingConnection === integration.id}
                      >
                        {testingConnection === integration.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plug2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Last Sync Info */}
                  {integration.status === 'connected' && integration.lastSync && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Last synced: {integration.lastSync.toLocaleTimeString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => syncIntegration(integration.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                    </div>
                  )}

                  {/* Error Alert */}
                  {integration.status === 'error' && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Connection failed. Please check your API credentials and try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* External Link */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(`https://${integration.id}.com/developer`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Developer Documentation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations
              .filter(i => i.status === 'connected')
              .map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {integration.name} Settings
                  </CardTitle>
                  <CardDescription>Configure integration-specific options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(integration.settings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                      <Switch
                        checked={Boolean(value)}
                        onCheckedChange={(checked) => updateSetting(integration.id, key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {integrations.filter(i => i.status === 'connected').length === 0 && (
            <Alert>
              <Link className="h-4 w-4" />
              <AlertDescription>
                No connected integrations found. Connect to external logistics providers to access settings.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">94.5%</div>
                  <div className="text-sm text-muted-foreground">Integration Uptime</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2.4s</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">15,234</div>
                  <div className="text-sm text-muted-foreground">API Calls This Month</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Performance</CardTitle>
              <CardDescription>Provider comparison and reliability metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations
                  .filter(i => i.status === 'connected')
                  .map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last sync: {integration.lastSync?.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">99.2% Uptime</div>
                      <div className="text-xs text-muted-foreground">847 deliveries</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExternalLogisticsIntegrations;