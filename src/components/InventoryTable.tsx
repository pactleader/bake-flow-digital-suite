
import React from 'react';
import { InventoryItem } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertCircle, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface InventoryTableProps {
  items: InventoryItem[];
  onEditItem?: (item: InventoryItem) => void;
}

export function InventoryTable({ items, onEditItem }: InventoryTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Unit Cost</TableHead>
            <TableHead>Total Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No inventory items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const isLowStock = item.minimumStock && item.currentStock < item.minimumStock;
              const totalValue = item.currentStock * item.unitCost;
              
              return (
                <TableRow key={item.id} className={isLowStock ? "bg-red-50" : undefined}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {isLowStock && <AlertCircle size={16} className="text-red-500 mr-1" />}
                      <span>{item.currentStock} {item.unit}</span>
                    </div>
                    {item.onOrder && <span className="text-xs text-muted-foreground block">On order: {item.onOrder} {item.unit}</span>}
                  </TableCell>
                  <TableCell>{formatCurrency(item.unitCost)}/{item.unit}</TableCell>
                  <TableCell>{formatCurrency(totalValue)}</TableCell>
                  <TableCell>
                    {isLowStock ? (
                      <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                        In Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEditItem?.(item)}>
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
