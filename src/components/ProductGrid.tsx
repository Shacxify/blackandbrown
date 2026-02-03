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
    <section id="products" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
            Current Collection
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse our carefully curated selection of vintage treasures. 
            Each piece tells a story.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
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
            <p className="text-muted-foreground text-lg">
              No items available in this category right now.
            </p>
            <p className="text-muted-foreground">
              Check back soon—our collection is always evolving!
            </p>
          </div>
        )}

        {/* Item count */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Showing {availableProducts.length} of {products.filter(p => !p.sold).length} available pieces
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
