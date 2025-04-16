
import React from 'react';
import { Client } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Calendar, Phone, Mail, MapPin, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
  openOrdersCount?: number;
  onViewClient?: (client: Client) => void;
  onSendOrderForm?: (client: Client) => void;
}

export function ClientCard({ client, openOrdersCount = 0, onViewClient, onSendOrderForm }: ClientCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="mb-2">
            <h3 className="font-semibold text-lg">{client.companyName}</h3>
            <p className="text-sm text-muted-foreground">{client.contactName}</p>
          </div>
          
          <div className="space-y-2 text-sm flex-1">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="truncate">{client.email}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0 mt-1" />
              <span className="line-clamp-2">{client.address}</span>
            </div>
            
            {client.lastOrderDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Last order: {client.lastOrderDate}</span>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Open Orders</div>
              <div className="font-semibold">{openOrdersCount}</div>
            </div>
            {client.hasChargeAccount && (
              <div>
                <div className="text-muted-foreground">AR Amount</div>
                <div className={`font-semibold ${client.arAmount && client.arAmount > 1000 ? 'text-amber-600' : ''}`}>
                  {formatCurrency(client.arAmount || 0)}
                </div>
              </div>
            )}
            {client.lifetimeValue && (
              <div>
                <div className="text-muted-foreground">Lifetime Value</div>
                <div className="font-semibold">{formatCurrency(client.lifetimeValue)}</div>
              </div>
            )}
            {client.hasChargeAccount && (
              <div>
                <div className="text-muted-foreground">Charge Account</div>
                <div className="font-semibold">
                  {client.hasChargeAccount ? "Yes" : "No"}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-2 flex gap-2 bg-muted/30">
        {onViewClient && (
          <Button onClick={() => onViewClient(client)} size="sm" className="flex-1" variant="outline">
            <Eye size={16} className="mr-1" /> View
          </Button>
        )}
        {onSendOrderForm && (
          <Button onClick={() => onSendOrderForm(client)} size="sm" className="flex-1" variant="default">
            <Mail size={16} className="mr-1" /> Order Form
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
