import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, Package, Building } from "lucide-react";

interface PublicSupplier {
  id: string;
  company_name: string;
  specialties: string[];
  materials_offered: string[];
  rating: number;
  is_verified: boolean;
  created_at: string;
}

const PublicSuppliersView = () => {
  const [suppliers, setSuppliers] = useState<PublicSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchPublicSuppliers();
  }, [searchTerm, selectedCategory]);

  const fetchPublicSuppliers = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('suppliers')
        .select('id, company_name, specialties, materials_offered, rating, is_verified, created_at')
        .order('is_verified', { ascending: false })
        .order('rating', { ascending: false });

      const { data: supplierList, error } = await query;

      if (error) throw error;

      // Apply local filters
      let filteredSuppliers = supplierList || [];
      
      if (searchTerm) {
        filteredSuppliers = filteredSuppliers.filter(supplier =>
          supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.specialties?.some(spec => 
            spec.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          supplier.materials_offered?.some(material => 
            material.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      if (selectedCategory !== 'All') {
        filteredSuppliers = filteredSuppliers.filter(supplier =>
          supplier.specialties?.includes(selectedCategory) ||
          supplier.materials_offered?.includes(selectedCategory)
        );
      }

      setSuppliers(filteredSuppliers);
    } catch (error) {
      console.error('Error fetching public suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All', 'Cement', 'Steel', 'Tiles', 'Paint', 'Timber', 
    'Hardware', 'Plumbing', 'Electrical', 'Aggregates', 'Roofing'
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search suppliers by name, specialties, or materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Suppliers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : suppliers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Suppliers Found</h3>
              <p className="mb-4">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'No suppliers match your current search criteria.' 
                  : 'No suppliers are currently registered in the system.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {supplier.company_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{supplier.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      {supplier.is_verified ? (
                        <Badge variant="default" className="text-xs">
                          ✓ Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          ⏳ Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Specialties */}
                {supplier.specialties && supplier.specialties.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.specialties.slice(0, 3).map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {supplier.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{supplier.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Public Contact Information */}
                <div className="space-y-2 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contact Information</span>
                    <Badge variant="secondary" className="text-xs">
                      Sign in for details
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3" />
                      <span>Contact available to registered users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>Location available to business partners</span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => window.location.href = '/auth'}
                  >
                    Sign In to View Contact Details
                  </Button>
                </div>

                {/* Member Since */}
                <div className="text-xs text-muted-foreground">
                  Member since {new Date(supplier.created_at).getFullYear()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicSuppliersView;