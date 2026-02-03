import { useState } from 'react';
import { Product, ProductCategory, CATEGORIES } from '@/types/product';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const availableProducts = filteredProducts.filter(p => !p.sold);

  return (
    <section id="products" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide uppercase mb-4">
            Current Inventory
          </h2>
          <div className="section-divider-decorated mb-6" />
          <p className="text-sm text-muted-foreground tracking-wide max-w-md mx-auto">
            Browse our curated selection of vintage and consignment pieces
          </p>
        </div>

        {/* Category Filter */}
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

        {/* Products Grid */}
        {availableProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableProducts.map((product, index) => (
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
              Check back soon—new pieces arrive daily
            </p>
          </div>
        )}

        {/* Item count */}
        <div className="text-center mt-12">
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            {availableProducts.length} Items Available
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
