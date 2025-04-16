
import { cn } from '@/lib/utils';
import { OrderStatus, PaymentStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    // Order statuses
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
    in_progress: { color: 'bg-purple-100 text-purple-800', label: 'In Progress' },
    baked: { color: 'bg-amber-100 text-amber-800', label: 'Baked' },
    ready_for_delivery: { color: 'bg-cyan-100 text-cyan-800', label: 'Ready for Delivery' },
    bagged: { color: 'bg-indigo-100 text-indigo-800', label: 'Bagged' },
    labeled: { color: 'bg-pink-100 text-pink-800', label: 'Labeled' },
    loaded: { color: 'bg-lime-100 text-lime-800', label: 'Loaded' },
    in_transit: { color: 'bg-orange-100 text-orange-800', label: 'In Transit' },
    delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    
    // Payment statuses
    paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
    charge_account: { color: 'bg-blue-100 text-blue-800', label: 'Charge Account' },
  };

  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

  return (
    <span className={cn('status-badge', config.color, className)}>
      {config.label}
    </span>
  );
}
