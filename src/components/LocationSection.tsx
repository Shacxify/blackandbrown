import { MapPin, Phone, Clock } from 'lucide-react';

const LocationSection = () => {
  return (
    <section id="location" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide uppercase mb-4">
            Location
          </h2>
          <div className="section-divider-decorated mb-10" />
          
          <div className="space-y-6 text-center">
            {/* Address */}
            <div>
              <p className="text-sm text-foreground tracking-wide">751 W. San Carlos St</p>
              <p className="text-sm text-foreground tracking-wide">San Jose, CA 95126</p>
              <p className="text-sm text-muted-foreground tracking-wide mt-2">(408) 298-1970</p>
            </div>

            <div className="section-divider" />

            {/* Store Hours */}
            <div>
              <h3 className="text-xs text-foreground tracking-nav uppercase font-medium mb-3">
                Store Hours
              </h3>
              <p className="text-sm text-muted-foreground">Everyday</p>
              <p className="text-sm text-muted-foreground">11am-7pm</p>
            </div>

            <div className="section-divider" />

            {/* Buying Hours */}
            <div>
              <h3 className="text-xs text-foreground tracking-nav uppercase font-medium mb-3">
                Buying Hours
              </h3>
              <p className="text-sm text-muted-foreground">Mon - Sat</p>
              <p className="text-sm text-muted-foreground">11am-6:00pm</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
