
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  Search, 
  Truck, 
  Barcode, 
  Package, 
  Camera, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  FileX
} from 'lucide-react';
import { VendorOrder, VendorOrderItem } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock vendor orders data
const mockVendorOrders: VendorOrder[] = [
  {
    id: 'vo-001',
    vendorId: 'v-001',
    vendorName: 'Flour Mill Co.',
    orderNumber: 'ORD-2025-0001',
    orderDate: '2025-04-10',
    expectedArrival: '2025-04-18',
    status: 'pending',
    items: [
      { inventoryItemId: 'i-001', name: 'All-Purpose Flour', quantity: 500, unit: 'kg', unitPrice: 1.2 },
      { inventoryItemId: 'i-002', name: 'Whole Wheat Flour', quantity: 200, unit: 'kg', unitPrice: 1.5 },
    ],
    totalAmount: 900
  },
  {
    id: 'vo-002',
    vendorId: 'v-002',
    vendorName: 'Egg Farm Inc.',
    orderNumber: 'ORD-2025-0002',
    orderDate: '2025-04-12',
    expectedArrival: '2025-04-16',
    status: 'pending',
    items: [
      { inventoryItemId: 'i-003', name: 'Large Eggs', quantity: 500, unit: 'dozen', unitPrice: 2.4 },
    ],
    totalAmount: 1200
  },
  {
    id: 'vo-003',
    vendorId: 'v-003',
    vendorName: 'Sweet Supplies Ltd.',
    orderNumber: 'ORD-2025-0003',
    orderDate: '2025-04-13',
    expectedArrival: '2025-04-17',
    status: 'pending',
    items: [
      { inventoryItemId: 'i-004', name: 'Granulated Sugar', quantity: 300, unit: 'kg', unitPrice: 0.9 },
      { inventoryItemId: 'i-005', name: 'Brown Sugar', quantity: 150, unit: 'kg', unitPrice: 1.1 },
      { inventoryItemId: 'i-006', name: 'Vanilla Extract', quantity: 20, unit: 'liter', unitPrice: 25 },
    ],
    totalAmount: 1070
  }
];

const InventoryReceiving = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>(mockVendorOrders);
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VendorOrderItem | null>(null);
  const [receivedQuantity, setReceivedQuantity] = useState<number>(0);
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [issueType, setIssueType] = useState<'damaged' | 'missing'>('damaged');
  
  // Filter vendor orders
  const filteredOrders = vendorOrders.filter(order => {
    const matchesSearch = 
      order.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVendor = !vendorFilter || order.vendorId === vendorFilter;
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesVendor && matchesStatus;
  });

  // Unique vendors for filter
  const uniqueVendors = Array.from(new Set(vendorOrders.map(order => order.vendorId))).map(
    vendorId => {
      const vendor = vendorOrders.find(order => order.vendorId === vendorId);
      return { id: vendorId, name: vendor?.vendorName || '' };
    }
  );

  const handleReceiveItem = (item: VendorOrderItem) => {
    setSelectedItem(item);
    setReceivedQuantity(item.quantity); // Default to expected quantity
    setIsReceiveDialogOpen(true);
  };

  const handleReportIssue = (item: VendorOrderItem) => {
    setSelectedItem(item);
    setIssueType('damaged');
    setIssueDescription('');
    setIsReportDialogOpen(true);
  };

  const confirmReceiveItem = () => {
    if (!selectedOrder || !selectedItem) return;
    
    const updatedOrders = vendorOrders.map(order => {
      if (order.id === selectedOrder.id) {
        const updatedItems = order.items.map(item => {
          if (item.inventoryItemId === selectedItem.inventoryItemId) {
            return { 
              ...item, 
              status: 'received',
              quantityReceived: receivedQuantity
            };
          }
          return item;
        });
        
        const allReceived = updatedItems.every(item => item.status === 'received');
        return {
          ...order,
          items: updatedItems,
          status: allReceived ? 'received' : 'partial'
        };
      }
      return order;
    });
    
    setVendorOrders(updatedOrders);
    setIsReceiveDialogOpen(false);
    setSelectedItem(null);
  };

  const confirmReportIssue = () => {
    if (!selectedOrder || !selectedItem) return;
    
    const updatedOrders = vendorOrders.map(order => {
      if (order.id === selectedOrder.id) {
        const updatedItems = order.items.map(item => {
          if (item.inventoryItemId === selectedItem.inventoryItemId) {
            return { 
              ...item, 
              status: issueType,
              // Store the description in notes or similar field in a real app
            };
          }
          return item;
        });
        
        return {
          ...order,
          items: updatedItems,
          status: 'partial'
        };
      }
      return order;
    });
    
    setVendorOrders(updatedOrders);
    setIsReportDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Inventory Receiving" 
          subtitle="Manage incoming inventory orders" 
        />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
              <Truck className="h-10 w-10 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Pending Orders</h3>
                <p className="text-2xl font-bold">{vendorOrders.filter(o => o.status === 'pending').length}</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
              <Package className="h-10 w-10 text-amber-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Partially Received</h3>
                <p className="text-2xl font-bold">{vendorOrders.filter(o => o.status === 'partial').length}</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle2 className="h-10 w-10 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Completed Orders</h3>
                <p className="text-2xl font-bold">{vendorOrders.filter(o => o.status === 'received').length}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={vendorFilter} onValueChange={setVendorFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All vendors</SelectItem>
                  {uniqueVendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Calendar size={16} />
              Sort by Date
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="partial">Partially Received</TabsTrigger>
              <TabsTrigger value="received">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <OrdersTable orders={filteredOrders} onViewDetails={setSelectedOrder} />
            </TabsContent>
            
            <TabsContent value="pending" className="pt-4">
              <OrdersTable 
                orders={filteredOrders.filter(o => o.status === 'pending')} 
                onViewDetails={setSelectedOrder} 
              />
            </TabsContent>
            
            <TabsContent value="partial" className="pt-4">
              <OrdersTable 
                orders={filteredOrders.filter(o => o.status === 'partial')} 
                onViewDetails={setSelectedOrder} 
              />
            </TabsContent>
            
            <TabsContent value="received" className="pt-4">
              <OrdersTable 
                orders={filteredOrders.filter(o => o.status === 'received')} 
                onViewDetails={setSelectedOrder} 
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Order Details Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="w-[90%] sm:max-w-md md:max-w-xl">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Vendor</h3>
                  <p className="font-medium">{selectedOrder.vendorName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order #</h3>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                  <p>{formatDate(selectedOrder.orderDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Expected Arrival</h3>
                  <p>{formatDate(selectedOrder.expectedArrival)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    selectedOrder.status === 'received' ? 'bg-green-100 text-green-800' : 
                    selectedOrder.status === 'partial' ? 'bg-amber-100 text-amber-800' : 
                    selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedOrder.status === 'received' ? 'Received' : 
                     selectedOrder.status === 'partial' ? 'Partially Received' : 
                     selectedOrder.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                  <p className="font-medium">{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.inventoryItemId}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                        <TableCell className="text-right">{item.quantityReceived || '—'}</TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'received' ? 'bg-green-100 text-green-800' : 
                            item.status === 'damaged' ? 'bg-red-100 text-red-800' : 
                            item.status === 'missing' ? 'bg-orange-100 text-orange-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {item.status || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          {!item.status && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleReceiveItem(item)}
                              >
                                <Camera size={14} className="mr-1" /> Receive
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleReportIssue(item)}
                              >
                                <AlertCircle size={14} className="mr-1" /> Report
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Image scanning and barcode placeholder in a real app */}
              <div className="mt-6 border-t pt-6">
                <h3 className="font-medium mb-2">Scan Barcodes</h3>
                <div className="flex flex-col items-center justify-center bg-muted/30 border border-dashed rounded-lg p-6 mb-4">
                  <Barcode className="h-16 w-16 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-2">Scan item barcode to quickly add to inventory</p>
                  <Button variant="outline">
                    <Camera size={16} className="mr-1" /> Scan Barcode
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Receive Item Dialog */}
      <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Inventory Item</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="py-4">
              <p className="mb-2"><strong>Item:</strong> {selectedItem.name}</p>
              <p className="mb-4"><strong>Expected:</strong> {selectedItem.quantity} {selectedItem.unit}</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Received Quantity</label>
                  <Input 
                    type="number" 
                    value={receivedQuantity}
                    onChange={(e) => setReceivedQuantity(Number(e.target.value))}
                  />
                </div>
                
                <div className="flex flex-col items-center justify-center bg-muted/30 border border-dashed rounded-lg p-6 mb-4">
                  <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-2">Take a photo of the delivery</p>
                  <Button variant="outline">
                    <Camera size={16} className="mr-1" /> Take Photo
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReceiveItem}>
              Confirm Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Report Issue Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Issue with Item</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="py-4">
              <p className="mb-2"><strong>Item:</strong> {selectedItem.name}</p>
              <p className="mb-4"><strong>Expected:</strong> {selectedItem.quantity} {selectedItem.unit}</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Type</label>
                  <Select value={issueType} onValueChange={(value: 'damaged' | 'missing') => setIssueType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="damaged">Damaged</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input 
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe the issue" 
                  />
                </div>
                
                <div className="flex flex-col items-center justify-center bg-muted/30 border border-dashed rounded-lg p-6 mb-4">
                  <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-2">Take a photo of the issue</p>
                  <Button variant="outline">
                    <Camera size={16} className="mr-1" /> Take Photo
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReportIssue}>
              <FileX size={16} className="mr-1" />
              Report Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface OrdersTableProps {
  orders: VendorOrder[];
  onViewDetails: (order: VendorOrder) => void;
}

const OrdersTable = ({ orders, onViewDetails }: OrdersTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Expected Arrival</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.vendorName}</TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell>{formatDate(order.expectedArrival)}</TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'received' ? 'bg-green-100 text-green-800' : 
                    order.status === 'partial' ? 'bg-amber-100 text-amber-800' : 
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'received' ? 'Received' : 
                     order.status === 'partial' ? 'Partially Received' : 
                     order.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                  </span>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetails(order)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryReceiving;
