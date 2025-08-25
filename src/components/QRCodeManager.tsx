import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Package, Truck, CheckCircle, Plus, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MaterialQRCode {
  id: string;
  qr_code: string;
  material_type: string;
  batch_number?: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'dispatched' | 'received' | 'verified';
  generated_at: string;
  dispatched_at?: string;
  received_at?: string;
  verified_at?: string;
}

const QRCodeManager: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<MaterialQRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [newQRCode, setNewQRCode] = useState({
    material_type: '',
    batch_number: '',
    quantity: 1,
    unit: 'pieces'
  });
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && userRole) {
      fetchQRCodes();
    }
  }, [user, userRole]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Get user role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching user role:', profileError);
        } else {
          setUserRole(profileData?.role);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQRCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('material_qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching QR codes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch QR codes",
          variant: "destructive",
        });
      } else {
        setQrCodes(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const generateQRCode = async () => {
    if (!user || !['admin', 'supplier'].includes(userRole || '')) {
      toast({
        title: "Access Denied",
        description: "Only suppliers and admins can generate QR codes",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('generate_material_qr_code', {
        _material_type: newQRCode.material_type,
        _batch_number: newQRCode.batch_number || null,
        _quantity: newQRCode.quantity,
        _unit: newQRCode.unit
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `QR Code generated: ${data}`,
      });

      setShowCreateDialog(false);
      setNewQRCode({
        material_type: '',
        batch_number: '',
        quantity: 1,
        unit: 'pieces'
      });
      fetchQRCodes();
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const updateQRStatus = async (qrCode: string, newStatus: string) => {
    try {
      const { data, error } = await supabase.rpc('update_qr_status', {
        _qr_code: qrCode,
        _new_status: newStatus
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `QR Code status updated to ${newStatus}`,
      });

      fetchQRCodes();
    } catch (error) {
      console.error('Error updating QR status:', error);
      toast({
        title: "Error",
        description: "Failed to update QR code status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-500';
      case 'dispatched':
        return 'bg-blue-500';
      case 'received':
        return 'bg-orange-500';
      case 'verified':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Package;
      case 'dispatched':
        return Truck;
      case 'received':
        return Package;
      case 'verified':
        return CheckCircle;
      default:
        return Package;
    }
  };

  if (loading) {
    return <div className="p-6">Loading QR codes...</div>;
  }

  if (!user || !['admin', 'supplier', 'builder'].includes(userRole || '')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR Code Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please log in with appropriate permissions to access QR code management.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-6 w-6" />
                Material QR Code Manager
              </CardTitle>
              <p className="text-muted-foreground">
                Generate and track QR codes for building materials dispatch and receipt
              </p>
            </div>
            {['admin', 'supplier'].includes(userRole || '') && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate New QR Code</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="material_type">Material Type</Label>
                      <Input
                        id="material_type"
                        value={newQRCode.material_type}
                        onChange={(e) => setNewQRCode({...newQRCode, material_type: e.target.value})}
                        placeholder="e.g., Cement, Steel, Bricks"
                      />
                    </div>
                    <div>
                      <Label htmlFor="batch_number">Batch Number (Optional)</Label>
                      <Input
                        id="batch_number"
                        value={newQRCode.batch_number}
                        onChange={(e) => setNewQRCode({...newQRCode, batch_number: e.target.value})}
                        placeholder="e.g., BATCH-2024-001"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={newQRCode.quantity}
                          onChange={(e) => setNewQRCode({...newQRCode, quantity: parseInt(e.target.value) || 1})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={newQRCode.unit} onValueChange={(value) => setNewQRCode({...newQRCode, unit: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pieces">Pieces</SelectItem>
                            <SelectItem value="bags">Bags</SelectItem>
                            <SelectItem value="tons">Tons</SelectItem>
                            <SelectItem value="kg">Kilograms</SelectItem>
                            <SelectItem value="m3">Cubic Meters</SelectItem>
                            <SelectItem value="m2">Square Meters</SelectItem>
                            <SelectItem value="liters">Liters</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={generateQRCode} className="w-full">
                      Generate QR Code
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {qrCodes.length === 0 ? (
            <div className="text-center py-8">
              <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No QR codes generated yet</p>
              <p className="text-sm text-muted-foreground">
                {['admin', 'supplier'].includes(userRole || '') 
                  ? 'Generate your first QR code to get started'
                  : 'QR codes will appear here when materials are processed'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Generated</TableHead>
                  {['admin', 'supplier'].includes(userRole || '') && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {qrCodes.map((qr) => {
                  const StatusIcon = getStatusIcon(qr.status);
                  return (
                    <TableRow key={qr.id}>
                      <TableCell className="font-mono text-sm">
                        {qr.qr_code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{qr.material_type}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {qr.batch_number || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {qr.quantity} {qr.unit}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(qr.status)} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {qr.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(qr.generated_at).toLocaleDateString()}
                      </TableCell>
                      {['admin', 'supplier'].includes(userRole || '') && (
                        <TableCell>
                          <div className="flex gap-2">
                            {qr.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQRStatus(qr.qr_code, 'dispatched')}
                              >
                                Mark Dispatched
                              </Button>
                            )}
                            {qr.status === 'received' && userRole === 'admin' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQRStatus(qr.qr_code, 'verified')}
                              >
                                Verify
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QR Code Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Package className="h-8 w-8 mx-auto mb-2 text-gray-500" />
              <h4 className="font-medium">1. Generate</h4>
              <p className="text-sm text-muted-foreground">
                Supplier generates QR codes for materials
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Truck className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-medium">2. Dispatch</h4>
              <p className="text-sm text-muted-foreground">
                Materials are scanned for dispatch
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Package className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h4 className="font-medium">3. Receive</h4>
              <p className="text-sm text-muted-foreground">
                UjenziPro staff scan upon receipt
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-medium">4. Verify</h4>
              <p className="text-sm text-muted-foreground">
                Final verification and quality check
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeManager;