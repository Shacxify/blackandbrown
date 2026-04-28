import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Menu, X, LogIn, LogOut, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  mode?: 'consumer' | 'business';
  onModeChange?: (mode: 'consumer' | 'business') => void;
}

const Header = ({ mode = 'consumer', onModeChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { isEmployee, isAdmin, user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setCollapsed(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handlePortal = () => {
    if (isEmployee) {
      navigate('/inventory');
    } else if (user) {
      signOut();
      navigate('/auth');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border transition-all duration-300">
      <div
        className={`border-b border-border overflow-hidden transition-all duration-300 ${
          collapsed ? 'max-h-0 opacity-0 border-b-0' : 'max-h-12 opacity-100'
        }`}
      >
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
            <div className="hidden md:flex items-center gap-4 ml-auto">
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
        <div
          className={`flex flex-col items-center transition-all duration-300 ${
            collapsed ? 'py-2 md:py-3' : 'py-8 md:py-12'
          }`}
        >
          <Link
            to="/"
            className={`logo-text text-foreground mb-4 hover:opacity-80 transition-all duration-300 ${
              collapsed ? 'text-lg md:text-xl mb-0' : 'text-2xl md:text-3xl'
            }`}
          >
            Black & Brown
          </Link>

          {!collapsed && <div className="section-divider-decorated mb-6" />}

          <nav
            className={`hidden md:flex items-center transition-all duration-300 ${
              collapsed ? 'gap-6 mt-1' : 'gap-10'
            }`}
          >
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/#products" className="nav-link">Shop</Link>
            <Link to="/price-check" className="nav-link">Sell</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          <button
            className="md:hidden p-2 text-foreground absolute right-4 top-2"
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
              <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

              <div className="w-12 h-px bg-border my-2" />

              {user && isEmployee ? (
                <>
                  <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/inventory" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Inventory</Link>
                  <Link to="/market-trends" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Market Trends</Link>
                  {isAdmin && (
                    <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                  )}
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut(); }}
                    className="nav-link"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Employee Login</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
