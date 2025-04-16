
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Search, 
  Package, 
  Tag, 
  Check, 
  Box,
  Truck,
  ShoppingBag
} from 'lucide-react';
import { BakerProduction, OrderItemStatus } from '@/types';
import { formatDate } from '@/lib/utils';

// Mock data for baker productions that are ready for bagging
const mockProductions: BakerProduction[] = [
  {
    id: 'prod-1',
    productId: 'prod-1',
    productName: 'Sourdough Bread',
    quantity: 24,
    status: 'ready_for_delivery',
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    completedTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'John Baker'
  },
  {
    id: 'prod-2',
    productId: 'prod-2',
    productName: 'Croissants',
    quantity: 48,
    status: 'ready_for_delivery',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    completedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Sarah Cook'
  },
  {
    id: 'prod-3',
    productId: 'prod-3',
    productName: 'Baguette',
    quantity: 36,
    status: 'bagged',
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    completedTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'John Baker'
  },
  {
    id: 'prod-4',
    productId: 'prod-4',
    productName: 'Chocolate Cake',
    quantity: 10,
    status: 'labeled',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    completedTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Alice Pastry'
  }
];

const Bagging = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productions, setProductions] = useState<BakerProduction[]>(mockProductions);
  const [selectedProduction, setSelectedProduction] = useState<BakerProduction | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderItemStatus>('bagged');
  const [statusOptions, setStatusOptions] = useState<{value: OrderItemStatus, label: string}[]>([]);
  
  const readyForBaggingProductions = productions.filter(p => p.status === 'ready_for_delivery');
  const baggedProductions = productions.filter(p => p.status === 'bagged');
  const labeledProductions = productions.filter(p => p.status === 'labeled');
  const readyToShipProductions = productions.filter(p => p.status === 'ready_for_delivery' || p.status === 'bagged' || p.status === 'labeled');
  
  const filteredProductions = productions.filter(p => 
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = (production: BakerProduction) => {
    setSelectedProduction(production);
    
    // Determine which status options to show based on current status
    let options: {value: OrderItemStatus, label: string}[] = [];
    
    if (production.status === 'ready_for_delivery') {
      options = [{ value: 'bagged', label: 'Bagged' }];
      setNewStatus('bagged');
    } else if (production.status === 'bagged') {
      options = [{ value: 'labeled', label: 'Labeled' }];
      setNewStatus('labeled');
    } else if (production.status === 'labeled') {
      options = [{ value: 'ready_for_delivery', label: 'Ready to Ship' }];
      setNewStatus('ready_for_delivery');
    }
    
    setStatusOptions(options);
    setIsStatusDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (!selectedProduction) return;
    
    const updatedProductions = productions.map(p => {
      if (p.id === selectedProduction.id) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    
    setProductions(updatedProductions);
    setIsStatusDialogOpen(false);
    setSelectedProduction(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Bagging Department" 
          subtitle="Manage product packaging and labeling" 
        />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
              <Box className="h-10 w-10 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Ready for Bagging</h3>
                <p className="text-2xl font-bold">{readyForBaggingProductions.length}</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
              <Tag className="h-10 w-10 text-amber-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Need Labeling</h3>
                <p className="text-2xl font-bold">{baggedProductions.length}</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <ShoppingBag className="h-10 w-10 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Ready to Ship</h3>
                <p className="text-2xl font-bold">{labeledProductions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button variant="outline">
              <Truck size={16} className="mr-1" />
              View Delivery Schedule
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="ready">Ready for Bagging</TabsTrigger>
              <TabsTrigger value="bagged">Bagged</TabsTrigger>
              <TabsTrigger value="labeled">Labeled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <ProductTable 
                productions={filteredProductions.filter(p => 
                  ['ready_for_delivery', 'bagged', 'labeled'].includes(p.status)
                )} 
                onUpdateStatus={handleUpdateStatus} 
              />
            </TabsContent>
            
            <TabsContent value="ready" className="pt-4">
              <ProductTable 
                productions={readyForBaggingProductions} 
                onUpdateStatus={handleUpdateStatus} 
              />
            </TabsContent>
            
            <TabsContent value="bagged" className="pt-4">
              <ProductTable 
                productions={baggedProductions} 
                onUpdateStatus={handleUpdateStatus} 
              />
            </TabsContent>
            
            <TabsContent value="labeled" className="pt-4">
              <ProductTable 
                productions={labeledProductions} 
                onUpdateStatus={handleUpdateStatus} 
              />
            </TabsContent>
          </Tabs>
          
          {/* Update Status Dialog */}
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Status</DialogTitle>
              </DialogHeader>
              
              {selectedProduction && (
                <div className="py-4">
                  <p className="mb-2"><strong>Product:</strong> {selectedProduction.productName}</p>
                  <p className="mb-4"><strong>Quantity:</strong> {selectedProduction.quantity}</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Update Status To</label>
                      <Select value={newStatus} onValueChange={(value: OrderItemStatus) => setNewStatus(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes (optional)</label>
                      <Input placeholder="Add any special instructions or notes" />
                    </div>
                    
                    {newStatus === 'bagged' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-800">
                          This will mark the products as bagged and ready for labeling.
                        </p>
                      </div>
                    )}
                    
                    {newStatus === 'labeled' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                        <p className="text-sm text-amber-800">
                          This will mark the products as labeled and ready for shipping.
                        </p>
                      </div>
                    )}
                    
                    {newStatus === 'ready_for_delivery' && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-sm text-green-800">
                          This will mark the products as ready for delivery. They will appear in the delivery dashboard.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmStatusUpdate}>
                  Update Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

interface ProductTableProps {
  productions: BakerProduction[];
  onUpdateStatus: (production: BakerProduction) => void;
}

const ProductTable = ({ productions, onUpdateStatus }: ProductTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Baker</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            productions.map((production) => (
              <TableRow key={production.id}>
                <TableCell className="font-medium">{production.productName}</TableCell>
                <TableCell>{production.quantity}</TableCell>
                <TableCell>
                  <StatusBadge status={
                    production.status === 'ready_for_delivery' 
                      ? 'ready_for_delivery' 
                      : production.status
                  } />
                </TableCell>
                <TableCell>{production.completedTime ? formatDate(production.completedTime) : '—'}</TableCell>
                <TableCell>{production.assignedTo}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={
                      production.status === 'ready_for_delivery' 
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800' 
                        : production.status === 'bagged' 
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800' 
                        : 'bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800'
                    }
                    onClick={() => onUpdateStatus(production)}
                  >
                    {production.status === 'ready_for_delivery' && (
                      <>
                        <Package size={14} className="mr-1" />
                        Mark as Bagged
                      </>
                    )}
                    {production.status === 'bagged' && (
                      <>
                        <Tag size={14} className="mr-1" />
                        Mark as Labeled
                      </>
                    )}
                    {production.status === 'labeled' && (
                      <>
                        <Check size={14} className="mr-1" />
                        Mark Ready to Ship
                      </>
                    )}
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

export default Bagging;
