import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Clock, Instagram, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="font-serif text-3xl md:text-4xl font-light text-foreground tracking-wide uppercase mb-4">
                Contact
              </h1>
              <div className="section-divider-decorated mb-6" />
              <p className="text-sm text-muted-foreground tracking-wide max-w-md mx-auto">
                Visit the storefront, give us a call, or reach out online.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              {/* Storefront preview */}
              <div className="space-y-5">
                <h2 className="text-xs tracking-nav uppercase font-medium text-foreground">
                  Storefront
                </h2>
                <div className="aspect-[4/3] overflow-hidden border border-border">
                  <iframe
                    title="Black & Brown storefront map"
                    src="https://www.google.com/maps?q=751+W+San+Carlos+St,+San+Jose,+CA+95126&output=embed"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground">751 W. San Carlos St</p>
                      <p className="text-sm text-foreground">San Jose, CA 95126</p>
                    </div>
                  </div>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=751+W+San+Carlos+St,+San+Jose,+CA+95126"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link inline-block pt-2"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>

              {/* Contact details + hours */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs tracking-nav uppercase font-medium text-foreground mb-4">
                    Get In Touch
                  </h2>
                  <div className="space-y-3">
                    <a
                      href="tel:+14082981970"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      (408) 298-1970
                    </a>
                    <a
                      href="mailto:hello@blackandbrownsj.com"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      hello@blackandbrownsj.com
                    </a>
                    <a
                      href="https://instagram.com/blackandbrownsj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors"
                    >
                      <Instagram className="h-3.5 w-3.5" />
                      @blackandbrownsj
                    </a>
                  </div>
                </div>

                <div className="section-divider" />

                <div>
                  <h2 className="text-xs tracking-nav uppercase font-medium text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Store Hours
                  </h2>
                  <p className="text-sm text-muted-foreground">Everyday</p>
                  <p className="text-sm text-muted-foreground">11am – 7pm</p>
                </div>

                <div className="section-divider" />

                <div>
                  <h2 className="text-xs tracking-nav uppercase font-medium text-foreground mb-4">
                    Buying Hours
                  </h2>
                  <p className="text-sm text-muted-foreground">Monday – Saturday</p>
                  <p className="text-sm text-muted-foreground">11am – 6:00pm</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
