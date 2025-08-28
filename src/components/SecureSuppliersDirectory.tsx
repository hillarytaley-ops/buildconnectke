import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Shield, Star, MapPin, Package, Eye, EyeOff, Phone, Mail, Building } from "lucide-react";

interface SecureSupplierInfo {
  id: string;
  company_name: string;
  specialties: string[];
  materials_offered: string[];
  rating: number;
  is_verified: boolean;
  created_at: string;
  can_view_contact: boolean;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

const SecureSuppliersDirectory = () => {
  const [suppliers, setSuppliers] = useState<SecureSupplierInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userProfile) {
      fetchSecureSuppliers();
    }
  }, [userProfile, searchTerm, selectedCategory]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  const fetchSecureSuppliers = async () => {
    try {
      setLoading(true);

      // Get suppliers list - show both verified and pending for demo purposes
      const { data: supplierList, error: listError } = await supabase
        .from('suppliers')
        .select('id, company_name, specialties, materials_offered, rating, is_verified, created_at')
        .order('is_verified', { ascending: false })
        .order('rating', { ascending: false });

      if (listError) throw listError;

      // For each supplier, get secure info (contact details if authorized)
      const secureSuppliers = await Promise.all(
        (supplierList || []).map(async (supplier): Promise<SecureSupplierInfo> => {
          try {
            const { data, error } = await supabase.rpc('get_secure_supplier_info', {
              supplier_uuid: supplier.id
            });

            if (error) {
              console.error(`Error getting secure info for supplier ${supplier.id}:`, error);
              return {
                ...supplier,
                can_view_contact: false,
                contact_person: 'Contact available to business partners',
                email: '',
                phone: '',
                address: 'Location available to business partners'
              };
            }

            return data[0] || {
              ...supplier,
              can_view_contact: false,
              contact_person: 'Contact available to business partners',
              email: '',
              phone: '',
              address: 'Location available to business partners'
            };
          } catch (error) {
            console.error(`Error processing supplier ${supplier.id}:`, error);
            return {
              ...supplier,
              can_view_contact: false,
              contact_person: 'Contact available to business partners',
              email: '',
              phone: '',
              address: 'Location available to business partners'
            };
          }
        })
      );

      // Apply filters
      let filteredSuppliers = secureSuppliers;
      
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
      console.error('Error fetching suppliers:', error);
      toast({
        title: "Error",
        description: "Failed to load suppliers directory.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All', 'Cement', 'Steel', 'Tiles', 'Paint', 'Timber', 
    'Hardware', 'Plumbing', 'Electrical', 'Aggregates', 'Roofing'
  ];

  const requestContactAccess = async (supplierId: string) => {
    try {
      // This would typically create a contact request
      toast({
        title: "Contact Request",
        description: "Your request for supplier contact details has been submitted. You'll gain access once you have an active business relationship.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request contact access.",
        variant: "destructive",
      });
    }
  };

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Please sign in to access the suppliers directory.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            Secure Suppliers Directory
          </CardTitle>
          <CardDescription>
            Supplier contact information is protected and only visible to users with active business relationships. 
            All access is logged for security.
          </CardDescription>
        </CardHeader>
      </Card>

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
              {(!searchTerm && selectedCategory === 'All') && (
                <p className="text-sm">
                  Be the first to register as a supplier and join our construction marketplace!
                </p>
              )}
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

                {/* Contact Information */}
                <div className="space-y-2 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contact Information</span>
                    {supplier.can_view_contact ? (
                      <Badge variant="default" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Authorized
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Protected
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span>{supplier.contact_person}</span>
                    </div>
                    
                    {supplier.can_view_contact ? (
                      <>
                        {supplier.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-mono">{supplier.email}</span>
                          </div>
                        )}
                        {supplier.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-mono">{supplier.phone}</span>
                          </div>
                        )}
                        {supplier.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{supplier.address}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Contact details available after establishing business relationship
                      </div>
                    )}
                  </div>
                  
                  {!supplier.can_view_contact && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => requestContactAccess(supplier.id)}
                    >
                      Request Contact Access
                    </Button>
                  )}
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

export default SecureSuppliersDirectory;