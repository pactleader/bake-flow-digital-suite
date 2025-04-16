
import React from 'react';
import { Order } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OrderTableProps {
  orders: Order[];
  onViewOrder?: (order: Order) => void;
}

export function OrderTable({ orders, onViewOrder }: OrderTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>
                  {order.dueDate}
                  {order.deliveryTime && <div className="text-xs text-muted-foreground">{order.deliveryTime}</div>}
                </TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell><StatusBadge status={order.status} /></TableCell>
                <TableCell><StatusBadge status={order.paymentStatus} /></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewOrder?.(order)}>
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
