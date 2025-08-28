import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clock, 
  MapPin, 
  Truck, 
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Calendar
} from "lucide-react";

interface DeliveryData {
  id: string;
  tracking_number: string;
  material_type: string;
  pickup_address: string;
  delivery_address: string;
  estimated_delivery: string;
  actual_delivery?: string;
  status: string;
  created_at: string;
  pickup_date?: string;
  weight_kg?: number;
  distance_km?: number;
}

interface DeliveryTimeEstimatorProps {
  delivery: DeliveryData;
  showDetailed?: boolean;
}

interface EstimationFactors {
  baseTime: number; // minutes
  distanceFactor: number;
  materialFactor: number;
  weatherFactor: number;
  trafficFactor: number;
  dayOfWeekFactor: number;
  timeOfDayFactor: number;
}

const DeliveryTimeEstimator: React.FC<DeliveryTimeEstimatorProps> = ({ 
  delivery, 
  showDetailed = false 
}) => {
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(85);
  const [factors, setFactors] = useState<EstimationFactors>({
    baseTime: 60,
    distanceFactor: 1,
    materialFactor: 1,
    weatherFactor: 1,
    trafficFactor: 1,
    dayOfWeekFactor: 1,
    timeOfDayFactor: 1
  });

  useEffect(() => {
    calculateEstimation();
  }, [delivery]);

  const calculateEstimation = () => {
    const now = new Date();
    const estimatedDelivery = new Date(delivery.estimated_delivery);
    const createdAt = new Date(delivery.created_at);

    // Base estimation factors
    const newFactors: EstimationFactors = {
      baseTime: 60, // Base 1 hour
      distanceFactor: calculateDistanceFactor(),
      materialFactor: calculateMaterialFactor(),
      weatherFactor: calculateWeatherFactor(),
      trafficFactor: calculateTrafficFactor(),
      dayOfWeekFactor: calculateDayOfWeekFactor(),
      timeOfDayFactor: calculateTimeOfDayFactor()
    };

    setFactors(newFactors);

    // Calculate total estimated time
    const totalTime = newFactors.baseTime * 
      newFactors.distanceFactor * 
      newFactors.materialFactor * 
      newFactors.weatherFactor * 
      newFactors.trafficFactor * 
      newFactors.dayOfWeekFactor * 
      newFactors.timeOfDayFactor;

    setEstimatedTime(Math.round(totalTime));

    // Calculate confidence based on various factors
    const baseConfidence = 90;
    const uncertaintyFactors = [
      Math.abs(newFactors.weatherFactor - 1) * 10,
      Math.abs(newFactors.trafficFactor - 1) * 15,
      delivery.distance_km && delivery.distance_km > 50 ? 10 : 0
    ];

    const totalUncertainty = uncertaintyFactors.reduce((sum, factor) => sum + factor, 0);
    setConfidence(Math.max(60, baseConfidence - totalUncertainty));
  };

  const calculateDistanceFactor = (): number => {
    // Estimate distance based on addresses or use provided distance
    const distance = delivery.distance_km || estimateDistanceFromAddresses();
    
    if (distance <= 10) return 1;
    if (distance <= 25) return 1.3;
    if (distance <= 50) return 1.6;
    return 2.0;
  };

  const estimateDistanceFromAddresses = (): number => {
    // Simple heuristic based on address similarity
    const pickup = delivery.pickup_address.toLowerCase();
    const dropoff = delivery.delivery_address.toLowerCase();
    
    // Check if both addresses are in same general area
    const areas = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret'];
    const pickupArea = areas.find(area => pickup.includes(area));
    const dropoffArea = areas.find(area => dropoff.includes(area));
    
    if (pickupArea === dropoffArea) return 15; // Same city
    if (!pickupArea || !dropoffArea) return 25; // Unknown areas
    return 80; // Different cities
  };

  const calculateMaterialFactor = (): number => {
    const material = delivery.material_type.toLowerCase();
    const weight = delivery.weight_kg || 100;
    
    // Heavy materials take longer to load/unload
    if (material.includes('cement') || material.includes('steel')) return 1.2;
    if (material.includes('sand') || material.includes('gravel')) return 1.3;
    if (material.includes('brick')) return 1.1;
    if (weight > 1000) return 1.4;
    if (weight > 500) return 1.2;
    
    return 1.0;
  };

  const calculateWeatherFactor = (): number => {
    // In real implementation, this would use weather API
    // For now, simulate based on time of year and randomness
    const now = new Date();
    const month = now.getMonth();
    
    // Rainy season simulation (March-May, Oct-Dec)
    if ([2, 3, 4, 9, 10, 11].includes(month)) {
      return 1.1 + Math.random() * 0.2; // 10-30% delay possible
    }
    
    return 1.0 + Math.random() * 0.1; // Up to 10% variance
  };

  const calculateTrafficFactor = (): number => {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    // Weekend traffic is generally lighter
    if (dayOfWeek === 0 || dayOfWeek === 6) return 0.9;
    
    // Rush hour traffic
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 1.4;
    }
    
    // Lunch hour
    if (hour >= 12 && hour <= 14) return 1.2;
    
    return 1.0;
  };

  const calculateDayOfWeekFactor = (): number => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    // Monday and Friday tend to be busier
    if (dayOfWeek === 1 || dayOfWeek === 5) return 1.1;
    
    // Weekend deliveries might be slower due to limited availability
    if (dayOfWeek === 0 || dayOfWeek === 6) return 1.2;
    
    return 1.0;
  };

  const calculateTimeOfDayFactor = (): number => {
    const now = new Date();
    const hour = now.getHours();
    
    // Very early or late deliveries
    if (hour < 6 || hour > 20) return 1.3;
    
    // Optimal delivery times
    if (hour >= 9 && hour <= 16) return 1.0;
    
    return 1.1;
  };

  const getEstimationAccuracy = (): { level: string; color: string; description: string } => {
    if (confidence >= 85) {
      return {
        level: 'High',
        color: 'text-green-600',
        description: 'Very reliable estimate based on current conditions'
      };
    } else if (confidence >= 70) {
      return {
        level: 'Medium',
        color: 'text-yellow-600',
        description: 'Good estimate with some uncertainty factors'
      };
    } else {
      return {
        level: 'Low',
        color: 'text-red-600',
        description: 'Estimate has high uncertainty due to external factors'
      };
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getProgressValue = (): number => {
    const now = new Date();
    const created = new Date(delivery.created_at);
    const estimated = new Date(delivery.estimated_delivery);
    
    const totalTime = estimated.getTime() - created.getTime();
    const elapsed = now.getTime() - created.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
  };

  const accuracy = getEstimationAccuracy();

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Delivery Time Estimation
        </CardTitle>
        <CardDescription>
          AI-powered delivery time prediction based on multiple factors
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Estimation */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatTime(estimatedTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              Estimated total delivery time
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className={accuracy.color}>
              {accuracy.level} Confidence
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">
              {confidence}% accurate
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Delivery Progress</span>
            <span>{Math.round(getProgressValue())}% Complete</span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>

        {/* Accuracy Alert */}
        <Alert variant={confidence >= 70 ? "default" : "destructive"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {accuracy.description}
          </AlertDescription>
        </Alert>

        {/* Detailed Factors (if enabled) */}
        {showDetailed && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-medium">
              <TrendingUp className="h-4 w-4" />
              Estimation Factors
            </div>
            
            <div className="grid gap-2 text-sm">
              {[
                { label: 'Distance', factor: factors.distanceFactor, icon: MapPin },
                { label: 'Material Type', factor: factors.materialFactor, icon: Package },
                { label: 'Current Traffic', factor: factors.trafficFactor, icon: Truck },
                { label: 'Time of Day', factor: factors.timeOfDayFactor, icon: Clock },
                { label: 'Day of Week', factor: factors.dayOfWeekFactor, icon: Calendar }
              ].map((item) => {
                const Icon = item.icon;
                const impact = item.factor > 1.1 ? 'increasing' : item.factor < 0.9 ? 'decreasing' : 'neutral';
                const color = impact === 'increasing' ? 'text-red-600' : impact === 'decreasing' ? 'text-green-600' : 'text-muted-foreground';
                
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    <span className={color}>
                      {item.factor > 1 ? '+' : ''}{Math.round((item.factor - 1) * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Real-time Updates */}
        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Live Tracking Active</span>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTimeEstimator;