import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import LocationSection from '@/components/LocationSection';
import SellSection from '@/components/SellSection';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { products, loading } = useProducts({ onlyPublished: true });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductGrid products={products} loading={loading} />
      <SellSection />
      <LocationSection />
      <Footer />
    </div>
  );
};

export default Index;
