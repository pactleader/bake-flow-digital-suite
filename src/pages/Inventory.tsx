
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { InventoryTable } from '@/components/InventoryTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  AlertCircle,
  Package,
  DollarSign,
  TrendingDown,
  ShoppingCart
} from 'lucide-react';
import { inventoryItems, inventoryStats } from '@/data/mockData';
import { InventoryItem } from '@/types';
import { DashboardCard } from '@/components/DashboardCard';
import { formatCurrency } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const allItems = inventoryItems;
  const lowStockItems = inventoryItems.filter(
    item => item.minimumStock && item.currentStock < item.minimumStock
  );
  const onOrderItems = inventoryItems.filter(item => item.onOrder && item.onOrder > 0);

  const filteredItems = allItems.filter(item => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preferredVendorName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    // In a real app, this would open an item edit form
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Inventory" 
          subtitle="Manage your bakery inventory" 
        />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardCard
              title="Total Inventory Items"
              value={inventoryStats.totalItems}
              icon={<Package size={20} />}
            />
            <DashboardCard
              title="Inventory Value"
              value={formatCurrency(inventoryStats.totalValue)}
              icon={<DollarSign size={20} />}
            />
            <DashboardCard
              title="Low Stock Items"
              value={inventoryStats.lowStockItems}
              icon={<TrendingDown size={20} />}
              trend={inventoryStats.lowStockItems > 0 ? "up" : "neutral"}
            />
            <DashboardCard
              title="On Order Value"
              value={formatCurrency(inventoryStats.onOrderValue)}
              icon={<ShoppingCart size={20} />}
            />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button>
              <Plus size={16} className="mr-1" />
              Add Item
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="low-stock" className="flex items-center">
                Low Stock
                {lowStockItems.length > 0 && (
                  <span className="ml-1.5 py-0.5 px-2 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {lowStockItems.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="on-order">On Order</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <InventoryTable items={searchTerm ? filteredItems : allItems} onEditItem={handleEditItem} />
            </TabsContent>
            
            <TabsContent value="low-stock" className="pt-4">
              {lowStockItems.length > 0 ? (
                <div>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span>
                      <strong>{lowStockItems.length}</strong> items are below minimum stock levels and need to be reordered.
                    </span>
                  </div>
                  <InventoryTable items={lowStockItems} onEditItem={handleEditItem} />
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No items are below minimum stock levels.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="on-order" className="pt-4">
              {onOrderItems.length > 0 ? (
                <InventoryTable items={onOrderItems} onEditItem={handleEditItem} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No items are currently on order.
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Item Detail Dialog */}
          <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
            {selectedItem && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Inventory Item</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input value={selectedItem.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input value={selectedItem.category} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Stock</label>
                    <Input type="number" value={selectedItem.currentStock} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Unit</label>
                    <Input value={selectedItem.unit} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Unit Cost</label>
                    <Input type="number" value={selectedItem.unitCost} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input value={selectedItem.location} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Stock</label>
                    <Input type="number" value={selectedItem.minimumStock || 0} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">On Order</label>
                    <Input type="number" value={selectedItem.onOrder || 0} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Preferred Vendor</label>
                    <Input value={selectedItem.preferredVendorName || 'None'} />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setSelectedItem(null)}>
                    Cancel
                  </Button>
                  <Button>Save Changes</Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
