
import React from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  trend,
  change,
  icon,
  className
}: DashboardCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      {(trend || change !== undefined) && (
        <div className="mt-2 flex items-center text-sm">
          {trend === 'up' ? (
            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
          ) : trend === 'down' ? (
            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
          ) : (
            <Minus className="mr-1 h-4 w-4 text-gray-500" />
          )}
          <span
            className={cn(
              "font-medium",
              trend === 'up' ? "text-green-500" : 
              trend === 'down' ? "text-red-500" : 
              "text-gray-500"
            )}
          >
            {change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : 'No change'}
          </span>
          <span className="ml-1 text-muted-foreground">vs. last period</span>
        </div>
      )}
    </div>
  );
}
