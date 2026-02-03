import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 md:py-32 text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground tracking-wide leading-relaxed mb-6 animate-fade-up">
            Our Online Store
          </h2>
          <h3 className="font-serif text-2xl md:text-4xl font-light text-foreground/80 tracking-wide leading-relaxed mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Is Coming Soon
          </h3>
          <p className="font-serif text-xl md:text-2xl text-muted-foreground tracking-wide mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Check Back Again Soon :)
          </p>
          <div className="section-divider mb-8" />
          <p className="text-sm text-muted-foreground tracking-wide mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            In the meantime, browse our available inventory below or visit us in store.
          </p>
          <Button variant="minimal" size="lg" onClick={scrollToProducts} className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            View Inventory
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
