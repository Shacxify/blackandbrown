import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 md:py-32 text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-nav uppercase text-muted-foreground mb-6 animate-fade-up">
            Curated Vintage · Est. Black & Brown
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground tracking-wide leading-relaxed mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Timeless Pieces, Hand-Selected
          </h2>
          <div className="section-divider mb-8" />
          <p className="text-sm md:text-base text-muted-foreground tracking-wide leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Shop our latest arrivals below or visit us in store to experience the collection in person.
          </p>
          <Button variant="minimal" size="lg" onClick={scrollToProducts} className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Shop the Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
