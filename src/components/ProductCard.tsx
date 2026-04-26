import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const placeholder = 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop';

const ProductCard = ({ product }: ProductCardProps) => {
  const conditionLabel: Record<Product['condition'], string> = {
    Excellent: 'Excellent Condition',
    Good: 'Good Condition',
    Fair: 'Fair Condition',
  };

  const isSold = product.status === 'sold';

  return (
    <article className="group card-minimal overflow-hidden">
      <div className="aspect-[3/4] overflow-hidden bg-secondary relative">
        <img
          src={product.photos?.[0] || placeholder}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {isSold && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="font-serif text-lg text-foreground tracking-wide uppercase">Sold</span>
          </div>
        )}
      </div>

      <div className="p-5 text-center">
        <h3 className="font-serif text-base font-normal text-foreground tracking-wide uppercase mb-2">
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-2">
          ${Number(product.price).toFixed(2)}
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground tracking-wide">
          <span>{product.category}</span>
          {product.size && (<><span>·</span><span>Size {product.size}</span></>)}
        </div>

        <div className="section-divider my-4" />

        <p className="text-xs text-muted-foreground tracking-wide">
          {conditionLabel[product.condition]}
        </p>
      </div>
    </article>
  );
};

export default ProductCard;
