import { Product } from '@/types/product';
import QuickAddForm from './QuickAddForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Package, CheckCircle, TrendingUp } from 'lucide-react';
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
    toast.success(`"${product.name}" marked as sold`);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide uppercase mb-4">
            Inventory Manager
          </h2>
          <div className="section-divider-decorated mb-6" />
          <p className="text-sm text-muted-foreground tracking-wide max-w-md mx-auto">
            Quickly add and manage your current stock
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-serif text-foreground">{availableProducts.length}</p>
              <p className="text-xs text-muted-foreground tracking-wide uppercase">Available</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-serif text-foreground">{soldProducts.length}</p>
              <p className="text-xs text-muted-foreground tracking-wide uppercase">Sold</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-serif text-foreground">${totalValue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground tracking-wide uppercase">Value</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Quick Add Form */}
          <QuickAddForm onAddProduct={onAddProduct} />

          {/* Current Inventory */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-xl font-light tracking-wide uppercase">
                Current Stock
              </CardTitle>
              <div className="section-divider mt-4" />
            </CardHeader>
            <CardContent>
              {availableProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs tracking-wide uppercase">Item</TableHead>
                        <TableHead className="text-xs tracking-wide uppercase">Price</TableHead>
                        <TableHead className="text-xs tracking-wide uppercase text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableProducts.slice(0, 8).map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-10 h-10 object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {product.category} {product.size && `· ${product.size}`}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">${product.price}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkSold(product)}
                              className="text-xs"
                            >
                              Sold
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {availableProducts.length > 8 && (
                    <p className="text-center text-xs text-muted-foreground mt-4 tracking-wide">
                      +{availableProducts.length - 8} more items
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No items in stock</p>
                  <p className="text-xs">Add your first item</p>
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
