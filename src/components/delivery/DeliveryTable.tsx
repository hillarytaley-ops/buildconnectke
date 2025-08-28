import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, MapPin, Phone } from "lucide-react";

type DeliveryStatus = 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface Delivery {
  id: string;
  tracking_number: string;
  material_type: string;
  quantity: number;
  weight_kg: number;
  pickup_address: string;
  delivery_address: string;
  estimated_delivery_time: string;
  actual_delivery_time?: string;
  status: DeliveryStatus;
  driver_name?: string;
  driver_phone?: string;
  vehicle_details?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  builder_id?: string;
}

interface DeliveryTableProps {
  deliveries: Delivery[];
  userRole: string | null;
  onStatusUpdate: (deliveryId: string, newStatus: DeliveryStatus) => void;
  onViewDetails: (delivery: Delivery) => void;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-gray-500' },
  picked_up: { label: 'Picked Up', color: 'bg-blue-500' },
  in_transit: { label: 'In Transit', color: 'bg-yellow-500' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-500' },
  delivered: { label: 'Delivered', color: 'bg-green-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' }
};

const DeliveryTable = ({ deliveries, userRole, onStatusUpdate, onViewDetails }: DeliveryTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateAddress = (address: string, maxLength = 30) => {
    return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tracking #</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pickup</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell className="font-mono text-sm">
                {delivery.tracking_number}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{delivery.material_type}</div>
                  <div className="text-sm text-muted-foreground">
                    {delivery.quantity} items • {delivery.weight_kg}kg
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Badge variant="outline" className={statusConfig[delivery.status].color + " text-white"}>
                    {statusConfig[delivery.status].label}
                  </Badge>
                  {userRole === 'supplier' && (
                    <Select
                      value={delivery.status}
                      onValueChange={(value) => onStatusUpdate(delivery.id, value as DeliveryStatus)}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="picked_up">Picked Up</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  {truncateAddress(delivery.pickup_address)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  {truncateAddress(delivery.delivery_address)}
                </div>
              </TableCell>
              <TableCell>
                {delivery.driver_name ? (
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{delivery.driver_name}</div>
                    {delivery.driver_phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {delivery.driver_phone}
                      </div>
                    )}
                    {delivery.vehicle_details && (
                      <div className="text-xs text-muted-foreground">
                        {delivery.vehicle_details}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Not assigned</span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {formatDate(delivery.created_at)}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(delivery)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {deliveries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No deliveries found
        </div>
      )}
    </div>
  );
};

export default DeliveryTable;