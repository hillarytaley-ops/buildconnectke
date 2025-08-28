import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Search, Package, MapPin, Clock } from "lucide-react";
import DeliveryCard from "./DeliveryCard";
import DeliveryEmptyState from "./DeliveryEmptyStates";
import { DeliveryGridSkeleton } from "./DeliveryLoadingStates";
import { DeliveryStatus } from "./DeliveryStatusBadge";

interface DeliveryData {
  id: string;
  tracking_number: string;
  material_type: string;
  quantity: number;
  weight_kg?: number;
  pickup_address: string;
  delivery_address: string;
  estimated_delivery: string;
  actual_delivery?: string;
  status: DeliveryStatus;
  driver_name?: string;
  driver_phone?: string;
  vehicle_number?: string;
  created_at: string;
}

interface DeliveryTrackingSectionProps {
  userRole?: string | null;
  canEdit?: boolean;
}

const DeliveryTrackingSection: React.FC<DeliveryTrackingSectionProps> = ({
  userRole,
  canEdit = false
}) => {
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | 'all'>('all');
  const { toast } = useToast();

  const statusFilters: Array<{ value: DeliveryStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Deliveries' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' }
  ];

  useEffect(() => {
    fetchDeliveries();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('deliveries-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deliveries'
        },
        (payload) => {
          console.log('Real-time delivery update:', payload);
          fetchDeliveries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedStatus]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('deliveries')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match interface
      const transformedDeliveries = (data || []).map(delivery => ({
        ...delivery,
        estimated_delivery: delivery.estimated_delivery_time || delivery.estimated_delivery_time,
        actual_delivery: delivery.actual_delivery_time
      })) as DeliveryData[];

      setDeliveries(transformedDeliveries);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: "Error",
        description: "Failed to load deliveries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchDelivery = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a tracking number to search.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSearchLoading(true);
      
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .eq('tracking_number', trackingNumber.trim())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const transformedDelivery = {
          ...data,
          estimated_delivery: data.estimated_delivery_time,
          actual_delivery: data.actual_delivery_time
        } as DeliveryData;

        setDeliveries([transformedDelivery]);
        setSelectedStatus('all');
        toast({
          title: "Delivery Found",
          description: `Found delivery: ${data.material_type}`,
        });
      } else {
        setDeliveries([]);
        toast({
          title: "Not Found",
          description: "No delivery found with that tracking number.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching delivery:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for delivery. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStatusChange = async (deliveryId: string, newStatus: DeliveryStatus) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'delivered') {
        updateData.actual_delivery_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('deliveries')
        .update(updateData)
        .eq('id', deliveryId);

      if (error) throw error;

      // Add tracking update
      await supabase
        .from('delivery_updates')
        .insert([{
          delivery_id: deliveryId,
          status: newStatus,
          notes: `Status updated to ${newStatus.replace('_', ' ')}`
        }]);

      toast({
        title: "Status Updated",
        description: `Delivery status updated to ${newStatus.replace('_', ' ')}`,
      });

      fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update delivery status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearSearch = () => {
    setTrackingNumber('');
    fetchDeliveries();
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Track Your Delivery
          </CardTitle>
          <CardDescription>
            Enter your tracking number to get real-time delivery updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter tracking number (e.g., JG12345678)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDelivery()}
                disabled={searchLoading}
              />
            </div>
            <Button 
              onClick={searchDelivery}
              disabled={searchLoading || !trackingNumber.trim()}
              className="px-6"
            >
              {searchLoading ? (
                <>
                  <Package className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </>
              )}
            </Button>
            {trackingNumber && (
              <Button variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {!trackingNumber && (
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Badge
              key={filter.value}
              variant={selectedStatus === filter.value ? "default" : "secondary"}
              className="cursor-pointer px-4 py-2 transition-colors hover:bg-primary/80"
              onClick={() => setSelectedStatus(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Deliveries List */}
      {loading ? (
        <DeliveryGridSkeleton />
      ) : deliveries.length === 0 ? (
        <DeliveryEmptyState
          type="deliveries"
          title={trackingNumber ? "Delivery Not Found" : "No Deliveries"}
          description={trackingNumber 
            ? "No delivery found with that tracking number. Please check and try again."
            : selectedStatus === 'all' 
              ? "No deliveries have been created yet." 
              : `No deliveries with status "${selectedStatus}" found.`
          }
          actionLabel={trackingNumber ? "Try Another Number" : "Create Delivery"}
          onAction={trackingNumber ? clearSearch : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              canEdit={canEdit}
              onStatusChange={canEdit ? handleStatusChange : undefined}
              onTrack={(trackingNum) => setTrackingNumber(trackingNum)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryTrackingSection;