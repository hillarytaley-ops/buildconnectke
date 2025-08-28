import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  MapPin, 
  Clock, 
  Phone, 
  Truck,
  Eye,
  MoreHorizontal 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import DeliveryStatusBadge, { DeliveryStatus } from "./DeliveryStatusBadge";

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

interface DeliveryCardProps {
  delivery: DeliveryData;
  canEdit?: boolean;
  canViewDetails?: boolean;
  onStatusChange?: (deliveryId: string, newStatus: DeliveryStatus) => void;
  onViewDetails?: (delivery: DeliveryData) => void;
  onTrack?: (trackingNumber: string) => void;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  canEdit = false,
  canViewDetails = true,
  onStatusChange,
  onViewDetails,
  onTrack
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateAddress = (address: string, maxLength: number = 30) => {
    return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address;
  };

  const statusOptions: DeliveryStatus[] = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="truncate">{delivery.material_type}</span>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{delivery.tracking_number}</span>
              <Badge variant="outline" className="text-xs">
                {delivery.quantity} {delivery.quantity === 1 ? 'unit' : 'units'}
              </Badge>
              {delivery.weight_kg && (
                <Badge variant="outline" className="text-xs">
                  {delivery.weight_kg}kg
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-2">
            <DeliveryStatusBadge status={delivery.status} size="sm" />
            
            {(canEdit || canViewDetails) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {canViewDetails && (
                    <DropdownMenuItem onClick={() => onViewDetails?.(delivery)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  )}
                  {canEdit && onStatusChange && (
                    <>
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        Update Status
                      </div>
                      {statusOptions.map((status) => (
                        <DropdownMenuItem 
                          key={status}
                          onClick={() => onStatusChange(delivery.id, status)}
                          disabled={delivery.status === status}
                        >
                          <DeliveryStatusBadge 
                            status={status} 
                            size="sm" 
                            className="mr-2" 
                          />
                          {status === delivery.status ? '(Current)' : ''}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Addresses */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground">From: </span>
              <span className="font-medium" title={delivery.pickup_address}>
                {truncateAddress(delivery.pickup_address)}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground">To: </span>
              <span className="font-medium" title={delivery.delivery_address}>
                {truncateAddress(delivery.delivery_address)}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Time */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {delivery.status === 'delivered' && delivery.actual_delivery
              ? `Delivered: ${formatDate(delivery.actual_delivery)}`
              : `Expected: ${formatDate(delivery.estimated_delivery)}`
            }
          </span>
        </div>

        {/* Driver Info (if available) */}
        {delivery.driver_name && (
          <div className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-lg">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Driver: </span>
            <span className="font-medium">{delivery.driver_name}</span>
            {delivery.driver_phone && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 ml-auto"
                onClick={() => window.open(`tel:${delivery.driver_phone}`)}
              >
                <Phone className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onTrack && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTrack(delivery.tracking_number)}
              className="flex-1"
            >
              <Package className="h-4 w-4 mr-2" />
              Track Package
            </Button>
          )}
          {canViewDetails && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onViewDetails?.(delivery)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryCard;