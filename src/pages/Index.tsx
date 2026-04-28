import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import RecentlySold from '@/components/RecentlySold';

import SellSection from '@/components/SellSection';
import LookingForBanner from '@/components/LookingForBanner';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { products, loading } = useProducts({ onlyPublished: true });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <LookingForBanner />
      <ProductGrid products={products} loading={loading} />
      <RecentlySold />
      <SellSection>
      <Footer />
    </div>
  );
};

export default Index;
