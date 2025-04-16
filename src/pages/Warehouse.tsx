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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Search, 
  Barcode, 
  Box, 
  ArrowRight, 
  Tag,
  Warehouse as WarehouseIcon,
  Check,
  QrCode
} from 'lucide-react';
import { InventoryStockItem, WarehouseLocation } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock warehouse locations
const mockLocations: WarehouseLocation[] = [
  { id: 'loc-001', name: 'Dry Storage A1', barcode: 'LOC-A1', description: 'Shelf A, Row 1' },
  { id: 'loc-002', name: 'Dry Storage A2', barcode: 'LOC-A2', description: 'Shelf A, Row 2' },
  { id: 'loc-003', name: 'Dry Storage B1', barcode: 'LOC-B1', description: 'Shelf B, Row 1' },
  { id: 'loc-004', name: 'Cold Storage C1', barcode: 'LOC-C1', description: 'Refrigerator C, Shelf 1' },
  { id: 'loc-005', name: 'Freezer D1', barcode: 'LOC-D1', description: 'Freezer D, Shelf 1' },
];

// Mock inventory stock items
const mockInventoryStock: InventoryStockItem[] = [
  { 
    id: 'stock-001', 
    name: 'All-Purpose Flour', 
    category: 'Dry Goods',
    currentStock: 450,
    unit: 'kg', 
    unitCost: 1.2,
    locationId: 'loc-001',
    locationName: 'Dry Storage A1',
    receivedDate: '2025-04-05',
    status: 'available',
    expiryDate: '2025-10-05',
    batchId: 'BATCH-001'
  },
  { 
    id: 'stock-002', 
    name: 'All-Purpose Flour', 
    category: 'Dry Goods',
    currentStock: 250,
    unit: 'kg', 
    unitCost: 1.2,
    locationId: 'loc-002',
    locationName: 'Dry Storage A2',
    receivedDate: '2025-04-10',
    status: 'available',
    expiryDate: '2025-10-10',
    batchId: 'BATCH-002'
  },
  { 
    id: 'stock-003', 
    name: 'Large Eggs', 
    category: 'Dairy',
    currentStock: 200,
    unit: 'dozen', 
    unitCost: 2.4,
    locationId: 'loc-004',
    locationName: 'Cold Storage C1',
    receivedDate: '2025-04-12',
    status: 'available',
    expiryDate: '2025-05-10',
    batchId: 'BATCH-003'
  },
  { 
    id: 'stock-004', 
    name: 'Butter', 
    category: 'Dairy',
    currentStock: 100,
    unit: 'kg', 
    unitCost: 4.5,
    locationId: 'loc-004',
    locationName: 'Cold Storage C1',
    receivedDate: '2025-04-08',
    status: 'available',
    expiryDate: '2025-06-08',
    batchId: 'BATCH-004'
  },
  { 
    id: 'stock-005', 
    name: 'Frozen Berries', 
    category: 'Frozen Goods',
    currentStock: 80,
    unit: 'kg', 
    unitCost: 3.8,
    locationId: 'loc-005',
    locationName: 'Freezer D1',
    receivedDate: '2025-03-20',
    status: 'available',
    expiryDate: '2026-03-20',
    batchId: 'BATCH-005'
  },
];

const Warehouse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [stockItems, setStockItems] = useState<InventoryStockItem[]>(mockInventoryStock);
  const [locations, setLocations] = useState<WarehouseLocation[]>(mockLocations);
  
  // Dialogs
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  
  // Form states
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [scannedLocation, setScannedLocation] = useState<WarehouseLocation | null>(null);
  const [scannedItem, setScannedItem] = useState<InventoryStockItem | null>(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [selectedItem, setSelectedItem] = useState<InventoryStockItem | null>(null);
  const [targetLocation, setTargetLocation] = useState('');
  
  // Filter inventory stock
  const filteredStock = stockItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !selectedLocation || item.locationId === selectedLocation;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesLocation && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(stockItems.map(item => item.category)));

  const handleLocationSelection = (locationId: string) => {
    // Find the selected location
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setScannedLocation(location);
      // Clear any previously scanned item
      setScannedItem(null);
      setStockQuantity(0);
    }
  };

  const handleItemScanned = (itemId: string) => {
    // In a real app, this would be triggered by a barcode scanner
    // For this demo, we'll simulate by finding the item in our mock data
    const item = stockItems.find(item => item.id === itemId);
    if (item) {
      setScannedItem(item);
      setStockQuantity(item.currentStock);
    }
  };

  const handleAddStock = () => {
    if (!scannedLocation || !scannedItem || stockQuantity <= 0) return;
    
    // In a real app, you would update the database
    // For this demo, we'll just update the state
    
    // Check if this item already exists in this location
    const existingItemIndex = stockItems.findIndex(
      item => item.id === scannedItem.id && item.locationId === scannedLocation.id
    );
    
    if (existingItemIndex >= 0) {
      // Update existing stock
      const updatedStockItems = [...stockItems];
      updatedStockItems[existingItemIndex] = {
        ...updatedStockItems[existingItemIndex],
        currentStock: stockQuantity
      };
      setStockItems(updatedStockItems);
    } else {
      // Add new stock entry
      const newStockItem: InventoryStockItem = {
        ...scannedItem,
        id: `stock-${Date.now()}`, // Generate a new ID
        locationId: scannedLocation.id,
        locationName: scannedLocation.name,
        currentStock: stockQuantity,
        status: 'available',
        receivedDate: new Date().toISOString(),
        batchId: `BATCH-${Date.now().toString().substr(-4)}` // Generate a simple batch ID
      };
      setStockItems([...stockItems, newStockItem]);
    }
    
    // Reset form
    setIsAddStockDialogOpen(false);
    setScannedLocation(null);
    setScannedItem(null);
    setStockQuantity(0);
  };

  const handleMoveStock = () => {
    if (!selectedItem || !targetLocation) return;
    
    // Find the target location
    const location = locations.find(loc => loc.id === targetLocation);
    if (!location) return;
    
    // Create a new stock entry at the target location
    const newStockItem: InventoryStockItem = {
      ...selectedItem,
      id: `stock-${Date.now()}`,
      locationId: location.id,
      locationName: location.name,
      status: 'available',
      // Keep the same batch ID, expiry date, etc.
    };
    
    // Reduce the stock at the original location (or remove if moving all)
    const updatedStockItems = stockItems.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          currentStock: 0, // Assuming we're moving all stock
          status: 'transferred'
        };
      }
      return item;
    });
    
    setStockItems([...updatedStockItems, newStockItem]);
    setIsMoveDialogOpen(false);
    setSelectedItem(null);
    setTargetLocation('');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Warehouse & Stocking" 
          subtitle="Manage inventory locations and stock" 
        />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
                <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{locations.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Stock Items</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stockItems.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Items Expiring Soon</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stockItems.filter(item => {
                    if (!item.expiryDate) return false;
                    const expiryDate = new Date(item.expiryDate);
                    const today = new Date();
                    const thirtyDaysFromNow = new Date();
                    thirtyDaysFromNow.setDate(today.getDate() + 30);
                    return expiryDate <= thirtyDaysFromNow && expiryDate > today;
                  }).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    stockItems.reduce((total, item) => total + (item.currentStock * item.unitCost), 0)
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search inventory..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsScanDialogOpen(true)}>
                <Barcode size={16} className="mr-1" />
                Scan Items
              </Button>
              <Button onClick={() => setIsAddStockDialogOpen(true)}>
                <Box size={16} className="mr-1" />
                Add Stock
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="stock" className="mb-8">
            <TabsList>
              <TabsTrigger value="stock">Inventory Stock</TabsTrigger>
              <TabsTrigger value="locations">Warehouse Locations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stock" className="pt-4">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStock.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No stock items found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStock.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.batchId || '—'}</TableCell>
                          <TableCell>{item.locationName}</TableCell>
                          <TableCell className="text-right">
                            {item.currentStock} {item.unit}
                          </TableCell>
                          <TableCell>{item.expiryDate ? formatDate(item.expiryDate) : '—'}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              item.status === 'available' ? 'bg-green-100 text-green-800' : 
                              item.status === 'allocated' ? 'bg-blue-100 text-blue-800' : 
                              item.status === 'holding' ? 'bg-amber-100 text-amber-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.currentStock * item.unitCost)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setSelectedItem(item);
                                setIsMoveDialogOpen(true);
                              }}
                            >
                              Move
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="locations" className="pt-4">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location Name</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Items Stored</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((location) => {
                      const itemsAtLocation = stockItems.filter(
                        item => item.locationId === location.id && item.status === 'available'
                      );
                      const totalItems = itemsAtLocation.length;
                      
                      return (
                        <TableRow key={location.id}>
                          <TableCell className="font-medium">{location.name}</TableCell>
                          <TableCell>{location.barcode}</TableCell>
                          <TableCell>{location.description || '—'}</TableCell>
                          <TableCell className="text-right">{totalItems}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Barcode Scanning Dialog */}
      <Dialog open={isScanDialogOpen} onOpenChange={setIsScanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex flex-col items-center justify-center bg-muted/30 border border-dashed rounded-lg p-8 mb-6">
              <Barcode className="h-16 w-16 text-muted-foreground mb-2" />
              <p className="text-center text-muted-foreground mb-4">Scan a location or item barcode</p>
              <Input
                className="mb-4 text-center"
                value={scannedBarcode}
                onChange={(e) => setScannedBarcode(e.target.value)}
                placeholder="Barcode value"
              />
              <Button variant="outline">
                <QrCode size={16} className="mr-1" /> Activate Scanner
              </Button>
            </div>
            
            <div className="text-center">
              <p className="font-medium">Scanning instructions:</p>
              <ol className="text-muted-foreground text-sm mt-2 text-left list-decimal list-inside">
                <li>First scan the location barcode</li>
                <li>Then scan the item barcode</li>
                <li>Enter the quantity of the item at that location</li>
              </ol>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Simulate a barcode scan - in a real app this would trigger the actual scanner
              setIsScanDialogOpen(false);
              setIsAddStockDialogOpen(true);
              // For demo, let's just select the first location and item
              setScannedLocation(locations[0]);
              setScannedItem(mockInventoryStock[0]);
            }}>
              Proceed to Add Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Stock Dialog */}
      <Dialog open={isAddStockDialogOpen} onOpenChange={setIsAddStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock to Location</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select 
                value={scannedLocation?.id || ''} 
                onValueChange={handleLocationSelection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Item</label>
              <Select 
                value={scannedItem?.id || ''} 
                onValueChange={handleItemScanned}
                disabled={!scannedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {mockInventoryStock.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {scannedItem && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity ({scannedItem.unit})</label>
                <Input 
                  type="number" 
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddStock}
              disabled={!scannedLocation || !scannedItem || stockQuantity <= 0}
            >
              <Check size={16} className="mr-1" />
              Save Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Move Stock Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Stock to New Location</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="py-4 space-y-4">
              <div>
                <p><strong>Item:</strong> {selectedItem.name}</p>
                <p><strong>Current Location:</strong> {selectedItem.locationName}</p>
                <p><strong>Quantity:</strong> {selectedItem.currentStock} {selectedItem.unit}</p>
                {selectedItem.batchId && (
                  <p><strong>Batch:</strong> {selectedItem.batchId}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Move to Location</label>
                <Select 
                  value={targetLocation} 
                  onValueChange={setTargetLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter(loc => loc.id !== selectedItem.locationId)
                      .map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
                <p className="font-medium text-blue-800">
                  This will follow the "First In, First Out" (FIFO) principle for inventory management.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMoveStock}
              disabled={!selectedItem || !targetLocation}
            >
              <ArrowRight size={16} className="mr-1" />
              Move Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Warehouse;
