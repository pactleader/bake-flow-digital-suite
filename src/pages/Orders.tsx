
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { OrderTable } from '@/components/OrderTable';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { Plus, Search } from 'lucide-react';
import { Order, TimeFilterOption } from '@/types';
import { sortedOrders, timeFilterOptions } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<string>('today');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = 
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    // This would normally be server-side filtered
    // For demo, we'll just filter from all orders based on the current date
    let matchesTimeFilter = true;
    const today = new Date();
    const orderDate = new Date(order.dueDate);
    
    switch(timeFilter) {
      case 'today':
        matchesTimeFilter = orderDate.toDateString() === today.toDateString();
        break;
      case '3days':
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(today.getDate() + 2); // +2 because today is included
        matchesTimeFilter = orderDate >= today && orderDate <= threeDaysLater;
        break;
      case 'week':
        const oneWeekLater = new Date(today);
        oneWeekLater.setDate(today.getDate() + 6); // +6 because today is included
        matchesTimeFilter = orderDate >= today && orderDate <= oneWeekLater;
        break;
      case 'month':
        const oneMonthLater = new Date(today);
        oneMonthLater.setMonth(today.getMonth() + 1);
        matchesTimeFilter = orderDate >= today && orderDate <= oneMonthLater;
        break;
    }
    
    return matchesSearch && matchesTimeFilter;
  });

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Orders" 
          subtitle="Manage your bakery orders" 
        />
        
        <main className="p-4 md:p-6">
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
              
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {timeFilterOptions.map((option: TimeFilterOption) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button>
              <Plus size={16} className="mr-1" />
              New Order
            </Button>
          </div>

          <OrderTable orders={filteredOrders} onViewOrder={viewOrder} />
          
          {/* Order Detail Dialog */}
          <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
            {selectedOrder && (
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-medium">Client Information</h3>
                    <p>{selectedOrder.clientName}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.contactName}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.contactPhone}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.deliveryAddress}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Order Details</h3>
                    <div className="grid grid-cols-2 gap-x-4 text-sm">
                      <p>Date:</p>
                      <p className="font-medium">{selectedOrder.orderDate}</p>
                      
                      <p>Due Date:</p>
                      <p className="font-medium">{selectedOrder.dueDate}</p>
                      
                      <p>Delivery Time:</p>
                      <p className="font-medium">{selectedOrder.deliveryTime || 'N/A'}</p>
                      
                      <p>Status:</p>
                      <p><StatusBadge status={selectedOrder.status} /></p>
                      
                      <p>Payment:</p>
                      <p><StatusBadge status={selectedOrder.paymentStatus} /></p>
                      
                      <p>Staff:</p>
                      <p className="font-medium">{selectedOrder.staffName || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="border rounded-md">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Qty</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Price</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Total</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.productId}>
                            <td className="px-4 py-2">{item.productName}</td>
                            <td className="px-4 py-2 text-right">{item.quantity}</td>
                            <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                            <td className="px-4 py-2 text-right">{formatCurrency(item.price * item.quantity)}</td>
                            <td className="px-4 py-2 text-right">
                              {item.status ? <StatusBadge status={item.status} /> : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-medium">
                          <td colSpan={3} className="px-4 py-2 text-right">Total</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(selectedOrder.total)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Close
                  </Button>
                  <Button>Update Status</Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Orders;
