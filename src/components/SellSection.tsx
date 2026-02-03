import { Button } from '@/components/ui/button';

interface SellSectionProps {
  onOpenInventory: () => void;
}

const SellSection = ({ onOpenInventory }: SellSectionProps) => {
  return (
    <section id="sell" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide uppercase mb-4">
            Sell With Us
          </h2>
          <div className="section-divider-decorated mb-10" />
          
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground tracking-wide leading-relaxed">
              We buy quality vintage and contemporary clothing, shoes, and accessories. 
              Bring in your gently used items during our buying hours for an on-the-spot evaluation.
            </p>

            <div className="section-divider" />

            <div>
              <h3 className="text-xs text-foreground tracking-nav uppercase font-medium mb-3">
                What We're Looking For
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Current styles in excellent condition</li>
                <li>Vintage pieces with character</li>
                <li>Designer and quality brands</li>
                <li>Clean, ready-to-sell items</li>
              </ul>
            </div>

            <div className="section-divider" />

            <div>
              <h3 className="text-xs text-foreground tracking-nav uppercase font-medium mb-3">
                Buying Hours
              </h3>
              <p className="text-sm text-muted-foreground">Monday - Saturday</p>
              <p className="text-sm text-muted-foreground">11am - 6:00pm</p>
            </div>

            <Button variant="minimal" onClick={onOpenInventory} className="mt-6">
              Manage Inventory
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellSection;
