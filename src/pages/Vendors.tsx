
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Eye, 
  Tag,
  CheckCircle2
} from 'lucide-react';
import { vendors } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { Vendor } from '@/types';

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const filteredVendors = vendors.filter(vendor => {
    return (
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleViewVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header 
          title="Vendors" 
          subtitle="Manage your supply vendors" 
        />
        
        <main className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-1 relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search vendors or categories..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button>
              <Plus size={16} className="mr-1" />
              Add Vendor
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="mb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{vendor.name}</h3>
                          <p className="text-sm text-muted-foreground">{vendor.contactName}</p>
                        </div>
                        <Building className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-3 flex-1">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{vendor.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0 mt-1" />
                        <span className="line-clamp-2">{vendor.address}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Categories:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.categories.map((category, index) => (
                          <span 
                            key={index}
                            className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Avg. shipping time: {vendor.avgShippingTime} day{vendor.avgShippingTime !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-2 flex gap-2 bg-muted/30">
                  <Button 
                    onClick={() => handleViewVendor(vendor)} 
                    size="sm" 
                    className="flex-1" 
                    variant="default"
                  >
                    <Eye size={16} className="mr-1" /> View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredVendors.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No vendors found matching your criteria.
              </div>
            )}
          </div>
          
          {/* Vendor Detail Dialog */}
          <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
            {selectedVendor && (
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{selectedVendor.name}</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Vendor Information</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <p className="text-muted-foreground">Contact:</p>
                      <p className="col-span-2 font-medium">{selectedVendor.contactName}</p>
                      
                      <p className="text-muted-foreground">Email:</p>
                      <p className="col-span-2">{selectedVendor.email}</p>
                      
                      <p className="text-muted-foreground">Phone:</p>
                      <p className="col-span-2">{selectedVendor.phone}</p>
                      
                      <p className="text-muted-foreground">Address:</p>
                      <p className="col-span-2">{selectedVendor.address}</p>
                      
                      <p className="text-muted-foreground">Categories:</p>
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {selectedVendor.categories.map((category, index) => (
                          <span 
                            key={index}
                            className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-muted-foreground">Shipping:</p>
                      <p className="col-span-2">
                        {selectedVendor.avgShippingTime} day{selectedVendor.avgShippingTime !== 1 ? 's' : ''} average
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Items Supplied</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-3 py-2 text-left text-xs font-medium">Item</th>
                            <th className="px-3 py-2 text-right text-xs font-medium">Price</th>
                            <th className="px-3 py-2 text-center text-xs font-medium">Preferred</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {selectedVendor.items.map((item) => (
                            <tr key={item.inventoryItemId}>
                              <td className="px-3 py-2 text-sm">{item.name}</td>
                              <td className="px-3 py-2 text-right text-sm">
                                {formatCurrency(item.price)}/{item.unit}
                              </td>
                              <td className="px-3 py-2 text-center text-sm">
                                {item.isPreferred ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                                ) : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Order History</h3>
                  <div className="border rounded-md p-4 text-center text-muted-foreground">
                    Order history data would be displayed here.
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setSelectedVendor(null)}>
                    Close
                  </Button>
                  <Button>Edit Vendor</Button>
                  <Button variant="default">Place Order</Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Vendors;
