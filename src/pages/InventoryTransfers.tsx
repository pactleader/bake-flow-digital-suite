
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
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  Search, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  Package,
  Calendar, 
  Check,
  FileText,
  FileCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { InventoryTransfer, InventoryTransferItem, Order, WarehouseLocation, InventoryStockItem, Product, RecipeItem } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock data
const mockLocations: WarehouseLocation[] = [
  { id: 'loc-001', name: 'Main Warehouse', barcode: 'LOC-A1' },
  { id: 'loc-002', name: 'Downtown Bakery', barcode: 'LOC-B1' },
  { id: 'loc-003', name: 'North Bakery', barcode: 'LOC-C1' },
  { id: 'loc-004', name: 'Distribution Center', barcode: 'LOC-D1' },
];

const mockInventoryStock: InventoryStockItem[] = [
  { 
    id: 'stock-001', 
    name: 'All-Purpose Flour', 
    category: 'Dry Goods',
    currentStock: 450,
    unit: 'kg', 
    unitCost: 1.2,
    locationId: 'loc-001',
    locationName: 'Main Warehouse',
    receivedDate: '2025-04-05',
    status: 'available',
    location: 'Main Warehouse' // Added required location property
  },
  { 
    id: 'stock-002', 
    name: 'Sugar', 
    category: 'Dry Goods',
    currentStock: 250,
    unit: 'kg', 
    unitCost: 0.9,
    locationId: 'loc-001',
    locationName: 'Main Warehouse',
    receivedDate: '2025-04-10',
    status: 'available',
    location: 'Main Warehouse' // Added required location property
  },
  { 
    id: 'stock-003', 
    name: 'Large Eggs', 
    category: 'Dairy',
    currentStock: 200,
    unit: 'dozen', 
    unitCost: 2.4,
    locationId: 'loc-001',
    locationName: 'Main Warehouse',
    receivedDate: '2025-04-12',
    status: 'available',
    location: 'Main Warehouse' // Added required location property
  },
  { 
    id: 'stock-004', 
    name: 'Butter', 
    category: 'Dairy',
    currentStock: 100,
    unit: 'kg', 
    unitCost: 4.5,
    locationId: 'loc-001',
    locationName: 'Main Warehouse',
    receivedDate: '2025-04-08',
    status: 'available',
    location: 'Main Warehouse' // Added required location property
  },
  { 
    id: 'stock-005', 
    name: 'Yeast', 
    category: 'Dry Goods',
    currentStock: 30,
    unit: 'kg', 
    unitCost: 8.0,
    locationId: 'loc-001',
    locationName: 'Main Warehouse',
    receivedDate: '2025-04-01',
    status: 'available',
    location: 'Main Warehouse' // Added required location property
  },
];

// Mock orders with due dates
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    clientId: 'client-001',
    clientName: 'Café Sunrise',
    orderDate: '2025-04-10',
    dueDate: '2025-04-18',
    status: 'confirmed',
    items: [
      { productId: 'prod-001', productName: 'Sourdough Bread', quantity: 20, price: 4.99 },
      { productId: 'prod-002', productName: 'Croissants', quantity: 40, price: 1.99 },
    ],
    total: 179.80,
    paymentStatus: 'charge_account'
  },
  {
    id: 'ORD-002',
    clientId: 'client-002',
    clientName: 'The Morning Bakery',
    orderDate: '2025-04-12',
    dueDate: '2025-04-17',
    status: 'confirmed',
    items: [
      { productId: 'prod-003', productName: 'Chocolate Cake', quantity: 5, price: 24.99 },
      { productId: 'prod-004', productName: 'Blueberry Muffins', quantity: 30, price: 2.49 },
    ],
    total: 199.65,
    paymentStatus: 'paid'
  },
];

// Mock products with recipes
const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Sourdough Bread',
    category: 'Bread',
    salePrice: 4.99,
    costPrice: 1.75,
    recipe: [
      { inventoryItemId: 'stock-001', name: 'All-Purpose Flour', quantity: 0.5, unit: 'kg' },
      { inventoryItemId: 'stock-005', name: 'Yeast', quantity: 0.01, unit: 'kg' },
    ]
  },
  {
    id: 'prod-002',
    name: 'Croissants',
    category: 'Pastry',
    salePrice: 1.99,
    costPrice: 0.80,
    recipe: [
      { inventoryItemId: 'stock-001', name: 'All-Purpose Flour', quantity: 0.1, unit: 'kg' },
      { inventoryItemId: 'stock-004', name: 'Butter', quantity: 0.05, unit: 'kg' },
      { inventoryItemId: 'stock-005', name: 'Yeast', quantity: 0.005, unit: 'kg' },
    ]
  },
  {
    id: 'prod-003',
    name: 'Chocolate Cake',
    category: 'Cake',
    salePrice: 24.99,
    costPrice: 8.50,
    recipe: [
      { inventoryItemId: 'stock-001', name: 'All-Purpose Flour', quantity: 0.3, unit: 'kg' },
      { inventoryItemId: 'stock-002', name: 'Sugar', quantity: 0.25, unit: 'kg' },
      { inventoryItemId: 'stock-003', name: 'Large Eggs', quantity: 0.5, unit: 'dozen' },
      { inventoryItemId: 'stock-004', name: 'Butter', quantity: 0.2, unit: 'kg' },
    ]
  },
  {
    id: 'prod-004',
    name: 'Blueberry Muffins',
    category: 'Pastry',
    salePrice: 2.49,
    costPrice: 0.95,
    recipe: [
      { inventoryItemId: 'stock-001', name: 'All-Purpose Flour', quantity: 0.1, unit: 'kg' },
      { inventoryItemId: 'stock-002', name: 'Sugar', quantity: 0.08, unit: 'kg' },
      { inventoryItemId: 'stock-003', name: 'Large Eggs', quantity: 0.25, unit: 'dozen' },
      { inventoryItemId: 'stock-004', name: 'Butter', quantity: 0.05, unit: 'kg' },
    ]
  },
];

// Mock transfer requests
const mockTransfers: InventoryTransfer[] = [
  {
    id: 'ITR-001',
    fromLocationId: 'loc-001',
    fromLocationName: 'Main Warehouse',
    toLocationId: 'loc-002',
    toLocationName: 'Downtown Bakery',
    date: '2025-04-15',
    status: 'pending',
    items: [
      { 
        inventoryItemId: 'stock-001', 
        name: 'All-Purpose Flour', 
        quantity: 50, 
        unit: 'kg',
        status: 'pending'
      },
      { 
        inventoryItemId: 'stock-003', 
        name: 'Large Eggs', 
        quantity: 10, 
        unit: 'dozen',
        status: 'pending'
      },
    ],
    ordersLinked: ['ORD-001']
  },
  {
    id: 'ITR-002',
    fromLocationId: 'loc-001',
    fromLocationName: 'Main Warehouse',
    toLocationId: 'loc-003',
    toLocationName: 'North Bakery',
    date: '2025-04-16',
    status: 'in_progress',
    items: [
      { 
        inventoryItemId: 'stock-001', 
        name: 'All-Purpose Flour', 
        quantity: 40, 
        unit: 'kg',
        status: 'picked'
      },
      { 
        inventoryItemId: 'stock-002', 
        name: 'Sugar', 
        quantity: 25, 
        unit: 'kg',
        status: 'pending'
      },
      { 
        inventoryItemId: 'stock-004', 
        name: 'Butter', 
        quantity: 15, 
        unit: 'kg',
        status: 'picked'
      },
    ],
    ordersLinked: ['ORD-002']
  },
];

// Create the TransfersTable component that was missing
interface TransfersTableProps {
  transfers: InventoryTransfer[];
  onViewTransfer: (transfer: InventoryTransfer) => void;
}

const TransfersTable: React.FC<TransfersTableProps> = ({ transfers, onViewTransfer }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transfer ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No transfer requests found.
              </TableCell>
            </TableRow>
          ) : (
            transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell className="font-medium">{transfer.id}</TableCell>
                <TableCell>{formatDate(transfer.date)}</TableCell>
                <TableCell>{transfer.fromLocationName}</TableCell>
                <TableCell>{transfer.toLocationName}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    transfer.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    transfer.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {transfer.status === 'completed' ? 'Completed' : 
                     transfer.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </span>
                </TableCell>
                <TableCell className="text-right">{transfer.items.length}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onViewTransfer(transfer)}>
                    View
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

const InventoryTransfers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transfers, setTransfers] = useState<InventoryTransfer[]>(mockTransfers);
  
  // Creation states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [manualItems, setManualItems] = useState<InventoryTransferItem[]>([]);
  const [calculatedItems, setCalculatedItems] = useState<InventoryTransferItem[]>([]);
  const [step, setStep] = useState(1);
  
  // Detail view states
  const [selectedTransfer, setSelectedTransfer] = useState<InventoryTransfer | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryTransferItem | null>(null);
  const [isMarkPickedDialogOpen, setIsMarkPickedDialogOpen] = useState(false);
  const [isMarkTransferredDialogOpen, setIsMarkTransferredDialogOpen] = useState(false);
  
  const filteredTransfers = transfers.filter(transfer => {
    return (
      transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromLocationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toLocationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const pendingTransfers = transfers.filter(t => t.status === 'pending');
  const inProgressTransfers = transfers.filter(t => t.status === 'in_progress');
  const completedTransfers = transfers.filter(t => t.status === 'completed');

  const getItemsNeededForOrders = (orderIds: string[]): InventoryTransferItem[] => {
    // Get all selected orders
    const selected = mockOrders.filter(order => orderIds.includes(order.id));
    
    // Calculate ingredients needed for all products in all selected orders
    const ingredientsNeeded: Record<string, { name: string, quantity: number, unit: string }> = {};
    
    selected.forEach(order => {
      order.items.forEach(orderItem => {
        // Find the product
        const product = mockProducts.find(p => p.id === orderItem.productId);
        if (!product || !product.recipe) return;
        
        // Calculate ingredients for the quantity ordered
        product.recipe.forEach((recipeItem: RecipeItem) => {
          const totalQuantity = recipeItem.quantity * orderItem.quantity;
          
          if (ingredientsNeeded[recipeItem.inventoryItemId]) {
            ingredientsNeeded[recipeItem.inventoryItemId].quantity += totalQuantity;
          } else {
            ingredientsNeeded[recipeItem.inventoryItemId] = {
              name: recipeItem.name,
              quantity: totalQuantity,
              unit: recipeItem.unit
            };
          }
        });
      });
    });
    
    // Convert to transfer items
    return Object.keys(ingredientsNeeded).map(itemId => ({
      inventoryItemId: itemId,
      name: ingredientsNeeded[itemId].name,
      quantity: ingredientsNeeded[itemId].quantity,
      unit: ingredientsNeeded[itemId].unit,
      status: 'pending'
    }));
  };

  const checkInventoryAvailability = (items: InventoryTransferItem[]): InventoryTransferItem[] => {
    return items.map(item => {
      // Find corresponding inventory item
      const inventoryItem = mockInventoryStock.find(
        stock => stock.id === item.inventoryItemId
      );
      
      const available = inventoryItem ? inventoryItem.currentStock : 0;
      const isAvailable = available >= item.quantity;
      
      return {
        ...item,
        stockItems: inventoryItem ? [inventoryItem] : undefined,
        // Add a field to track availability - this would be used for UI indicators
        // In a real app, this would be more sophisticated
        // For this demo, we'll keep things simple
      };
    });
  };

  const handleCreateTransfer = () => {
    // Reset creation state
    setFromLocation('');
    setToLocation('');
    setTransferDate('');
    setSelectedOrders([]);
    setManualItems([]);
    setCalculatedItems([]);
    setStep(1);
    setIsCreateDialogOpen(true);
  };

  const handleNext = () => {
    if (step === 1) {
      // Calculate items needed for selected orders
      const itemsNeeded = getItemsNeededForOrders(selectedOrders);
      setCalculatedItems(checkInventoryAvailability(itemsNeeded));
      setStep(2);
    } else if (step === 2) {
      // Combine calculated items and manually added items
      const allItems = [...calculatedItems, ...manualItems];
      
      // Create a new transfer request
      const newTransfer: InventoryTransfer = {
        id: `ITR-${Date.now().toString().substr(-6)}`,
        fromLocationId: fromLocation,
        fromLocationName: mockLocations.find(loc => loc.id === fromLocation)?.name || '',
        toLocationId: toLocation,
        toLocationName: mockLocations.find(loc => loc.id === toLocation)?.name || '',
        date: transferDate || new Date().toISOString().split('T')[0],
        status: 'pending',
        items: allItems,
        ordersLinked: selectedOrders.length > 0 ? selectedOrders : undefined
      };
      
      setTransfers([...transfers, newTransfer]);
      setIsCreateDialogOpen(false);
    }
  };

  const handleAddManualItem = () => {
    // In a real app, this would add a new item to the manual items list
    // For this demo, we'll just add a dummy item
    const newItem: InventoryTransferItem = {
      inventoryItemId: mockInventoryStock[0].id,
      name: mockInventoryStock[0].name,
      quantity: 10,
      unit: mockInventoryStock[0].unit,
      status: 'pending'
    };
    
    setManualItems([...manualItems, newItem]);
  };

  const handleMarkItemPicked = () => {
    if (!selectedTransfer || !selectedItem) return;
    
    const updatedTransfers = transfers.map(transfer => {
      if (transfer.id === selectedTransfer.id) {
        const updatedItems = transfer.items.map(item => {
          if (item.inventoryItemId === selectedItem.inventoryItemId) {
            return { ...item, status: 'picked' };
          }
          return item;
        });
        
        // If all items are picked, update transfer status
        const allPicked = updatedItems.every(item => item.status === 'picked' || item.status === 'transferred');
        return {
          ...transfer,
          items: updatedItems,
          status: allPicked ? 'in_progress' : transfer.status
        };
      }
      return transfer;
    });
    
    setTransfers(updatedTransfers);
    setIsMarkPickedDialogOpen(false);
    
    // Update the selected transfer to reflect changes
    const updatedTransfer = updatedTransfers.find(t => t.id === selectedTransfer.id) || null;
    setSelectedTransfer(updatedTransfer);
    setSelectedItem(null);
  };

  const handleMarkItemTransferred = () => {
    if (!selectedTransfer || !selectedItem) return;
    
    const updatedTransfers = transfers.map(transfer => {
      if (transfer.id === selectedTransfer.id) {
        const updatedItems = transfer.items.map(item => {
          if (item.inventoryItemId === selectedItem.inventoryItemId) {
            return { ...item, status: 'transferred' };
          }
          return item;
        });
        
        // If all items are transferred, update transfer status
        const allTransferred = updatedItems.every(item => item.status === 'transferred');
        return {
          ...transfer,
          items: updatedItems,
          status: allTransferred ? 'completed' : transfer.status
        };
      }
      return transfer;
    });
    
    setTransfers(updatedTransfers);
    setIsMarkTransferredDialogOpen(false);
    
    // Update the selected transfer to reflect changes
    const updatedTransfer = updatedTransfers.find(t => t.id === selectedTransfer.id) || null;
    setSelectedTransfer(updatedTransfer);
    setSelectedItem(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Inventory Transfers" 
          subtitle="Manage inventory movement between locations" 
        />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
              <Package className="h-10 w-10 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Pending Transfers</h3>
                <p className="text-2xl font-bold">{pendingTransfers.length}</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
              <Truck className="h-10 w-10 text-amber-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">In Progress</h3>
                <p className="text-2xl font-bold">{inProgressTransfers.length}</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <Check className="h-10 w-10 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Completed</h3>
                <p className="text-2xl font-bold">{completedTransfers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transfers..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={handleCreateTransfer}>
              <ArrowRight size={16} className="mr-1" />
              Create Transfer Request
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Transfers</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <TransfersTable transfers={filteredTransfers} onViewTransfer={setSelectedTransfer} />
            </TabsContent>
            
            <TabsContent value="pending" className="pt-4">
              <TransfersTable transfers={pendingTransfers} onViewTransfer={setSelectedTransfer} />
            </TabsContent>
            
            <TabsContent value="in-progress" className="pt-4">
              <TransfersTable transfers={inProgressTransfers} onViewTransfer={setSelectedTransfer} />
            </TabsContent>
            
            <TabsContent value="completed" className="pt-4">
              <TransfersTable transfers={completedTransfers} onViewTransfer={setSelectedTransfer} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Create Transfer Dialog - Step by Step */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Inventory Transfer Request</DialogTitle>
            <DialogDescription>
              Step {step} of 2: {step === 1 ? 'Basic Information' : 'Confirm Items'}
            </DialogDescription>
          </DialogHeader>
          
          {step === 1 ? (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Location</label>
                  <Select value={fromLocation} onValueChange={setFromLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source location" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLocations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Location</label>
                  <Select 
                    value={toLocation} 
                    onValueChange={setToLocation}
                    disabled={!fromLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination location" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLocations
                        .filter(loc => loc.id !== fromLocation)
                        .map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Transfer Date</label>
                <Input 
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Select Orders to Link</label>
                <p className="text-sm text-muted-foreground mb-2">
                  Linking orders will automatically calculate required inventory items.
                </p>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Order #</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Items</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="w-12">
                            <input 
                              type="checkbox" 
                              checked={selectedOrders.includes(order.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrders([...selectedOrders, order.id]);
                                } else {
                                  setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.clientName}</TableCell>
                          <TableCell>{formatDate(order.dueDate)}</TableCell>
                          <TableCell className="text-right">{order.items.length}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Calculated Items from Orders</h3>
                  <span className="text-sm text-muted-foreground">
                    {calculatedItems.length} items required
                  </span>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculatedItems.map((item) => {
                        const stockItem = item.stockItems?.[0];
                        const available = stockItem?.currentStock || 0;
                        const isAvailable = available >= item.quantity;
                        
                        return (
                          <TableRow key={item.inventoryItemId}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell className="text-right">
                              <span className={isAvailable ? 'text-green-600' : 'text-red-600'}>
                                {available} {stockItem?.unit}
                                {!isAvailable && (
                                  <AlertTriangle className="inline-block ml-1 h-4 w-4" />
                                )}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Additional Items</h3>
                  <Button variant="outline" size="sm" onClick={handleAddManualItem}>
                    Add Item
                  </Button>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {manualItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            No additional items added.
                          </TableCell>
                        </TableRow>
                      ) : (
                        manualItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {calculatedItems.some(
                item => !item.stockItems || item.stockItems[0]?.currentStock < item.quantity
              ) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Insufficient Inventory</h4>
                    <p className="text-sm text-yellow-700">
                      Some items have insufficient inventory. Please adjust quantities or restock.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {step === 1 ? (
              <>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!fromLocation || !toLocation || selectedOrders.length === 0}
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Generate Transfer Request
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Transfer Details Sheet */}
      <Sheet open={!!selectedTransfer} onOpenChange={() => setSelectedTransfer(null)}>
        <SheetContent className="w-[90%] sm:max-w-md md:max-w-xl">
          <SheetHeader>
            <SheetTitle>Transfer Request Details</SheetTitle>
          </SheetHeader>
          
          {selectedTransfer && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Request ID</h3>
                  <p className="font-medium">{selectedTransfer.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p>{formatDate(selectedTransfer.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                  <p>{selectedTransfer.fromLocationName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">To</h3>
                  <p>{selectedTransfer.toLocationName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    selectedTransfer.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    selectedTransfer.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedTransfer.status === 'completed' ? 'Completed' : 
                     selectedTransfer.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              </div>
              
              {selectedTransfer.ordersLinked && selectedTransfer.ordersLinked.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Linked Orders</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTransfer.ordersLinked.map(orderId => (
                      <span 
                        key={orderId}
                        className="inline-block bg-blue-50 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {orderId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Transfer Items</h3>
                  
                  {selectedTransfer.status !== 'completed' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileCheck className="h-4 w-4" /> Mark Picked
                      </Button>
                      <Button size="sm" variant="outline">
                        <ArrowRight className="h-4 w-4" /> Mark Transferred
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default InventoryTransfers;

