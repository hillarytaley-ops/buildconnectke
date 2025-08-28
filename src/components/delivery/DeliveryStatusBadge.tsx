import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MapPin 
} from "lucide-react";

export type DeliveryStatus = 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus;
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  pending: { 
    label: 'Pending', 
    variant: 'secondary' as const,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
    description: 'Awaiting pickup'
  },
  picked_up: { 
    label: 'Picked Up', 
    variant: 'default' as const,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Package,
    description: 'Package collected'
  },
  in_transit: { 
    label: 'In Transit', 
    variant: 'default' as const,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Truck,
    description: 'En route to destination'
  },
  out_for_delivery: { 
    label: 'Out for Delivery', 
    variant: 'default' as const,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: MapPin,
    description: 'Final delivery in progress'
  },
  delivered: { 
    label: 'Delivered', 
    variant: 'default' as const,
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    description: 'Successfully delivered'
  },
  cancelled: { 
    label: 'Cancelled', 
    variant: 'destructive' as const,
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    description: 'Delivery cancelled'
  }
};

const DeliveryStatusBadge: React.FC<DeliveryStatusBadgeProps> = ({
  status,
  size = 'default',
  showIcon = true,
  className = ''
}) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      variant={config.variant}
      className={`
        ${config.color} 
        ${sizeClasses[size]} 
        ${className}
        inline-flex items-center gap-1.5 font-medium transition-colors
      `}
      title={config.description}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  );
};

export default DeliveryStatusBadge;