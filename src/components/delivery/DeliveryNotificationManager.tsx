import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell, 
  BellOff, 
  Truck, 
  Package, 
  MessageSquare,
  Settings,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface NotificationSettings {
  browserNotifications: boolean;
  deliveryUpdates: boolean;
  providerMessages: boolean;
  statusChanges: boolean;
  pickupReminders: boolean;
  deliveryAlerts: boolean;
}

interface DeliveryNotificationManagerProps {
  userId?: string;
}

const DeliveryNotificationManager: React.FC<DeliveryNotificationManagerProps> = ({ userId }) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    browserNotifications: false,
    deliveryUpdates: true,
    providerMessages: true,
    statusChanges: true,
    pickupReminders: true,
    deliveryAlerts: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Load user notification settings
    loadNotificationSettings();

    // Set up real-time delivery updates
    if (userId) {
      const channel = supabase
        .channel('delivery-notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'deliveries',
            filter: `builder_id=eq.${userId}`
          },
          (payload) => {
            handleDeliveryUpdate(payload);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);

  const loadNotificationSettings = () => {
    if (!userId) return;

    try {
      const saved = localStorage.getItem(`notification_settings_${userId}`);
      if (saved) {
        const savedSettings = JSON.parse(saved);
        setSettings({
          browserNotifications: savedSettings.browserNotifications || false,
          deliveryUpdates: savedSettings.deliveryUpdates !== undefined ? savedSettings.deliveryUpdates : true,
          providerMessages: savedSettings.providerMessages !== undefined ? savedSettings.providerMessages : true,
          statusChanges: savedSettings.statusChanges !== undefined ? savedSettings.statusChanges : true,
          pickupReminders: savedSettings.pickupReminders !== undefined ? savedSettings.pickupReminders : true,
          deliveryAlerts: savedSettings.deliveryAlerts !== undefined ? savedSettings.deliveryAlerts : true
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not Supported",
        description: "Browser notifications are not supported in this browser.",
        variant: "destructive",
      });
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive browser notifications for delivery updates.",
      });
      return true;
    } else {
      toast({
        title: "Notifications Blocked",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      });
      return false;
    }
  };

  const showNotification = (title: string, options: NotificationOptions) => {
    if (Notification.permission === 'granted' && settings.browserNotifications) {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  };

  const handleDeliveryUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (!settings.statusChanges) return;

    switch (eventType) {
      case 'UPDATE':
        if (oldRecord?.status !== newRecord?.status) {
          const statusMessages = {
            picked_up: 'Your delivery has been picked up!',
            in_transit: 'Your delivery is now in transit.',
            out_for_delivery: 'Your delivery is out for delivery!',
            delivered: 'Your delivery has been completed!'
          };

          const message = statusMessages[newRecord.status as keyof typeof statusMessages];
          if (message) {
            showNotification('Delivery Update', {
              body: message,
              icon: '📦',
              tag: `delivery-${newRecord.id}`
            });

            toast({
              title: "Delivery Update",
              description: message,
            });
          }
        }
        break;

      case 'INSERT':
        if (settings.deliveryUpdates) {
          showNotification('New Delivery Created', {
            body: `Your delivery request for ${newRecord.material_type} has been created.`,
            icon: '🚚',
            tag: `new-delivery-${newRecord.id}`
          });
        }
        break;
    }
  };

  const updateNotificationSettings = async (key: keyof NotificationSettings, value: boolean) => {
    if (key === 'browserNotifications' && value) {
      const permitted = await requestNotificationPermission();
      if (!permitted) return;
    }

    setIsLoading(true);
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);

      // Save to localStorage
      if (userId) {
        localStorage.setItem(`notification_settings_${userId}`, JSON.stringify(newSettings));
      }

      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Update Failed",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      });
      // Revert the setting
      setSettings(prev => ({ ...prev, [key]: !value }));
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = () => {
    if (settings.browserNotifications) {
      showNotification('Test Notification', {
        body: 'This is a test notification from UjenziPro delivery system.',
        icon: '🔔'
      });
    } else {
      toast({
        title: "Test Notification",
        description: "Enable browser notifications to see push notifications.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Manage how you receive updates about your deliveries
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Browser Notification Permission */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {notificationPermission === 'granted' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
            <div>
              <div className="font-medium">Browser Notifications</div>
              <div className="text-sm text-muted-foreground">
                {notificationPermission === 'granted' 
                  ? 'Notifications are enabled' 
                  : 'Enable push notifications for real-time updates'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notificationPermission === 'granted' && (
              <Button variant="outline" size="sm" onClick={testNotification}>
                Test
              </Button>
            )}
            <Switch
              checked={settings.browserNotifications}
              onCheckedChange={(checked) => updateNotificationSettings('browserNotifications', checked)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Notification Categories */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="font-medium">Notification Types</span>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'statusChanges' as const,
                icon: <Package className="h-4 w-4" />,
                title: 'Status Changes',
                description: 'Get notified when delivery status updates'
              },
              {
                key: 'deliveryUpdates' as const,
                icon: <Truck className="h-4 w-4" />,
                title: 'Delivery Updates',
                description: 'Receive updates about pickup and delivery times'
              },
              {
                key: 'providerMessages' as const,
                icon: <MessageSquare className="h-4 w-4" />,
                title: 'Provider Messages',
                description: 'Get messages from delivery providers'
              },
              {
                key: 'pickupReminders' as const,
                icon: <Bell className="h-4 w-4" />,
                title: 'Pickup Reminders',
                description: 'Reminders before scheduled pickup times'
              },
              {
                key: 'deliveryAlerts' as const,
                icon: <BellOff className="h-4 w-4" />,
                title: 'Delivery Alerts',
                description: 'Alerts when deliveries are completed'
              }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <Switch
                  checked={settings[item.key]}
                  onCheckedChange={(checked) => updateNotificationSettings(item.key, checked)}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notification Status */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Notification System Active</span>
          </div>
          <Badge variant="secondary">Real-time</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryNotificationManager;