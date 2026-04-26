import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductForm from './ProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, TrendingUp, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types/product';

const placeholder = 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop';

const InventoryManager = () => {
  const { products, refetch } = useProducts();
  const available = products.filter((p) => p.status === 'published');
  const drafts = products.filter((p) => p.status === 'draft');
  const sold = products.filter((p) => p.status === 'sold');
  const totalValue = available.reduce((s, p) => s + Number(p.price), 0);

  const setStatus = async (p: Product, status: Product['status']) => {
    const { error } = await supabase.from('products').update({ status }).eq('id', p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(
      status === 'sold' ? `"${p.name}" marked sold` :
      status === 'published' ? `"${p.name}" published` : 'Updated',
    );
    refetch();
  };

  const toggleHot = async (p: Product) => {
    const next = !p.is_hot;
    const { error } = await supabase.from('products').update({ is_hot: next }).eq('id', p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(next ? `"${p.name}" marked Hot 🔥` : `"${p.name}" unmarked`);
    refetch();
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide uppercase mb-4">
            Inventory Manager
          </h2>
          <div className="section-divider-decorated mb-6" />
          <p className="text-sm text-muted-foreground tracking-wide max-w-md mx-auto">
            Add new pieces with AI pricing assistance. Publish to push live to the shop.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-serif text-foreground">{available.length}</p>
              <p className="text-xs text-muted-foreground tracking-wide uppercase">Live</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-serif text-foreground">{sold.length}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <ProductForm onSaved={refetch} />

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-xl font-light tracking-wide uppercase">
                Catalog
              </CardTitle>
              <div className="section-divider mt-4" />
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No items yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs tracking-wide uppercase">Item</TableHead>
                        <TableHead className="text-xs tracking-wide uppercase">Price</TableHead>
                        <TableHead className="text-xs tracking-wide uppercase">Status</TableHead>
                        <TableHead className="text-xs tracking-wide uppercase text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.slice(0, 20).map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={p.photos[0] || placeholder}
                                alt={p.name}
                                className="w-10 h-10 object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium">{p.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {p.category}{p.size ? ` · ${p.size}` : ''}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">${Number(p.price).toFixed(0)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] tracking-wide uppercase">
                              {p.status}
                            </Badge>
                            {p.is_hot && p.status === 'published' && (
                              <Badge variant="default" className="ml-1 text-[10px] tracking-wide uppercase">
                                🔥 Hot
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            {p.status === 'published' && (
                              <Button
                                size="sm"
                                variant={p.is_hot ? 'default' : 'ghost'}
                                onClick={() => toggleHot(p)}
                                className="text-xs"
                                title={p.is_hot ? 'Unmark Hot' : 'Mark Hot'}
                              >
                                <Flame className="h-3 w-3" />
                              </Button>
                            )}
                            {p.status === 'draft' && (
                              <Button size="sm" variant="outline" onClick={() => setStatus(p, 'published')} className="text-xs">
                                Publish
                              </Button>
                            )}
                            {p.status === 'published' && (
                              <Button size="sm" variant="outline" onClick={() => setStatus(p, 'sold')} className="text-xs">
                                Sold
                              </Button>
                            )}
                            {p.status === 'sold' && (
                              <Button size="sm" variant="ghost" onClick={() => setStatus(p, 'published')} className="text-xs">
                                Relist
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {products.length > 20 && (
                    <p className="text-center text-xs text-muted-foreground mt-4 tracking-wide">
                      +{products.length - 20} more items
                    </p>
                  )}
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
