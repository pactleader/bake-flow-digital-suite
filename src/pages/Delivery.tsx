
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { StatusBadge } from '@/components/StatusBadge';
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
  SheetFooter
} from '@/components/ui/sheet';
import { 
  Search, 
  Truck, 
  ShoppingBag, 
  Navigation, 
  Package,
  Calendar, 
  Camera,
  FileText,
  MapPin,
  Check,
  Clock,
  CheckCircle2,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { Order, DeliveryRoute } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock data for ready-to-deliver orders
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    clientId: 'client-001',
    clientName: 'Café Sunrise',
    orderDate: '2025-04-10',
    dueDate: '2025-04-18',
    deliveryTime: '8:00 AM - 10:00 AM',
    status: 'labeled',
    items: [
      { productId: 'prod-001', productName: 'Sourdough Bread', quantity: 20, price: 4.99, status: 'labeled' },
      { productId: 'prod-002', productName: 'Croissants', quantity: 40, price: 1.99, status: 'labeled' },
    ],
    total: 179.80,
    paymentStatus: 'charge_account',
    contactName: 'Jane Smith',
    contactPhone: '(555) 123-4567',
    deliveryAddress: '123 Main St, Centertown, CA 90001'
  },
  {
    id: 'ORD-002',
    clientId: 'client-002',
    clientName: 'The Morning Bakery',
    orderDate: '2025-04-12',
    dueDate: '2025-04-17',
    deliveryTime: '7:30 AM - 9:00 AM',
    status: 'labeled',
    items: [
      { productId: 'prod-003', productName: 'Chocolate Cake', quantity: 5, price: 24.99, status: 'labeled' },
      { productId: 'prod-004', productName: 'Blueberry Muffins', quantity: 30, price: 2.49, status: 'labeled' },
    ],
    total: 199.65,
    paymentStatus: 'paid',
    contactName: 'Robert Johnson',
    contactPhone: '(555) 987-6543',
    deliveryAddress: '456 Oak Ave, Westside, CA 90002'
  },
  {
    id: 'ORD-003',
    clientId: 'client-003',
    clientName: 'Downtown Deli',
    orderDate: '2025-04-14',
    dueDate: '2025-04-16',
    deliveryTime: '9:00 AM - 11:00 AM',
    status: 'labeled',
    items: [
      { productId: 'prod-001', productName: 'Sourdough Bread', quantity: 15, price: 4.99, status: 'labeled' },
      { productId: 'prod-005', productName: 'Sandwich Rolls', quantity: 50, price: 1.49, status: 'labeled' },
    ],
    total: 149.35,
    paymentStatus: 'charge_account',
    contactName: 'Michael Brown',
    contactPhone: '(555) 456-7890',
    deliveryAddress: '789 Center St, Downtown, CA 90003'
  }
];

// Mock delivery routes
const mockDeliveryRoutes: DeliveryRoute[] = [
  {
    id: 'route-001',
    driverId: 'driver-001',
    driverName: 'David Miller',
    date: '2025-04-16',
    status: 'pending',
    orders: [mockOrders[0], mockOrders[1]],
    totalDistance: 12.5,
    estimatedTime: 45
  },
  {
    id: 'route-002',
    driverId: 'driver-002',
    driverName: 'Susan Taylor',
    date: '2025-04-16',
    status: 'in_progress',
    orders: [mockOrders[2]],
    totalDistance: 8.2,
    estimatedTime: 30
  }
];

const Delivery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [deliveryRoutes, setDeliveryRoutes] = useState<DeliveryRoute[]>(mockDeliveryRoutes);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  
  // Selected items for loading
  const [loadedItems, setLoadedItems] = useState<{id: string; name: string; quantity: number}[]>([]);
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
  
  // Order claiming
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [claimableOrders, setClaimableOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Route details
  const [selectedRoute, setSelectedRoute] = useState<DeliveryRoute | null>(null);
  const [isRouteDetailOpen, setIsRouteDetailOpen] = useState(false);
  
  // Order delivery
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);

  // Load items from labeled products for delivery
  const handleLoadItems = () => {
    // In a real app, this would scan or load items from inventory
    // For this demo, we'll just simulate some loaded items
    setLoadedItems([
      { id: 'prod-001', name: 'Sourdough Bread', quantity: 35 },
      { id: 'prod-002', name: 'Croissants', quantity: 40 },
      { id: 'prod-003', name: 'Chocolate Cake', quantity: 5 },
      { id: 'prod-004', name: 'Blueberry Muffins', quantity: 30 },
      { id: 'prod-005', name: 'Sandwich Rolls', quantity: 50 }
    ]);
    setIsLoadingDialogOpen(true);
  };

  const handleClaimOrders = () => {
    // Find orders that match the loaded items
    const ordersToShow = orders.filter(order => {
      let canFulfill = true;
      
      // Check if we have all items needed for this order
      order.items.forEach(item => {
        const loadedItem = loadedItems.find(loaded => loaded.id === item.productId);
        if (!loadedItem || loadedItem.quantity < item.quantity) {
          canFulfill = false;
        }
      });
      
      return canFulfill;
    });
    
    setClaimableOrders(ordersToShow);
    setSelectedOrders([]);
    setIsLoadingDialogOpen(false);
    setIsClaimDialogOpen(true);
  };

  const handleConfirmClaim = () => {
    // Create a new delivery route with claimed orders
    const selectedOrderObjects = orders.filter(order => selectedOrders.includes(order.id));
    
    if (selectedOrderObjects.length === 0) {
      setIsClaimDialogOpen(false);
      return;
    }
    
    const newRoute: DeliveryRoute = {
      id: `route-${Date.now().toString().substr(-6)}`,
      driverId: 'driver-001', // In a real app, this would be the logged-in driver
      driverName: 'David Miller', // In a real app, this would be the logged-in driver's name
      date: selectedDate,
      status: 'pending',
      orders: selectedOrderObjects,
      totalDistance: 15.3, // In a real app, this would be calculated
      estimatedTime: 60 // In a real app, this would be calculated
    };
    
    setDeliveryRoutes([...deliveryRoutes, newRoute]);
    setIsClaimDialogOpen(false);
    
    // Update the status of the claimed orders
    const updatedOrders = orders.map(order => {
      if (selectedOrders.includes(order.id)) {
        return { ...order, status: 'loaded' };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Update the loaded items by subtracting claimed quantities
    const updatedLoadedItems = [...loadedItems];
    selectedOrderObjects.forEach(order => {
      order.items.forEach(item => {
        const loadedItemIndex = updatedLoadedItems.findIndex(loaded => loaded.id === item.productId);
        if (loadedItemIndex >= 0) {
          updatedLoadedItems[loadedItemIndex].quantity -= item.quantity;
        }
      });
    });
    
    // Remove any items that are now at 0 quantity
    setLoadedItems(updatedLoadedItems.filter(item => item.quantity > 0));
    
    // Show route details for the new route
    setSelectedRoute(newRoute);
    setIsRouteDetailOpen(true);
  };

  const handleMarkDelivered = () => {
    if (!selectedOrder || !selectedRoute) return;
    
    // Update the order status
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return { ...order, status: 'delivered' };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Update the route
    const updatedRoutes = deliveryRoutes.map(route => {
      if (route.id === selectedRoute.id) {
        const updatedRouteOrders = route.orders.map(order => {
          if (order.id === selectedOrder.id) {
            return { ...order, status: 'delivered' };
          }
          return order;
        });
        
        // Check if all orders in this route are delivered
        const allDelivered = updatedRouteOrders.every(order => order.status === 'delivered');
        
        return { 
          ...route, 
          orders: updatedRouteOrders,
          status: allDelivered ? 'completed' : 'in_progress'
        };
      }
      return route;
    });
    
    setDeliveryRoutes(updatedRoutes);
    
    // Update the selected route
    const updatedRoute = updatedRoutes.find(route => route.id === selectedRoute.id);
    if (updatedRoute) {
      setSelectedRoute(updatedRoute);
    }
    
    setIsDeliveryDialogOpen(false);
    setSelectedOrder(null);
  };

  // Filter routes by date and driver
  const filteredRoutes = deliveryRoutes.filter(route => {
    const matchesDate = route.date === selectedDate;
    const matchesDriver = !selectedDriver || route.driverId === selectedDriver;
    return matchesDate && matchesDriver;
  });

  // Filter orders
  const filteredOrders = orders.filter(order => 
    order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group orders by status for the tabs
  const readyToLoadOrders = filteredOrders.filter(o => o.status === 'labeled');
  const loadedOrders = filteredOrders.filter(o => o.status === 'loaded');
  const inTransitOrders = filteredOrders.filter(o => o.status === 'in_transit');
  const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Delivery Management" 
          subtitle="Manage deliveries and routes" 
        />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
              <ShoppingBag className="h-10 w-10 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Ready to Load</h3>
                <p className="text-2xl font-bold">{readyToLoadOrders.length}</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
              <Truck className="h-10 w-10 text-amber-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">In Transit</h3>
                <p className="text-2xl font-bold">{loadedOrders.length + inTransitOrders.length}</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle2 className="h-10 w-10 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Delivered Today</h3>
                <p className="text-2xl font-bold">{
                  deliveredOrders.filter(o => new Date(o.dueDate).toDateString() === new Date().toDateString()).length
                }</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[180px]"
              />
              
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All drivers</SelectItem>
                  <SelectItem value="driver-001">David Miller</SelectItem>
                  <SelectItem value="driver-002">Susan Taylor</SelectItem>
                </SelectContent>
              </Select>
              
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
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleLoadItems}>
                <Package size={16} className="mr-1" />
                Load Items
              </Button>
              
              {loadedItems.length > 0 && (
                <Button onClick={() => setIsClaimDialogOpen(true)}>
                  <ShoppingCart size={16} className="mr-1" />
                  Claim Orders ({loadedItems.length})
                </Button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="routes" className="mb-8">
            <TabsList>
              <TabsTrigger value="routes">Delivery Routes</TabsTrigger>
              <TabsTrigger value="orders">All Orders</TabsTrigger>
              <TabsTrigger value="ready">Ready to Load</TabsTrigger>
              <TabsTrigger value="transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
            
            <TabsContent value="routes" className="pt-4">
              {filteredRoutes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No delivery routes found for the selected date.
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route ID</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Orders</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Distance</TableHead>
                        <TableHead className="text-right">Est. Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoutes.map((route) => (
                        <TableRow key={route.id}>
                          <TableCell className="font-medium">{route.id}</TableCell>
                          <TableCell>{route.driverName}</TableCell>
                          <TableCell>{formatDate(route.date)}</TableCell>
                          <TableCell className="text-right">{route.orders.length}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              route.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              route.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {route.status === 'completed' ? 'Completed' : 
                               route.status === 'in_progress' ? 'In Progress' : 'Pending'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{route.totalDistance} mi</TableCell>
                          <TableCell className="text-right">{route.estimatedTime} min</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setSelectedRoute(route);
                                setIsRouteDetailOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders" className="pt-4">
              <OrdersTable orders={filteredOrders} />
            </TabsContent>
            
            <TabsContent value="ready" className="pt-4">
              <OrdersTable orders={readyToLoadOrders} />
            </TabsContent>
            
            <TabsContent value="transit" className="pt-4">
              <OrdersTable orders={[...loadedOrders, ...inTransitOrders]} />
            </TabsContent>
            
            <TabsContent value="delivered" className="pt-4">
              <OrdersTable orders={deliveredOrders} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Loading Items Dialog */}
      <Dialog open={isLoadingDialogOpen} onOpenChange={setIsLoadingDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Load Items for Delivery</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Products Ready for Loading</h3>
                <span className="text-sm text-muted-foreground">
                  {loadedItems.reduce((total, item) => total + item.quantity, 0)} total items
                </span>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Adjust
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-muted/30 border border-dashed rounded-lg p-6">
              <Package className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">Scan additional items to add to the delivery</p>
              <div className="flex gap-2">
                <Input placeholder="Enter barcode or product ID" className="w-64" />
                <Button variant="outline">
                  <Camera size={16} className="mr-1" />
                  Scan
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLoadingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleClaimOrders}>
              Proceed to Claim Orders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Claim Orders Dialog */}
      <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Claim Orders for Delivery</DialogTitle>
            <DialogDescription>
              Select the orders you want to deliver based on your loaded items.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Available Orders</h3>
                <span className="text-sm text-muted-foreground">
                  {selectedOrders.length} of {claimableOrders.length} selected
                </span>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Order #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Delivery Time</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claimableOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No orders match your loaded items.
                        </TableCell>
                      </TableRow>
                    ) : (
                      claimableOrders.map((order) => (
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
                          <TableCell>{order.deliveryTime || 'Anytime'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {order.deliveryAddress}
                          </TableCell>
                          <TableCell className="text-right">{order.items.length}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Your Loaded Items</h3>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead className="text-right">Required</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadedItems.map((item) => {
                      // Calculate how many of this item are needed for the selected orders
                      let requiredQuantity = 0;
                      claimableOrders
                        .filter(order => selectedOrders.includes(order.id))
                        .forEach(order => {
                          const orderItem = order.items.find(oi => oi.productId === item.id);
                          if (orderItem) {
                            requiredQuantity += orderItem.quantity;
                          }
                        });
                      
                      const hasEnough = item.quantity >= requiredQuantity;
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            <span className={hasEnough ? 'text-green-600' : 'text-red-600'}>
                              {requiredQuantity}
                              {!hasEnough && requiredQuantity > 0 && (
                                <AlertCircle className="inline-block ml-1 h-4 w-4" />
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClaimDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmClaim}
              disabled={selectedOrders.length === 0}
            >
              Confirm Order Claims
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Route Details Sheet */}
      <Sheet open={isRouteDetailOpen} onOpenChange={setIsRouteDetailOpen}>
        <SheetContent className="w-[90%] sm:max-w-md md:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Delivery Route Details</SheetTitle>
          </SheetHeader>
          
          {selectedRoute && (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Route ID</h3>
                  <p className="font-medium">{selectedRoute.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p>{formatDate(selectedRoute.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Driver</h3>
                  <p>{selectedRoute.driverName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    selectedRoute.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    selectedRoute.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedRoute.status === 'completed' ? 'Completed' : 
                     selectedRoute.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Distance</h3>
                  <p>{selectedRoute.totalDistance} miles</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Est. Time</h3>
                  <p>{selectedRoute.estimatedTime} minutes</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Orders to Deliver</h3>
                  <Button variant="outline" size="sm">
                    <FileText size={14} className="mr-1" />
                    Print Invoices
                  </Button>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRoute.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.clientName}</TableCell>
                          <TableCell>{order.deliveryTime || 'Anytime'}</TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                          <TableCell className="text-right">
                            {order.status === 'loaded' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsDeliveryDialogOpen(true);
                                }}
                              >
                                Mark Delivered
                              </Button>
                            )}
                            {order.status === 'delivered' && (
                              <span className="text-sm text-green-600 flex items-center justify-end">
                                <Check size={14} className="mr-1" />
                                Delivered
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Delivery Route</h3>
                
                <div className="flex flex-col items-center justify-center bg-muted/30 border border-dashed rounded-lg p-8">
                  <MapPin className="h-16 w-16 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-4">Map view would be shown here</p>
                  <Button>
                    <Navigation size={16} className="mr-1" />
                    Navigate to Next Stop
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <SheetFooter className="mt-6">
            {selectedRoute && selectedRoute.status !== 'completed' && (
              <div className="flex justify-between w-full">
                <Button variant="outline">
                  <Clock size={16} className="mr-1" />
                  Update ETA
                </Button>
                
                <Button>
                  <Check size={16} className="mr-1" />
                  Complete Route
                </Button>
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Delivery Confirmation Dialog */}
      <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <p><strong>Order:</strong> {selectedOrder.id}</p>
                <p><strong>Client:</strong> {selectedOrder.clientName}</p>
                <p><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
                <p><strong>Contact:</strong> {selectedOrder.contactName} ({selectedOrder.contactPhone})</p>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-muted/30 border border-dashed rounded-lg p-6 mb-4">
                <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">Take a photo of the delivery</p>
                <Button variant="outline">
                  <Camera size={16} className="mr-1" /> Take Photo
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Notes (optional)</label>
                <Input placeholder="Add any notes about the delivery" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Signature</label>
                <div className="border rounded-md h-24 bg-muted/30 flex items-center justify-center text-muted-foreground">
                  Signature capture would appear here
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeliveryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkDelivered}>
              Confirm Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Delivery Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>{formatDate(order.dueDate)}</TableCell>
                <TableCell>{order.deliveryTime || 'Anytime'}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">{order.items.length}</TableCell>
                <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Delivery;
