import React from 'react';
import { Badge } from "@/components/ui/badge";
import { User, Shield } from "lucide-react";

interface DeliveryHeaderProps {
  userRole?: string | null;
}

const DeliveryHeader: React.FC<DeliveryHeaderProps> = ({ userRole }) => {
  return (
    <div className="mb-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-card/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Professional Delivery Management</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Construction Material
          <span className="text-primary block">Delivery Solutions</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Comprehensive delivery management system for construction materials with real-time tracking, 
          verified providers, and professional logistics coordination.
        </p>
        
        {userRole && (
          <div className="mt-4">
            <Badge variant="outline" className="capitalize bg-primary/10 text-primary border-primary/20">
              <User className="h-3 w-3 mr-1" />
              {userRole} Access
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHeader;