import { useState } from 'react';
import { ProductCategory, CATEGORIES } from '@/types/product';
import type { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const ProductGrid = ({ products, loading }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');

  const visible = products.filter((p) => p.status === 'published');
  const filteredRaw = selectedCategory === 'All'
    ? visible
    : visible.filter((p) => p.category === selectedCategory);
  // Hot items first, then by recency (preserves existing order)
  const filtered = [...filteredRaw].sort((a, b) => {
    if (a.is_hot === b.is_hot) return 0;
    return a.is_hot ? -1 : 1;
  });

  return (
    <section id="products" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide uppercase mb-4">
            Current Inventory
          </h2>
          <div className="section-divider-decorated mb-6" />
          <p className="text-sm text-muted-foreground tracking-wide max-w-md mx-auto">
            Browse our curated selection of vintage and consignment pieces
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs tracking-nav uppercase transition-all duration-200 pb-1 border-b ${
                selectedCategory === category
                  ? 'text-foreground border-foreground'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Loading inventory...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-serif text-lg text-muted-foreground tracking-wide">
              No items available in this category
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back soon — new pieces arrive daily
            </p>
          </div>
        )}

        <div className="text-center mt-12 space-y-3">
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            {filtered.length} Items Available
          </p>
          <p className="text-[11px] text-muted-foreground/80 italic max-w-md mx-auto leading-relaxed">
            Disclaimer: Online inventory updates throughout the day and may not reflect the exact in-store count. For real-time availability, please call or visit the shop.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
