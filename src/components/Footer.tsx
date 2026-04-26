import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <h3 className="logo-text text-lg text-foreground mb-6">
            Black & Brown
          </h3>
          
          <div className="section-divider-decorated mb-6" />

          {/* Instagram */}
          <a 
            href="https://instagram.com/blackandbrownsj" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs tracking-nav uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <Instagram className="h-4 w-4" />
            Follow @blackandbrownsj
          </a>

          <div className="section-divider my-6" />

          {/* Copyright */}
          <p className="text-xs text-muted-foreground tracking-wide whitespace-pre-line">
            © {new Date().getFullYear()} Black & Brown. All rights reserved.{"\n"}Design blessed by $$$.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
