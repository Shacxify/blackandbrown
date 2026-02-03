import { Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-semibold mb-4">
              Black<span className="text-amber">&</span> Brown
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Curating timeless vintage pieces with character. 
              Each item is hand-selected for quality and enduring style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#products" className="hover:text-primary-foreground transition-colors">Shop Collection</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Consignment</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <div className="flex items-center gap-4 mb-4">
              <a 
                href="#" 
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-primary-foreground/70">
              New arrivals posted weekly.
              <br />
              Follow along for first picks.
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Black & Brown. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
