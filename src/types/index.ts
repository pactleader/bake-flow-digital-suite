
export interface Product {
  id: string;
  name: string;
  category: string;
  salePrice: number;
  costPrice: number;
  imageUrl?: string;
  recipe?: RecipeItem[];
  description?: string;
  sku?: string;
}

export interface RecipeItem {
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  orderDate: string;
  dueDate: string;
  deliveryTime?: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  paymentStatus: PaymentStatus;
  contactPhone?: string;
  contactName?: string;
  deliveryAddress?: string;
  staffName?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'baked' | 'ready_for_delivery' | 'bagged' | 'labeled' | 'loaded' | 'in_transit' | 'delivered' | 'cancelled';

export type PaymentStatus = 'paid' | 'charge_account' | 'pending';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  status?: OrderItemStatus;
}

export type OrderItemStatus = 'pending' | 'in_progress' | 'baked' | 'ready_for_delivery' | 'bagged' | 'labeled' | 'loaded' | 'delivered';

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  hasChargeAccount: boolean;
  arAmount?: number;
  lastOrderDate?: string;
  lifetimeValue?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string; 
  unitCost: number;
  location: string;
  preferredVendorId?: string;
  preferredVendorName?: string;
  minimumStock?: number;
  onOrder?: number;
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  avgShippingTime?: number;
  items: VendorItem[];
}

export interface VendorItem {
  inventoryItemId: string;
  name: string;
  price: number;
  unit: string;
  isPreferred: boolean;
}

export interface DashboardStat {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface TimeFilterOption {
  label: string;
  value: string;
}
