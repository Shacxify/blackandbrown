import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const conditionColors = {
    Excellent: 'bg-green-100 text-green-800 border-green-200',
    Good: 'bg-amber/20 text-amber border-amber/30',
    Fair: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <article className="group card-hover bg-card rounded-lg overflow-hidden border border-border">
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-muted relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.sold && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="font-serif text-2xl text-primary-foreground italic">Sold</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className={`${conditionColors[product.condition]} border`}>
            {product.condition}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg font-medium text-foreground leading-tight group-hover:text-amber transition-colors">
            {product.name}
          </h3>
          <span className="font-semibold text-foreground whitespace-nowrap">
            ${product.price}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{product.category}</span>
          {product.size && (
            <>
              <span>•</span>
              <span>Size {product.size}</span>
            </>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </div>
    </article>
  );
};

export default ProductCard;
