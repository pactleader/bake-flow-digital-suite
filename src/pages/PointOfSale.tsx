
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { POSProductGrid } from '@/components/POSProductGrid';
import { categories, products } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, MinusCircle, PlusCircle, Receipt, Trash, User } from 'lucide-react';
import { Product } from '@/types';
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  product: Product;
  quantity: number;
}

const PointOfSale = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'charge'>('cash');
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
  const tax = subtotal * 0.0825; // 8.25% tax rate
  const total = subtotal + tax;

  const processPayment = () => {
    toast({
      title: "Payment Successful",
      description: `Total: ${formatCurrency(total)} - Payment method: ${paymentMethod}`,
    });
    clearCart();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex">
        {/* Product selection area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b p-4 flex flex-wrap gap-2">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              onClick={() => setSelectedCategory(undefined)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <ScrollArea className="p-4 flex-1">
            <POSProductGrid 
              products={products}
              selectedCategory={selectedCategory} 
              onSelectProduct={addToCart}
            />
          </ScrollArea>
        </div>
        
        {/* Order summary and checkout */}
        <div className="w-full max-w-md border-l flex flex-col bg-white">
          <div className="bg-primary text-primary-foreground p-4">
            <h2 className="text-xl font-bold">Current Order</h2>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No items in cart
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center">
                    <div className="flex-1">
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.product.salePrice)} each
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => updateQuantity(item.product.id, -1)}
                      >
                        <MinusCircle size={16} />
                      </Button>
                      
                      <Input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 0) {
                            const delta = value - item.quantity;
                            updateQuantity(item.product.id, delta);
                          }
                        }}
                        className="w-16 text-center"
                      />
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => updateQuantity(item.product.id, 1)}
                      >
                        <PlusCircle size={16} />
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                    
                    <div className="w-24 text-right">
                      {formatCurrency(item.product.salePrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (8.25%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="cash">Cash</TabsTrigger>
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="charge">Charge</TabsTrigger>
              </TabsList>
              
              <TabsContent value="charge">
                <div className="mb-4">
                  <label className="block text-sm mb-1">Select Client Account</label>
                  <div className="flex gap-2">
                    <Input placeholder="Search clients..." className="flex-1" />
                    <Button variant="outline" size="icon">
                      <User size={16} />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
                Clear
              </Button>
              <Button 
                onClick={processPayment} 
                disabled={cart.length === 0}
              >
                {paymentMethod === 'card' ? (
                  <><CreditCard size={16} className="mr-1" /> Pay with Card</>
                ) : paymentMethod === 'charge' ? (
                  <><User size={16} className="mr-1" /> Charge Account</>
                ) : (
                  <><Receipt size={16} className="mr-1" /> Pay with Cash</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointOfSale;
