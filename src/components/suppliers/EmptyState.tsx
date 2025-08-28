import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  selectedCategory: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, selectedCategory }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Suppliers Found</h3>
          <p className="mb-4">
            {searchTerm || selectedCategory !== 'All' 
              ? 'No suppliers match your current search criteria. Try adjusting your filters.' 
              : 'No suppliers are currently registered in the system.'}
          </p>
          {(!searchTerm && selectedCategory === 'All') && (
            <p className="text-sm">
              Be the first to register as a supplier and join our construction marketplace!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;