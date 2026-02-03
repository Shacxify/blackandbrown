import { useState } from 'react';
import { Product } from '@/types/product';
import QuickAddForm from './QuickAddForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Package, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryManagerProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'dateAdded' | 'sold'>) => void;
  onMarkSold: (productId: string) => void;
}

const InventoryManager = ({ products, onAddProduct, onMarkSold }: InventoryManagerProps) => {
  const availableProducts = products.filter(p => !p.sold);
  const soldProducts = products.filter(p => p.sold);
  const totalValue = availableProducts.reduce((sum, p) => sum + p.price, 0);

  const handleMarkSold = (product: Product) => {
    onMarkSold(product.id);
    toast.success(`"${product.name}" marked as sold!`);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
            Inventory Manager
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Quickly add new items and manage your current stock. 
            Built for speed when inventory moves fast.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Items</p>
                  <p className="text-3xl font-serif font-medium text-foreground">
                    {availableProducts.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-amber/10">
                  <Package className="h-6 w-6 text-amber" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Items Sold</p>
                  <p className="text-3xl font-serif font-medium text-foreground">
                    {soldProducts.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-secondary">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                  <p className="text-3xl font-serif font-medium text-foreground">
                    ${totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Add Form */}
          <QuickAddForm onAddProduct={onAddProduct} />

          {/* Current Inventory */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif text-xl">Current Stock</CardTitle>
                  <CardDescription>Mark items as sold when they move</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {availableProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableProducts.slice(0, 6).map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium text-sm">{product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {product.category} {product.size && `• ${product.size}`}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkSold(product)}
                            >
                              Sold
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {availableProducts.length > 6 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      +{availableProducts.length - 6} more items
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No items in stock</p>
                  <p className="text-sm">Add your first item using the form</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InventoryManager;
