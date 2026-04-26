import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';
import ProductCard from './ProductCard';

const RecentlySold = () => {
  const [sold, setSold] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSold = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'sold')
        .order('updated_at', { ascending: false })
        .limit(8);
      if (!error && data) setSold(data as Product[]);
      setLoading(false);
    };
    fetchSold();
  }, []);

  if (!loading && sold.length === 0) return null;

  return (
    <section id="recently-sold" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide uppercase mb-4">
            Recently Sold
          </h2>
          <div className="section-divider-decorated mb-6" />
          <p className="text-sm text-muted-foreground tracking-wide max-w-md mx-auto">
            Pieces that recently found new homes — a glimpse at what's been moving through the shop
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sold.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            {sold.length} Recent Sales
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecentlySold;
