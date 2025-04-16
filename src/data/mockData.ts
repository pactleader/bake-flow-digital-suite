
import { Client, InventoryItem, Order, OrderStatus, PaymentStatus, Product, Vendor } from "../types";

export const products: Product[] = [
  {
    id: "p1",
    name: "Sourdough Bread",
    category: "Bread",
    salePrice: 8.99,
    costPrice: 2.15,
    imageUrl: "https://images.unsplash.com/photo-1586444248879-9a53458e44a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    recipe: [
      { inventoryItemId: "i1", name: "Flour", quantity: 500, unit: "g" },
      { inventoryItemId: "i2", name: "Water", quantity: 350, unit: "ml" },
      { inventoryItemId: "i5", name: "Salt", quantity: 10, unit: "g" },
      { inventoryItemId: "i9", name: "Sourdough Starter", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "p2",
    name: "Croissant",
    category: "Pastry",
    salePrice: 3.99,
    costPrice: 1.25,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    recipe: [
      { inventoryItemId: "i1", name: "Flour", quantity: 250, unit: "g" },
      { inventoryItemId: "i3", name: "Butter", quantity: 150, unit: "g" },
      { inventoryItemId: "i4", name: "Eggs", quantity: 1, unit: "unit" },
      { inventoryItemId: "i5", name: "Salt", quantity: 5, unit: "g" },
      { inventoryItemId: "i7", name: "Sugar", quantity: 25, unit: "g" },
      { inventoryItemId: "i8", name: "Yeast", quantity: 7, unit: "g" }
    ]
  },
  {
    id: "p3",
    name: "Chocolate Cake",
    category: "Cake",
    salePrice: 32.99,
    costPrice: 12.45,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    recipe: [
      { inventoryItemId: "i1", name: "Flour", quantity: 300, unit: "g" },
      { inventoryItemId: "i3", name: "Butter", quantity: 200, unit: "g" },
      { inventoryItemId: "i4", name: "Eggs", quantity: 4, unit: "unit" },
      { inventoryItemId: "i6", name: "Chocolate", quantity: 250, unit: "g" },
      { inventoryItemId: "i7", name: "Sugar", quantity: 200, unit: "g" }
    ]
  },
  {
    id: "p4",
    name: "Baguette",
    category: "Bread",
    salePrice: 4.99,
    costPrice: 1.05,
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    recipe: [
      { inventoryItemId: "i1", name: "Flour", quantity: 400, unit: "g" },
      { inventoryItemId: "i2", name: "Water", quantity: 280, unit: "ml" },
      { inventoryItemId: "i5", name: "Salt", quantity: 8, unit: "g" },
      { inventoryItemId: "i8", name: "Yeast", quantity: 5, unit: "g" }
    ]
  },
  {
    id: "p5",
    name: "Cinnamon Roll",
    category: "Pastry",
    salePrice: 4.50,
    costPrice: 1.35,
    imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    recipe: [
      { inventoryItemId: "i1", name: "Flour", quantity: 300, unit: "g" },
      { inventoryItemId: "i3", name: "Butter", quantity: 100, unit: "g" },
      { inventoryItemId: "i4", name: "Eggs", quantity: 1, unit: "unit" },
      { inventoryItemId: "i7", name: "Sugar", quantity: 150, unit: "g" },
      { inventoryItemId: "i10", name: "Cinnamon", quantity: 15, unit: "g" },
      { inventoryItemId: "i8", name: "Yeast", quantity: 7, unit: "g" }
    ]
  },
  {
    id: "p6",
    name: "Banana Bread",
    category: "Bread",
    salePrice: 12.99,
    costPrice: 4.25,
    imageUrl: "https://images.unsplash.com/photo-1605590316954-21e56f26ec5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    recipe: [
      { inventoryItemId: "i1", name: "Flour", quantity: 250, unit: "g" },
      { inventoryItemId: "i3", name: "Butter", quantity: 100, unit: "g" },
      { inventoryItemId: "i4", name: "Eggs", quantity: 2, unit: "unit" },
      { inventoryItemId: "i7", name: "Sugar", quantity: 150, unit: "g" },
      { inventoryItemId: "i11", name: "Bananas", quantity: 3, unit: "unit" }
    ]
  }
];

export const clients: Client[] = [
  {
    id: "c1",
    companyName: "Riverdale Cafe",
    contactName: "Alice Johnson",
    email: "alice@riverdalecafe.com",
    phone: "555-123-4567",
    address: "123 Main St, Riverdale, NY 10471",
    hasChargeAccount: true,
    arAmount: 1250.75,
    lastOrderDate: "2025-04-14",
    lifetimeValue: 15780.50
  },
  {
    id: "c2",
    companyName: "Green Market",
    contactName: "Bob Smith",
    email: "bob@greenmarket.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Brooklyn, NY 11201",
    hasChargeAccount: true,
    arAmount: 450.25,
    lastOrderDate: "2025-04-15",
    lifetimeValue: 22450.75
  },
  {
    id: "c3",
    companyName: "Central Hotel",
    contactName: "Carol Davis",
    email: "carol@centralhotel.com",
    phone: "555-555-5555",
    address: "789 Park Blvd, Manhattan, NY 10019",
    hasChargeAccount: false,
    lastOrderDate: "2025-04-10",
    lifetimeValue: 8975.25
  },
  {
    id: "c4",
    companyName: "Sunset Restaurant",
    contactName: "Dave Wilson",
    email: "dave@sunsetrestaurant.com",
    phone: "555-222-3333",
    address: "321 Beach Road, Queens, NY 11429",
    hasChargeAccount: true,
    arAmount: 875.00,
    lastOrderDate: "2025-04-12",
    lifetimeValue: 12340.00
  },
  {
    id: "c5",
    companyName: "City Grocery",
    contactName: "Eva Martin",
    email: "eva@citygrocery.com",
    phone: "555-444-9999",
    address: "654 Downtown Lane, Bronx, NY 10451",
    hasChargeAccount: false,
    lastOrderDate: "2025-04-08",
    lifetimeValue: 5680.50
  }
];

export const inventoryItems: InventoryItem[] = [
  {
    id: "i1",
    name: "All-Purpose Flour",
    category: "Dry Goods",
    currentStock: 240,
    unit: "kg",
    unitCost: 1.20,
    location: "Warehouse A3",
    preferredVendorId: "v1",
    preferredVendorName: "Premium Supplies",
    minimumStock: 100,
    onOrder: 150
  },
  {
    id: "i2",
    name: "Filtered Water",
    category: "Liquid",
    currentStock: 500,
    unit: "liter",
    unitCost: 0.05,
    location: "Bakery",
    minimumStock: 200
  },
  {
    id: "i3",
    name: "Unsalted Butter",
    category: "Dairy",
    currentStock: 85,
    unit: "kg",
    unitCost: 8.50,
    location: "Cold Storage B2",
    preferredVendorId: "v2",
    preferredVendorName: "Farm Fresh Dairy",
    minimumStock: 50,
    onOrder: 40
  },
  {
    id: "i4",
    name: "Eggs",
    category: "Dairy",
    currentStock: 360,
    unit: "dozen",
    unitCost: 3.25,
    location: "Cold Storage B1",
    preferredVendorId: "v2",
    preferredVendorName: "Farm Fresh Dairy",
    minimumStock: 120,
    onOrder: 60
  },
  {
    id: "i5",
    name: "Sea Salt",
    category: "Dry Goods",
    currentStock: 30,
    unit: "kg",
    unitCost: 2.10,
    location: "Warehouse A1",
    preferredVendorId: "v1",
    preferredVendorName: "Premium Supplies",
    minimumStock: 10
  },
  {
    id: "i6",
    name: "Dark Chocolate",
    category: "Chocolate",
    currentStock: 45,
    unit: "kg",
    unitCost: 12.75,
    location: "Warehouse A2",
    preferredVendorId: "v3",
    preferredVendorName: "Luxury Ingredients",
    minimumStock: 20,
    onOrder: 25
  },
  {
    id: "i7",
    name: "Granulated Sugar",
    category: "Dry Goods",
    currentStock: 180,
    unit: "kg",
    unitCost: 1.80,
    location: "Warehouse A1",
    preferredVendorId: "v1",
    preferredVendorName: "Premium Supplies",
    minimumStock: 75
  },
  {
    id: "i8",
    name: "Dry Yeast",
    category: "Dry Goods",
    currentStock: 8,
    unit: "kg",
    unitCost: 15.50,
    location: "Warehouse A4",
    preferredVendorId: "v1",
    preferredVendorName: "Premium Supplies",
    minimumStock: 5,
    onOrder: 5
  },
  {
    id: "i9",
    name: "Sourdough Starter",
    category: "Prepared",
    currentStock: 25,
    unit: "kg",
    unitCost: 3.00,
    location: "Bakery",
    minimumStock: 10
  },
  {
    id: "i10",
    name: "Ground Cinnamon",
    category: "Spices",
    currentStock: 6,
    unit: "kg",
    unitCost: 18.25,
    location: "Warehouse A2",
    preferredVendorId: "v3",
    preferredVendorName: "Luxury Ingredients",
    minimumStock: 3
  },
  {
    id: "i11",
    name: "Bananas",
    category: "Fruit",
    currentStock: 50,
    unit: "kg",
    unitCost: 2.25,
    location: "Cold Storage B3",
    preferredVendorId: "v4",
    preferredVendorName: "Fresh Produce Co.",
    minimumStock: 20
  }
];

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Premium Supplies",
    contactName: "John Premium",
    email: "john@premiumsupplies.com",
    phone: "555-111-2222",
    address: "100 Industrial Pkwy, Jersey City, NJ 07302",
    categories: ["Flour", "Sugar", "Salt", "Yeast", "Dry Goods"],
    avgShippingTime: 2,
    items: [
      {
        inventoryItemId: "i1",
        name: "All-Purpose Flour",
        price: 1.20,
        unit: "kg",
        isPreferred: true
      },
      {
        inventoryItemId: "i5",
        name: "Sea Salt",
        price: 2.10,
        unit: "kg",
        isPreferred: true
      },
      {
        inventoryItemId: "i7",
        name: "Granulated Sugar",
        price: 1.80,
        unit: "kg",
        isPreferred: true
      },
      {
        inventoryItemId: "i8",
        name: "Dry Yeast",
        price: 15.50,
        unit: "kg",
        isPreferred: true
      }
    ]
  },
  {
    id: "v2",
    name: "Farm Fresh Dairy",
    contactName: "Lisa Farmer",
    email: "lisa@farmfreshdairy.com",
    phone: "555-333-4444",
    address: "240 Rural Route, Upstate, NY 12345",
    categories: ["Butter", "Eggs", "Milk", "Cream", "Dairy"],
    avgShippingTime: 1,
    items: [
      {
        inventoryItemId: "i3",
        name: "Unsalted Butter",
        price: 8.50,
        unit: "kg",
        isPreferred: true
      },
      {
        inventoryItemId: "i4",
        name: "Eggs",
        price: 3.25,
        unit: "dozen",
        isPreferred: true
      }
    ]
  },
  {
    id: "v3",
    name: "Luxury Ingredients",
    contactName: "Marcus Luxury",
    email: "marcus@luxuryingredients.com",
    phone: "555-777-8888",
    address: "500 Gourmet Blvd, Manhattan, NY 10022",
    categories: ["Chocolate", "Vanilla", "Spices", "Nuts"],
    avgShippingTime: 3,
    items: [
      {
        inventoryItemId: "i6",
        name: "Dark Chocolate",
        price: 12.75,
        unit: "kg",
        isPreferred: true
      },
      {
        inventoryItemId: "i10",
        name: "Ground Cinnamon",
        price: 18.25,
        unit: "kg",
        isPreferred: true
      }
    ]
  },
  {
    id: "v4",
    name: "Fresh Produce Co.",
    contactName: "Paula Produce",
    email: "paula@freshproduce.com",
    phone: "555-999-0000",
    address: "350 Market Street, Brooklyn, NY 11217",
    categories: ["Fruits", "Berries", "Fresh Produce"],
    avgShippingTime: 1,
    items: [
      {
        inventoryItemId: "i11",
        name: "Bananas",
        price: 2.25,
        unit: "kg",
        isPreferred: true
      }
    ]
  }
];

const todayDate = new Date().toISOString().split('T')[0];
const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

const getRandomStatus = (): OrderStatus => {
  const statuses: OrderStatus[] = ['pending', 'confirmed', 'in_progress', 'baked', 'ready_for_delivery', 'bagged', 'labeled', 'loaded', 'in_transit', 'delivered'];
  return statuses[Math.floor(Math.random() * (statuses.length - 2))]; // Exclude delivered more often
};

const getRandomPayment = (): PaymentStatus => {
  const payments: PaymentStatus[] = ['paid', 'charge_account', 'pending'];
  return payments[Math.floor(Math.random() * payments.length)];
};

export const orders: Order[] = [
  {
    id: "o1",
    clientId: "c1",
    clientName: "Riverdale Cafe",
    orderDate: yesterdayDate,
    dueDate: todayDate,
    deliveryTime: "10:30 AM",
    status: "delivered",
    paymentStatus: "charge_account",
    contactPhone: "555-123-4567",
    contactName: "Alice Johnson",
    deliveryAddress: "123 Main St, Riverdale, NY 10471",
    staffName: "Mike Handler",
    items: [
      { productId: "p1", productName: "Sourdough Bread", quantity: 10, price: 8.99, status: "delivered" },
      { productId: "p4", productName: "Baguette", quantity: 15, price: 4.99, status: "delivered" }
    ],
    total: 89.90 + 74.85
  },
  {
    id: "o2",
    clientId: "c2",
    clientName: "Green Market",
    orderDate: yesterdayDate,
    dueDate: todayDate,
    deliveryTime: "08:00 AM",
    status: "in_transit",
    paymentStatus: "charge_account",
    contactPhone: "555-987-6543",
    contactName: "Bob Smith",
    deliveryAddress: "456 Oak Ave, Brooklyn, NY 11201",
    staffName: "Sarah Taker",
    items: [
      { productId: "p1", productName: "Sourdough Bread", quantity: 20, price: 8.99, status: "loaded" },
      { productId: "p2", productName: "Croissant", quantity: 30, price: 3.99, status: "loaded" },
      { productId: "p5", productName: "Cinnamon Roll", quantity: 15, price: 4.50, status: "loaded" }
    ],
    total: 179.80 + 119.70 + 67.50
  },
  {
    id: "o3",
    clientId: "c4",
    clientName: "Sunset Restaurant",
    orderDate: twoDaysAgo,
    dueDate: todayDate,
    deliveryTime: "14:00 PM",
    status: "bagged",
    paymentStatus: "paid",
    contactPhone: "555-222-3333",
    contactName: "Dave Wilson",
    deliveryAddress: "321 Beach Road, Queens, NY 11429",
    staffName: "Tom Booker",
    items: [
      { productId: "p4", productName: "Baguette", quantity: 25, price: 4.99, status: "bagged" },
      { productId: "p3", productName: "Chocolate Cake", quantity: 2, price: 32.99, status: "bagged" }
    ],
    total: 124.75 + 65.98
  },
  {
    id: "o4",
    clientId: "c5",
    clientName: "City Grocery",
    orderDate: todayDate,
    dueDate: nextWeek,
    deliveryTime: "09:30 AM",
    status: "confirmed",
    paymentStatus: "pending",
    contactPhone: "555-444-9999",
    contactName: "Eva Martin",
    deliveryAddress: "654 Downtown Lane, Bronx, NY 10451",
    staffName: "James Seller",
    items: [
      { productId: "p6", productName: "Banana Bread", quantity: 8, price: 12.99, status: "pending" },
      { productId: "p5", productName: "Cinnamon Roll", quantity: 20, price: 4.50, status: "pending" }
    ],
    total: 103.92 + 90.00
  },
  {
    id: "o5",
    clientId: "c3",
    clientName: "Central Hotel",
    orderDate: todayDate,
    dueDate: todayDate,
    deliveryTime: "16:00 PM",
    status: "in_progress",
    paymentStatus: "paid",
    contactPhone: "555-555-5555",
    contactName: "Carol Davis",
    deliveryAddress: "789 Park Blvd, Manhattan, NY 10019",
    staffName: "Lisa Order",
    items: [
      { productId: "p2", productName: "Croissant", quantity: 50, price: 3.99, status: "in_progress" },
      { productId: "p3", productName: "Chocolate Cake", quantity: 5, price: 32.99, status: "in_progress" }
    ],
    total: 199.50 + 164.95
  }
];

// Generate more orders for realistic data
for (let i = 6; i <= 20; i++) {
  const clientIndex = Math.floor(Math.random() * clients.length);
  const client = clients[clientIndex];
  const orderDate = new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000).toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + Math.floor(Math.random() * 7) * 86400000).toISOString().split('T')[0];
  
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items = [];
  let total = 0;
  
  for (let j = 0; j < numItems; j++) {
    const productIndex = Math.floor(Math.random() * products.length);
    const product = products[productIndex];
    const quantity = Math.floor(Math.random() * 20) + 5;
    const itemTotal = product.salePrice * quantity;
    total += itemTotal;
    
    items.push({
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.salePrice,
      status: getRandomStatus()
    });
  }
  
  orders.push({
    id: `o${i}`,
    clientId: client.id,
    clientName: client.companyName,
    orderDate,
    dueDate,
    deliveryTime: `${Math.floor(Math.random() * 12) + 8}:${Math.random() < 0.5 ? '00' : '30'} ${Math.random() < 0.7 ? 'AM' : 'PM'}`,
    status: getRandomStatus(),
    paymentStatus: getRandomPayment(),
    contactPhone: client.phone,
    contactName: client.contactName,
    deliveryAddress: client.address,
    staffName: ["Mike Handler", "Sarah Taker", "Tom Booker", "James Seller", "Lisa Order"][Math.floor(Math.random() * 5)],
    items,
    total
  });
}

// Sort orders by date
export const sortedOrders = [...orders].sort((a, b) => {
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
});

// Calculate stats
export const productStats = {
  totalProducts: products.length,
  totalCategories: [...new Set(products.map(p => p.category))].length,
  averagePrice: products.reduce((sum, p) => sum + p.salePrice, 0) / products.length,
  topSellingProducts: products.slice(0, 5)
};

export const orderStats = {
  totalOrders: orders.length,
  pendingOrders: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
  todaysOrders: orders.filter(o => o.dueDate === todayDate).length,
  todaysRevenue: orders
    .filter(o => o.dueDate === todayDate)
    .reduce((sum, o) => sum + o.total, 0)
};

export const inventoryStats = {
  totalItems: inventoryItems.length,
  lowStockItems: inventoryItems.filter(i => i.currentStock < (i.minimumStock || 0)).length,
  totalValue: inventoryItems.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0),
  onOrderValue: inventoryItems.reduce((sum, i) => sum + (i.onOrder || 0) * i.unitCost, 0)
};

export const clientStats = {
  totalClients: clients.length,
  totalAR: clients.reduce((sum, c) => sum + (c.arAmount || 0), 0),
  newClientsThisMonth: 2,
  totalRevenue: orders.reduce((sum, o) => sum + o.total, 0)
};

export const categories = [
  "Bread",
  "Pastry",
  "Cake",
  "Cookies",
  "Desserts",
  "Savory",
  "Drinks"
];

export const timeFilterOptions = [
  { label: "Today", value: "today" },
  { label: "3 Days", value: "3days" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" }
];
