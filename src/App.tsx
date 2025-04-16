import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import PointOfSale from "./pages/PointOfSale";
import Orders from "./pages/Orders";
import Clients from "./pages/Clients";
import Inventory from "./pages/Inventory";
import Vendors from "./pages/Vendors";
import NotFound from "./pages/NotFound";
import Baker from "./pages/Baker";
import InventoryReceiving from "./pages/InventoryReceiving";
import Warehouse from "./pages/Warehouse";
import InventoryTransfers from "./pages/InventoryTransfers";
import Bagging from "./pages/Bagging";
import Delivery from "./pages/Delivery";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/pos" element={<PointOfSale />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/baker" element={<Baker />} />
          <Route path="/inventory-receiving" element={<InventoryReceiving />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/inventory-transfers" element={<InventoryTransfers />} />
          <Route path="/bagging" element={<Bagging />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
