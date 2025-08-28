import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Package, Star, MapPin } from "lucide-react";

interface SupplierRegistrationCTAProps {
  onRegisterClick: () => void;
}

const SupplierRegistrationCTA: React.FC<SupplierRegistrationCTAProps> = ({ onRegisterClick }) => {
  return (
    <Card className="bg-gradient-primary border-none shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-construction-orange/90"></div>
      <CardContent className="pt-12 pb-12 relative z-10">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <Store className="h-4 w-4 text-text-on-dark" />
              <span className="text-sm font-medium text-text-on-dark">Supplier Network</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-text-on-dark">
              Join Kenya's Leading Construction Marketplace
            </h3>
            <p className="text-lg text-text-primary-light max-w-2xl mx-auto leading-relaxed">
              Connect with thousands of builders, contractors, and developers. Grow your business with our verified supplier network and professional tools.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onRegisterClick}
              size="lg"
              className="bg-card text-primary hover:bg-card/90 font-semibold px-8 py-4"
            >
              <Store className="h-5 w-5 mr-2" />
              Register as Supplier
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-text-on-dark hover:bg-card/10 backdrop-blur-sm px-8 py-4"
            >
              Learn More
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/20">
            <div className="flex flex-col items-center gap-3 text-text-on-dark">
              <div className="p-3 bg-card/20 rounded-full">
                <Package className="h-6 w-6" />
              </div>
              <div className="text-center">
                <h4 className="font-semibold">Free Registration</h4>
                <p className="text-sm text-text-secondary-light">No setup fees or hidden costs</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 text-text-on-dark">
              <div className="p-3 bg-card/20 rounded-full">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-center">
                <h4 className="font-semibold">Verified Badge</h4>
                <p className="text-sm text-text-secondary-light">Build trust with verified status</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 text-text-on-dark">
              <div className="p-3 bg-card/20 rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-center">
                <h4 className="font-semibold">Nationwide Reach</h4>
                <p className="text-sm text-text-secondary-light">Access markets across Kenya</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierRegistrationCTA;