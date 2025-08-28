import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  Calendar, 
  MapPin, 
  Package, 
  Truck,
  DollarSign,
  X,
  Search
} from "lucide-react";
import { DeliveryStatus } from "./DeliveryStatusBadge";
import { DateRange } from "react-day-picker";

interface DeliveryFilters {
  status: DeliveryStatus | 'all';
  dateRange: DateRange | undefined;
  materialType: string;
  vehicleType: string;
  budgetRange: string;
  locationArea: string;
  driverName: string;
  weightRange: { min: number; max: number };
}

interface EnhancedDeliveryFiltersProps {
  filters: DeliveryFilters;
  onFiltersChange: (filters: DeliveryFilters) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const EnhancedDeliveryFilters: React.FC<EnhancedDeliveryFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions: Array<{ value: DeliveryStatus | 'all'; label: string; color: string }> = [
    { value: 'all', label: 'All Status', color: 'bg-muted' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'picked_up', label: 'Picked Up', color: 'bg-blue-500' },
    { value: 'in_transit', label: 'In Transit', color: 'bg-purple-500' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-orange-500' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500' }
  ];

  const materialTypes = [
    'All Materials', 'Cement', 'Steel Bars', 'Bricks', 'Sand', 'Gravel', 
    'Tiles', 'Timber', 'Paint', 'Hardware', 'Mixed Materials'
  ];

  const vehicleTypes = [
    'All Vehicles', 'Small Van', 'Large Van', 'Pickup Truck', 
    'Small Truck', 'Large Truck', 'Trailer'
  ];

  const budgetRanges = [
    'All Budgets', 'Under KSh 5,000', 'KSh 5,000 - 10,000', 
    'KSh 10,000 - 20,000', 'KSh 20,000 - 50,000', 'Over KSh 50,000'
  ];

  const locationAreas = [
    'All Areas', 'Nairobi CBD', 'Westlands', 'Karen', 'Kiambu', 
    'Thika', 'Machakos', 'Mombasa', 'Kisumu'
  ];

  const updateFilter = (key: keyof DeliveryFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="border-muted">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Delivery Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less Filters' : 'More Filters'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Status Filters */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <Badge
                key={status.value}
                variant={filters.status === status.value ? "default" : "secondary"}
                className="cursor-pointer px-3 py-1 transition-colors hover:bg-primary/80"
                onClick={() => updateFilter('status', status.value)}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${status.color}`} />
                {status.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        {isExpanded && (
          <>
            <Separator />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Date Range */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </Label>
                <DatePickerWithRange
                  date={filters.dateRange}
                  onDateChange={(range) => updateFilter('dateRange', range)}
                />
              </div>

              {/* Material Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Package className="h-4 w-4" />
                  Material Type
                </Label>
                <Select
                  value={filters.materialType}
                  onValueChange={(value) => updateFilter('materialType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Truck className="h-4 w-4" />
                  Vehicle Type
                </Label>
                <Select
                  value={filters.vehicleType}
                  onValueChange={(value) => updateFilter('vehicleType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Range */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4" />
                  Budget Range
                </Label>
                <Select
                  value={filters.budgetRange}
                  onValueChange={(value) => updateFilter('budgetRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Area */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Location Area
                </Label>
                <Select
                  value={filters.locationArea}
                  onValueChange={(value) => updateFilter('locationArea', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Driver Search */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Search className="h-4 w-4" />
                  Driver Name
                </Label>
                <Input
                  placeholder="Search by driver name"
                  value={filters.driverName}
                  onChange={(e) => updateFilter('driverName', e.target.value)}
                />
              </div>
            </div>

            {/* Weight Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Weight Range (kg)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.weightRange.min || ''}
                  onChange={(e) => updateFilter('weightRange', {
                    ...filters.weightRange,
                    min: parseInt(e.target.value) || 0
                  })}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.weightRange.max || ''}
                  onChange={(e) => updateFilter('weightRange', {
                    ...filters.weightRange,
                    max: parseInt(e.target.value) || 0
                  })}
                  className="flex-1"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDeliveryFilters;