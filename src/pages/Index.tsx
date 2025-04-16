
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DashboardCard } from '@/components/DashboardCard';
import { OrderTable } from '@/components/OrderTable';
import { InventoryTable } from '@/components/InventoryTable';
import { 
  BarChart, 
  Calendar, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  clientStats, 
  inventoryItems, 
  inventoryStats, 
  orderStats, 
  productStats, 
  sortedOrders
} from '@/data/mockData';

const Index = () => {
  const todayOrders = sortedOrders.filter(o => {
    const today = new Date().toISOString().split('T')[0];
    return o.dueDate === today;
  });

  const lowStockItems = inventoryItems.filter(i => i.minimumStock && i.currentStock < i.minimumStock);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Dashboard" 
          subtitle="Welcome to BakeFlow Digital Suite" 
        />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Today's Orders"
              value={orderStats.todaysOrders}
              icon={<Calendar size={20} />}
              trend="up"
              change={8}
            />
            <DashboardCard
              title="Today's Revenue"
              value={formatCurrency(orderStats.todaysRevenue)}
              icon={<DollarSign size={20} />}
              trend="up"
              change={12}
            />
            <DashboardCard
              title="Pending Orders"
              value={orderStats.pendingOrders}
              icon={<ShoppingCart size={20} />}
            />
            <DashboardCard
              title="Low Stock Items"
              value={inventoryStats.lowStockItems}
              icon={<Package size={20} />}
              trend={inventoryStats.lowStockItems > 3 ? "up" : "neutral"}
              change={inventoryStats.lowStockItems > 3 ? 15 : 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Today's Orders</h2>
              <OrderTable orders={todayOrders} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Low Stock Inventory</h2>
              <InventoryTable items={lowStockItems} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <DashboardCard
              title="Total Products"
              value={productStats.totalProducts}
              icon={<Package size={20} />}
              className="lg:col-span-1"
            />
            <DashboardCard
              title="Total Clients"
              value={clientStats.totalClients}
              icon={<Users size={20} />}
              className="lg:col-span-1"
            />
            <DashboardCard
              title="Total Vendors"
              value={4}
              icon={<Truck size={20} />}
              className="lg:col-span-1"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
