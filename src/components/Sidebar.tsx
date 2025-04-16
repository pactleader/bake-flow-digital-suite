
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
  Box, 
  ClipboardList, 
  ChevronsLeft, 
  ChevronsRight,
  Settings,
  Home,
  Warehouse,
  ShoppingBag,
  Utensils
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const sidebarItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/pos', label: 'Point of Sale', icon: <ShoppingCart size={20} /> },
    { path: '/orders', label: 'Orders', icon: <ClipboardList size={20} /> },
    { path: '/products', label: 'Products', icon: <Package size={20} /> },
    { path: '/inventory', label: 'Inventory', icon: <Box size={20} /> },
    { path: '/vendors', label: 'Vendors', icon: <Truck size={20} /> },
    { path: '/clients', label: 'Clients', icon: <Users size={20} /> },
    { path: '/baker', label: 'Baker', icon: <Utensils size={20} /> },
    { path: '/warehouse', label: 'Warehouse', icon: <Warehouse size={20} /> },
    { path: '/delivery', label: 'Delivery', icon: <ShoppingBag size={20} /> },
    { path: '/reports', label: 'Reports', icon: <BarChart size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div
      className={cn(
        'h-screen flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[250px]',
        className
      )}
    >
      <div className={cn('flex items-center p-4 border-b border-sidebar-border gap-3', 
        collapsed ? 'justify-center' : 'justify-start')}>
        <div className="rounded-full bg-sidebar-foreground text-sidebar-background w-10 h-10 flex items-center justify-center font-bold text-lg">
          BF
        </div>
        {!collapsed && <h1 className="text-xl font-semibold">BakeFlow</h1>}
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-1">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 hover:bg-sidebar-accent text-sm font-medium transition-colors',
                  isActive(item.path) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : '',
                  collapsed ? 'justify-center' : 'justify-start'
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>
    </div>
  );
}
