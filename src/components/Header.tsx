import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, Menu, X, LogIn, LogOut, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  mode?: 'consumer' | 'business';
  onModeChange?: (mode: 'consumer' | 'business') => void;
}

const Header = ({ mode = 'consumer', onModeChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isEmployee, isAdmin, user, signOut } = useAuth();

  const handlePortal = () => {
    if (isEmployee) {
      navigate('/inventory');
    } else if (user) {
      // Logged in but not employee
      signOut();
      navigate('/auth');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs tracking-nav">
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="nav-link">Facebook</a>
              <a href="#" className="nav-link">Pinterest</a>
              <a
                href="https://instagram.com/blackandbrownsj"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                Instagram
              </a>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              {user && isEmployee && (
                <>
                  <Link to="/market-trends" className="nav-link flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    <span>Market Trends</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="nav-link flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="nav-link flex items-center gap-1">
                    <LogOut className="h-3 w-3" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
              <button onClick={handlePortal} className="nav-link flex items-center gap-1">
                {isEmployee ? (
                  <><Package className="h-3 w-3" /><span>Inventory</span></>
                ) : (
                  <><LogIn className="h-3 w-3" /><span>Employee Login</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center py-8 md:py-12">
          <Link to="/" className="logo-text text-2xl md:text-3xl text-foreground mb-4 hover:opacity-80 transition-opacity">
            Black & Brown
          </Link>

          <div className="section-divider-decorated mb-6" />

          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/#products" className="nav-link">Shop</Link>
            <Link to="/price-check" className="nav-link">Sell</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/#location" className="nav-link">Location</Link>
          </nav>

          <button
            className="md:hidden p-2 text-foreground absolute right-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border animate-fade-in">
            <nav className="flex flex-col items-center gap-4">
              <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/#products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
              <Link to="/price-check" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Sell</Link>
              <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link to="/#location" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Location</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
