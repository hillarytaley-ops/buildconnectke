import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, Users, FileX, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  type: 'deliveries' | 'providers' | 'requests' | 'applications' | 'error';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const DeliveryEmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'deliveries':
        return <Package className="h-16 w-16 text-muted-foreground/50" />;
      case 'providers':
        return <Truck className="h-16 w-16 text-muted-foreground/50" />;
      case 'requests':
        return <FileX className="h-16 w-16 text-muted-foreground/50" />;
      case 'applications':
        return <Users className="h-16 w-16 text-muted-foreground/50" />;
      case 'error':
        return <AlertCircle className="h-16 w-16 text-destructive/50" />;
      default:
        return <Package className="h-16 w-16 text-muted-foreground/50" />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'deliveries':
        return {
          title: 'No Deliveries Found',
          description: 'No delivery records match your current criteria. Try adjusting your filters or create a new delivery request.',
          actionLabel: 'Create Delivery Request'
        };
      case 'providers':
        return {
          title: 'No Delivery Providers Available',
          description: 'No verified delivery providers are currently available in your area. Check back later or expand your search radius.',
          actionLabel: 'Refresh Providers'
        };
      case 'requests':
        return {
          title: 'No Delivery Requests',
          description: 'No pending delivery requests found. Create a new request to get started with material delivery.',
          actionLabel: 'Create Request'
        };
      case 'applications':
        return {
          title: 'No Applications Submitted',
          description: 'No delivery provider applications have been submitted yet. Start your application to join our network.',
          actionLabel: 'Apply Now'
        };
      case 'error':
        return {
          title: 'Something Went Wrong',
          description: 'We encountered an error loading the delivery information. Please try again or contact support if the problem persists.',
          actionLabel: 'Try Again'
        };
      default:
        return {
          title: 'No Data Available',
          description: 'No information is currently available.',
          actionLabel: 'Refresh'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;
  const finalActionLabel = actionLabel || defaultContent.actionLabel;

  return (
    <Card className={type === 'error' ? 'border-destructive/20 bg-destructive/5' : ''}>
      <CardContent className="pt-12 pb-12">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="flex justify-center">
            {getIcon()}
          </div>
          
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${type === 'error' ? 'text-destructive' : 'text-foreground'}`}>
              {finalTitle}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {finalDescription}
            </p>
          </div>
          
          {onAction && (
            <Button 
              onClick={onAction}
              variant={type === 'error' ? 'destructive' : 'default'}
              className="px-6"
            >
              {finalActionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryEmptyState;