import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, Menu, X, MapPin } from 'lucide-react';

interface HeaderProps {
  mode: 'consumer' | 'business';
  onModeChange: (mode: 'consumer' | 'business') => void;
}

const Header = ({ mode, onModeChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs tracking-nav">
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="nav-link">Facebook</a>
              <a href="#" className="nav-link">Pinterest</a>
              <a href="https://instagram.com/blackandbrownsj" target="_blank" rel="noopener noreferrer" className="nav-link">Instagram</a>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <button 
                onClick={() => onModeChange(mode === 'consumer' ? 'business' : 'consumer')}
                className="nav-link flex items-center gap-1"
              >
                {mode === 'consumer' ? (
                  <>
                    <Package className="h-3 w-3" />
                    <span>Inventory</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3 w-3" />
                    <span>Shop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center py-8 md:py-12">
          {/* Logo */}
          <h1 className="logo-text text-2xl md:text-3xl text-foreground mb-4">
            Black & Brown
          </h1>
          
          {/* Decorative divider */}
          <div className="section-divider-decorated mb-6" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <a href="#" className="nav-link">Home</a>
            <a href="#products" className="nav-link">Shop</a>
            <a href="#sell" className="nav-link">Sell</a>
            <a href="#location" className="nav-link">Location</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border animate-fade-in">
            <nav className="flex flex-col items-center gap-4">
              <a href="#" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Shop</a>
              <a href="#sell" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Sell</a>
              <a href="#location" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Location</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
