import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ClientCard } from '@/components/ClientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Client } from '@/types';
import { clients, orders } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";
import { StatusBadge } from '@/components/StatusBadge';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const filteredClients = clients.filter(client => {
    return (
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getOpenOrdersCount = (clientId: string) => {
    return orders.filter(order => 
      order.clientId === clientId && 
      !['delivered', 'cancelled'].includes(order.status)
    ).length;
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
  };
  
  const handleSendOrderForm = (client: Client) => {
    toast({
      title: "Order Form Sent",
      description: `An order form has been sent to ${client.contactName} at ${client.email}`,
    });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Clients" 
          subtitle="Manage your client relationships" 
        />
        
        <main className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button>
              <Plus size={16} className="mr-1" />
              Add Client
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                openOrdersCount={getOpenOrdersCount(client.id)}
                onViewClient={handleViewClient}
                onSendOrderForm={handleSendOrderForm}
              />
            ))}
            
            {filteredClients.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No clients found matching your criteria.
              </div>
            )}
          </div>
          
          {/* Client Detail Dialog */}
          <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
            {selectedClient && (
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{selectedClient.companyName}</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <p className="text-muted-foreground">Contact:</p>
                      <p className="col-span-2 font-medium">{selectedClient.contactName}</p>
                      
                      <p className="text-muted-foreground">Email:</p>
                      <p className="col-span-2">{selectedClient.email}</p>
                      
                      <p className="text-muted-foreground">Phone:</p>
                      <p className="col-span-2">{selectedClient.phone}</p>
                      
                      <p className="text-muted-foreground">Address:</p>
                      <p className="col-span-2">{selectedClient.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Account Information</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <p className="text-muted-foreground">Charge Account:</p>
                      <p className="font-medium">
                        {selectedClient.hasChargeAccount ? "Yes" : "No"}
                      </p>
                      
                      {selectedClient.hasChargeAccount && (
                        <>
                          <p className="text-muted-foreground">AR Amount:</p>
                          <p className={`font-medium ${selectedClient.arAmount && selectedClient.arAmount > 1000 ? 'text-amber-600' : ''}`}>
                            {formatCurrency(selectedClient.arAmount || 0)}
                          </p>
                        </>
                      )}
                      
                      <p className="text-muted-foreground">Last Order:</p>
                      <p>{selectedClient.lastOrderDate || 'No orders'}</p>
                      
                      <p className="text-muted-foreground">Lifetime Value:</p>
                      <p>{formatCurrency(selectedClient.lifetimeValue || 0)}</p>
                      
                      <p className="text-muted-foreground">Open Orders:</p>
                      <p>{getOpenOrdersCount(selectedClient.id)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Recent Orders</h3>
                  <div className="border rounded-md">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-sm font-medium">Order #</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Due Date</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Total</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders
                          .filter(order => order.clientId === selectedClient.id)
                          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
                          .slice(0, 5)
                          .map((order) => (
                            <tr key={order.id}>
                              <td className="px-4 py-2">{order.id}</td>
                              <td className="px-4 py-2">{order.orderDate}</td>
                              <td className="px-4 py-2">{order.dueDate}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(order.total)}</td>
                              <td className="px-4 py-2 text-right">
                                <StatusBadge status={order.status} />
                              </td>
                            </tr>
                          ))}
                        
                        {orders.filter(order => order.clientId === selectedClient.id).length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">
                              No orders for this client.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setSelectedClient(null)}>
                    Close
                  </Button>
                  <Button>Edit Client</Button>
                  <Button variant="default" onClick={() => handleSendOrderForm(selectedClient)}>
                    Send Order Form
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Clients;
