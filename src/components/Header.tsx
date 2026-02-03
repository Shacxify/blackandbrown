import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, Menu, X } from 'lucide-react';

interface HeaderProps {
  mode: 'consumer' | 'business';
  onModeChange: (mode: 'consumer' | 'business') => void;
}

const Header = ({ mode, onModeChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Black<span className="text-amber">&</span> Brown
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <span className="text-sm text-muted-foreground font-medium">
              Curated Vintage
            </span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button
                variant={mode === 'consumer' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('consumer')}
                className="gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop
              </Button>
              <Button
                variant={mode === 'business' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('business')}
                className="gap-2"
              >
                <Package className="h-4 w-4" />
                Inventory
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              <Button
                variant={mode === 'consumer' ? 'default' : 'ghost'}
                onClick={() => {
                  onModeChange('consumer');
                  setMobileMenuOpen(false);
                }}
                className="justify-start gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop Collection
              </Button>
              <Button
                variant={mode === 'business' ? 'default' : 'ghost'}
                onClick={() => {
                  onModeChange('business');
                  setMobileMenuOpen(false);
                }}
                className="justify-start gap-2"
              >
                <Package className="h-4 w-4" />
                Manage Inventory
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
