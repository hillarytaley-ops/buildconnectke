import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Search, Filter, Download, Eye, Calendar, MapPin } from "lucide-react";

interface MaterialEntry {
  id: string;
  material_type: string;
  quantity: number;
  unit: string;
  supplier_name: string;
  delivery_date: string;
  status: string;
  location: string;
  batch_number?: string;
  expiry_date?: string;
  condition: string;
  received_by: string;
  notes?: string;
}

const SiteMaterialRegister = () => {
  const [materials, setMaterials] = useState<MaterialEntry[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [materialTypeFilter, setMaterialTypeFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchTerm, statusFilter, materialTypeFilter]);

  const fetchMaterials = async () => {
    try {
      // For now, we'll use mock data since the actual table structure might need to be created
      // This would be replaced with actual Supabase queries once the database structure is established
      const mockMaterials: MaterialEntry[] = [
        {
          id: "1",
          material_type: "Cement",
          quantity: 50,
          unit: "bags",
          supplier_name: "BuildMax Supplies",
          delivery_date: "2024-01-15",
          status: "received",
          location: "Warehouse A - Bay 1",
          batch_number: "CM2024001",
          condition: "good",
          received_by: "John Smith",
          notes: "Good quality cement, stored properly"
        },
        {
          id: "2",
          material_type: "Steel Bars",
          quantity: 100,
          unit: "pieces",
          supplier_name: "Steel Works Ltd",
          delivery_date: "2024-01-14",
          status: "in_use",
          location: "Site Storage - Section B",
          batch_number: "SB2024002",
          condition: "good",
          received_by: "Mike Johnson",
          notes: "12mm steel bars, grade 60"
        },
        {
          id: "3",
          material_type: "Concrete Blocks",
          quantity: 500,
          unit: "pieces",
          supplier_name: "Block Masters",
          delivery_date: "2024-01-13",
          status: "damaged",
          location: "Yard Area C",
          batch_number: "CB2024003",
          condition: "damaged",
          received_by: "Sarah Wilson",
          notes: "Some blocks damaged during transport - 20 pieces affected"
        },
        {
          id: "4",
          material_type: "Sand",
          quantity: 10,
          unit: "cubic_meters",
          supplier_name: "Desert Sands Co",
          delivery_date: "2024-01-12",
          status: "received",
          location: "Material Yard - North",
          condition: "good",
          received_by: "Tom Brown",
          notes: "Fine sand for concrete mixing"
        }
      ];

      setMaterials(mockMaterials);
    } catch (error: any) {
      toast({
        title: "Error Loading Materials",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.material_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.batch_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(material => material.status === statusFilter);
    }

    if (materialTypeFilter !== "all") {
      filtered = filtered.filter(material => material.material_type === materialTypeFilter);
    }

    setFilteredMaterials(filtered);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "received":
        return "secondary";
      case "in_use":
        return "default";
      case "damaged":
        return "destructive";
      case "expired":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case "good":
        return "secondary";
      case "damaged":
        return "destructive";
      case "expired":
        return "outline";
      default:
        return "secondary";
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Material Type", "Quantity", "Unit", "Supplier", "Delivery Date", 
      "Status", "Location", "Batch Number", "Condition", "Received By", "Notes"
    ];
    
    const csvContent = [
      headers.join(","),
      ...filteredMaterials.map(material => [
        material.material_type,
        material.quantity,
        material.unit,
        material.supplier_name,
        material.delivery_date,
        material.status,
        material.location,
        material.batch_number || "",
        material.condition,
        material.received_by,
        material.notes || ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site-material-register-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Material register has been exported to CSV."
    });
  };

  const uniqueMaterialTypes = Array.from(new Set(materials.map(m => m.material_type)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">Loading material register...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Site Material Register</CardTitle>
                <CardDescription>
                  Track and manage all materials received on site
                </CardDescription>
              </div>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by material, supplier, batch number, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="in_use">In Use</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={materialTypeFilter} onValueChange={setMaterialTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Materials</SelectItem>
                {uniqueMaterialTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Material Register Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Batch #</TableHead>
                  <TableHead>Received By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Package className="h-8 w-8" />
                        <p>No materials found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.material_type}
                      </TableCell>
                      <TableCell>
                        {material.quantity} {material.unit}
                      </TableCell>
                      <TableCell>{material.supplier_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(material.delivery_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(material.status)}>
                          {material.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getConditionBadgeVariant(material.condition)}>
                          {material.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{material.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {material.batch_number || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {material.received_by}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4">
              <div className="text-2xl font-bold text-primary">
                {materials.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {materials.filter(m => m.status === 'received').length}
              </div>
              <div className="text-sm text-muted-foreground">Received</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {materials.filter(m => m.status === 'in_use').length}
              </div>
              <div className="text-sm text-muted-foreground">In Use</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {materials.filter(m => m.status === 'damaged').length}
              </div>
              <div className="text-sm text-muted-foreground">Damaged</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteMaterialRegister;