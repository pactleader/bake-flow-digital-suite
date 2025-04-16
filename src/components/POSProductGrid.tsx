
import React from 'react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface POSProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  selectedCategory?: string;
}

export function POSProductGrid({ products, onSelectProduct, selectedCategory }: POSProductGridProps) {
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="pos-item"
          onClick={() => onSelectProduct(product)}
        >
          {product.imageUrl && (
            <div className="w-full h-24 overflow-hidden mb-2">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
          )}
          <h3 className="font-medium text-center">{product.name}</h3>
          <p className="font-bold text-center">{formatCurrency(product.salePrice)}</p>
        </div>
      ))}
      
      {filteredProducts.length === 0 && (
        <div className="col-span-full py-8 text-center text-muted-foreground">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
