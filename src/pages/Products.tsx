
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { categories, products } from '@/data/mockData';
import { Product } from '@/types';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleEditProduct = (product: Product) => {
    console.log('Edit product:', product);
    // In a real app, this would open a product edit form/modal
  };
  
  const handleDeleteProduct = (product: Product) => {
    console.log('Delete product:', product);
    // In a real app, this would show a confirmation dialog and then delete the product
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Products" 
          subtitle="Manage your bakery products" 
        />
        
        <main className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 max-w-md relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button>
              <Plus size={16} className="mr-1" />
              Add Product
            </Button>
          </div>
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="flex-shrink-0"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No products found matching your criteria.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
