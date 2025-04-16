
import React from 'react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const profit = product.salePrice - product.costPrice;
  const profitMargin = (profit / product.salePrice) * 100;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        {product.imageUrl && (
          <div className="aspect-[4/3] relative overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <div className="text-right">
            <div className="font-bold">{formatCurrency(product.salePrice)}</div>
            <div className="text-xs text-muted-foreground">
              Cost: {formatCurrency(product.costPrice)}
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-medium">Profit:</span>
          <span className={`text-sm font-bold ${profitMargin >= 30 ? 'text-green-600' : profitMargin >= 15 ? 'text-amber-600' : 'text-red-600'}`}>
            {formatCurrency(profit)} ({profitMargin.toFixed(1)}%)
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t p-2 flex justify-end gap-2 bg-muted/30">
        {onEdit && (
          <Button onClick={() => onEdit(product)} size="sm" variant="ghost">
            <Edit size={16} className="mr-1" /> Edit
          </Button>
        )}
        {onDelete && (
          <Button onClick={() => onDelete(product)} size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
            <Trash size={16} className="mr-1" /> Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
