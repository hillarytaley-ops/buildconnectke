import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, FileText, CheckCircle, AlertCircle, Plus, Minus } from "lucide-react";

const grnSchema = z.object({
  grnNumber: z.string().min(1, "GRN number is required"),
  supplierName: z.string().min(1, "Supplier name is required"),
  receivedBy: z.string().min(1, "Received by field is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  deliveryNoteReference: z.string().optional(),
  overallCondition: z.enum(["good", "damaged", "partial"]),
  items: z.array(z.object({
    description: z.string().min(1, "Item description is required"),
    orderedQuantity: z.number().min(1, "Ordered quantity must be positive"),
    receivedQuantity: z.number().min(0, "Received quantity cannot be negative"),
    unit: z.string().min(1, "Unit is required"),
    condition: z.enum(["good", "damaged", "missing"]),
    remarks: z.string().optional()
  })).min(1, "At least one item is required"),
  discrepancies: z.string().optional(),
  additionalNotes: z.string().optional()
});

type GRNFormData = z.infer<typeof grnSchema>;

const GoodsReceivedNote = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<GRNFormData>({
    resolver: zodResolver(grnSchema),
    defaultValues: {
      grnNumber: `GRN${Date.now()}`,
      receivedDate: new Date().toISOString().split('T')[0],
      overallCondition: "good",
      items: [{
        description: "",
        orderedQuantity: 1,
        receivedQuantity: 1,
        unit: "pieces",
        condition: "good",
        remarks: ""
      }]
    }
  });

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [...currentItems, {
      description: "",
      orderedQuantity: 1,
      receivedQuantity: 1,
      unit: "pieces",
      condition: "good",
      remarks: ""
    }]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue("items", currentItems.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: GRNFormData) => {
    setIsSubmitting(true);
    try {
      // Check if user is a professional builder or company
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role !== 'builder' || (!profile.is_professional && profile.user_type !== 'company')) {
        toast({
          title: "Access Denied",
          description: "Only professional builders and companies can create GRNs.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('goods_received_notes')
        .insert({
          grn_number: data.grnNumber,
          supplier_name: data.supplierName,
          received_by: data.receivedBy,
          received_date: data.receivedDate,
          delivery_note_reference: data.deliveryNoteReference,
          overall_condition: data.overallCondition,
          items: data.items,
          discrepancies: data.discrepancies,
          additional_notes: data.additionalNotes,
          builder_id: profile.id,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "GRN Created Successfully",
        description: "The Goods Received Note has been created and saved.",
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Error Creating GRN",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Goods Received Note (GRN)</CardTitle>
              <CardDescription>
                Create a formal record of materials received from suppliers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="grnNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GRN Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="GRN number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter supplier name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receivedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received By</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Name of person who received" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receivedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryNoteReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Note Reference</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="DN reference number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="overallCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select overall condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Items Received
                  </h3>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                {form.watch("items").map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Description</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter item description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.orderedQuantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ordered Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.receivedQuantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Received Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pieces">Pieces</SelectItem>
                                <SelectItem value="kg">Kilograms</SelectItem>
                                <SelectItem value="tons">Tons</SelectItem>
                                <SelectItem value="cubic_meters">Cubic Meters</SelectItem>
                                <SelectItem value="square_meters">Square Meters</SelectItem>
                                <SelectItem value="bags">Bags</SelectItem>
                                <SelectItem value="boxes">Boxes</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.condition`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                                <SelectItem value="missing">Missing</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end gap-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.remarks`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Remarks</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Additional remarks" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("items").length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="discrepancies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discrepancies</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe any discrepancies between ordered and received items"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Any additional comments or observations"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating GRN..." : "Create GRN"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoodsReceivedNote;