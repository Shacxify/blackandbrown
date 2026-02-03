import { useState } from 'react';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/mockProducts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import LocationSection from '@/components/LocationSection';
import SellSection from '@/components/SellSection';
import InventoryManager from '@/components/InventoryManager';
import Footer from '@/components/Footer';

const Index = () => {
  const [mode, setMode] = useState<'consumer' | 'business'>('consumer');
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'dateAdded' | 'sold'>) => {
    const product: Product = {
      ...newProduct,
      id: `product-${Date.now()}`,
      dateAdded: new Date(),
      sold: false,
    };
    setProducts(prev => [product, ...prev]);
  };

  const handleMarkSold = (productId: string) => {
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, sold: true } : p)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header mode={mode} onModeChange={setMode} />
      
      {mode === 'consumer' ? (
        <>
          <Hero />
          <ProductGrid products={products} />
          <SellSection onOpenInventory={() => setMode('business')} />
          <LocationSection />
        </>
      ) : (
        <InventoryManager 
          products={products} 
          onAddProduct={handleAddProduct}
          onMarkSold={handleMarkSold}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
