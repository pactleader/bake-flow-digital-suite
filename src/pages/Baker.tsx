
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
  Plus, 
  Search, 
  ChefHat,
  Clock,
  Cake,
  Check,
  ClipboardList
} from 'lucide-react';
import { BakerProduction, Product, OrderItemStatus } from '@/types';
import { formatDate } from '@/lib/utils';

// Mock data for baker production
const mockProducts: Product[] = [
  { id: 'prod-1', name: 'Sourdough Bread', category: 'Bread', salePrice: 6.99, costPrice: 2.50 },
  { id: 'prod-2', name: 'Croissant', category: 'Pastry', salePrice: 3.99, costPrice: 1.25 },
  { id: 'prod-3', name: 'Baguette', category: 'Bread', salePrice: 4.99, costPrice: 1.75 },
  { id: 'prod-4', name: 'Cinnamon Roll', category: 'Pastry', salePrice: 3.49, costPrice: 1.00 },
  { id: 'prod-5', name: 'Chocolate Cake', category: 'Cake', salePrice: 24.99, costPrice: 8.50 },
];

const mockProduction: BakerProduction[] = [
  {
    id: 'prod-1',
    productId: 'prod-1',
    productName: 'Sourdough Bread',
    quantity: 24,
    status: 'in_progress',
    startTime: new Date().toISOString(),
    assignedTo: 'John Baker'
  },
  {
    id: 'prod-2',
    productId: 'prod-2',
    productName: 'Croissant',
    quantity: 48,
    status: 'baked',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    completedTime: new Date().toISOString(),
    assignedTo: 'Sarah Cook'
  },
  {
    id: 'prod-3',
    productId: 'prod-3',
    productName: 'Baguette',
    quantity: 36,
    status: 'ready_for_delivery',
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    completedTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    assignedTo: 'John Baker'
  }
];

const Baker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productions, setProductions] = useState<BakerProduction[]>(mockProduction);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<BakerProduction | null>(null);
  
  // Form states for new production
  const [newProductId, setNewProductId] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);
  const [newAssignedTo, setNewAssignedTo] = useState('');

  const inProgressProductions = productions.filter(p => p.status === 'in_progress');
  const bakedProductions = productions.filter(p => p.status === 'baked');
  const readyProductions = productions.filter(p => p.status === 'ready_for_delivery');
  
  const filteredProductions = productions.filter(p => 
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduction = () => {
    const selectedProduct = mockProducts.find(p => p.id === newProductId);
    if (!selectedProduct) return;
    
    const newProduction: BakerProduction = {
      id: `prod-${Date.now()}`,
      productId: newProductId,
      productName: selectedProduct.name,
      quantity: newQuantity,
      status: 'in_progress',
      startTime: new Date().toISOString(),
      assignedTo: newAssignedTo,
    };
    
    setProductions([...productions, newProduction]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewProductId('');
    setNewQuantity(0);
    setNewAssignedTo('');
  };

  const handleUpdateStatus = (newStatus: OrderItemStatus) => {
    if (!selectedProduction) return;
    
    const updatedProductions = productions.map(p => {
      if (p.id === selectedProduction.id) {
        return {
          ...p,
          status: newStatus,
          completedTime: newStatus !== 'in_progress' ? new Date().toISOString() : p.completedTime,
        };
      }
      return p;
    });
    
    setProductions(updatedProductions);
    setIsUpdateDialogOpen(false);
    setSelectedProduction(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Baker Dashboard" 
          subtitle="Manage baking production" 
        />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
              <ChefHat className="h-10 w-10 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">In Progress</h3>
                <p className="text-2xl font-bold">{inProgressProductions.length} batches</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
              <Cake className="h-10 w-10 text-amber-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Freshly Baked</h3>
                <p className="text-2xl font-bold">{bakedProductions.length} batches</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <ClipboardList className="h-10 w-10 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-lg">Ready for Delivery</h3>
                <p className="text-2xl font-bold">{readyProductions.length} batches</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search production batches..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus size={16} className="mr-1" />
              New Production Batch
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Batches</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="baked">Baked</TabsTrigger>
              <TabsTrigger value="ready">Ready for Delivery</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <ProductionTable 
                productions={filteredProductions} 
                onUpdateStatus={(production) => {
                  setSelectedProduction(production);
                  setIsUpdateDialogOpen(true);
                }} 
              />
            </TabsContent>
            
            <TabsContent value="in-progress" className="pt-4">
              <ProductionTable 
                productions={inProgressProductions} 
                onUpdateStatus={(production) => {
                  setSelectedProduction(production);
                  setIsUpdateDialogOpen(true);
                }} 
              />
            </TabsContent>
            
            <TabsContent value="baked" className="pt-4">
              <ProductionTable 
                productions={bakedProductions} 
                onUpdateStatus={(production) => {
                  setSelectedProduction(production);
                  setIsUpdateDialogOpen(true);
                }} 
              />
            </TabsContent>
            
            <TabsContent value="ready" className="pt-4">
              <ProductionTable 
                productions={readyProductions} 
                onUpdateStatus={(production) => {
                  setSelectedProduction(production);
                  setIsUpdateDialogOpen(true);
                }} 
              />
            </TabsContent>
          </Tabs>
          
          {/* Add Production Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Production Batch</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Select value={newProductId} onValueChange={setNewProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={newQuantity || ''}
                    onChange={(e) => setNewQuantity(Number(e.target.value))} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned To</label>
                  <Input 
                    value={newAssignedTo}
                    onChange={(e) => setNewAssignedTo(e.target.value)} 
                    placeholder="Baker name" 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddProduction} 
                  disabled={!newProductId || newQuantity <= 0 || !newAssignedTo}
                >
                  Start Production
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Update Status Dialog */}
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Production Status</DialogTitle>
              </DialogHeader>
              
              {selectedProduction && (
                <div className="py-4">
                  <p className="mb-2"><strong>Product:</strong> {selectedProduction.productName}</p>
                  <p className="mb-4"><strong>Quantity:</strong> {selectedProduction.quantity}</p>
                  
                  <h3 className="font-medium mb-2">Update Status To:</h3>
                  <div className="flex flex-col gap-2">
                    {selectedProduction.status !== 'in_progress' && (
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleUpdateStatus('in_progress')}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        In Progress
                      </Button>
                    )}
                    
                    {selectedProduction.status !== 'baked' && (
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleUpdateStatus('baked')}
                      >
                        <Cake className="mr-2 h-4 w-4" />
                        Baked
                      </Button>
                    )}
                    
                    {selectedProduction.status !== 'ready_for_delivery' && (
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleUpdateStatus('ready_for_delivery')}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Ready for Delivery
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

interface ProductionTableProps {
  productions: BakerProduction[];
  onUpdateStatus: (production: BakerProduction) => void;
}

const ProductionTable = ({ productions, onUpdateStatus }: ProductionTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Baker</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No production batches found.
              </TableCell>
            </TableRow>
          ) : (
            productions.map((production) => (
              <TableRow key={production.id}>
                <TableCell className="font-medium">{production.productName}</TableCell>
                <TableCell>{production.quantity}</TableCell>
                <TableCell><StatusBadge status={production.status} /></TableCell>
                <TableCell>{formatDate(production.startTime)}</TableCell>
                <TableCell>{production.completedTime ? formatDate(production.completedTime) : '—'}</TableCell>
                <TableCell>{production.assignedTo}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(production)}>
                    Update Status
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

export default Baker;
