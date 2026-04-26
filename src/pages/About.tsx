import Header from '@/components/Header';
import Footer from '@/components/Footer';
import storefront from '@/assets/about-storefront.jpg';
import owner from '@/assets/about-owner.jpg';
import interior from '@/assets/about-interior.jpg';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative">
        <img
          src={storefront}
          alt="Black & Brown storefront on West San Carlos Street in San Jose"
          width={1600}
          height={1067}
          className="w-full h-[50vh] md:h-[65vh] object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-2xl">
            <p className="text-xs tracking-nav uppercase text-background/80 mb-4">
              Est. 2005 · San Jose, California
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-background tracking-wide leading-tight">
              About Black & Brown
            </h1>
            <div className="section-divider-decorated mt-6 opacity-60" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-xs tracking-nav uppercase text-muted-foreground mb-6">
              Our Story
            </p>
            <h2 className="text-center font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide leading-relaxed mb-8">
              In San Jose, style has always carried a certain kind of <em>quiet confidence.</em>
            </h2>
            <div className="section-divider mb-10" />
            <p className="font-serif text-lg leading-loose text-foreground/85">
              It is not loud for the sake of being loud. It is layered, personal, and shaped by
              the people, neighborhoods, music, art, and movement that make the city what it is.
              <strong className="font-medium text-foreground"> Black &amp; Brown has grown from that same spirit.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Founding */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-5xl mx-auto">
            <div className="order-2 md:order-1">
              <p className="text-xs tracking-nav uppercase text-muted-foreground mb-4">
                Founded 2005
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground tracking-wide leading-tight mb-6">
                A small shop with good taste.
              </h2>
              <div className="section-divider mb-8" />
              <p className="font-serif text-base leading-loose text-foreground/85 mb-5">
                Founded in 2005 by San Jose native <strong className="font-medium text-foreground">Monisha “Mo” Murray</strong> and Irene Kim,
                Black &amp; Brown began as a small, word-of-mouth vintage shop on San Carlos Street.
                It quickly became the kind of place people did not just stumble into,
                but heard about from someone with good taste.
              </p>
              <p className="font-serif text-base leading-loose text-foreground/85">
                Over time, the shop developed a following among customers looking for clothing with
                <strong className="font-medium text-foreground"> character, quality, and a point of view.</strong>
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={owner}
                alt="Monisha Murray, owner of Black & Brown"
                loading="lazy"
                width={1200}
                height={1500}
                className="w-full aspect-[4/5] object-cover"
              />
              <p className="text-center text-xs tracking-nav uppercase text-muted-foreground mt-4">
                Monisha “Mo” Murray · Owner
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Identity pull quote */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-nav uppercase text-muted-foreground mb-6">
              Black, Woman-Owned
            </p>
            <blockquote className="font-serif text-2xl md:text-4xl font-light text-foreground tracking-wide leading-relaxed">
              The name itself has evolved with the business.
              What first reflected a mix of old and new also came to represent
              <em> Mo’s own African American and Mexican American background</em> —
              making the store not only a place for style, but a reflection of
              <strong className="font-medium"> identity, culture, and local pride.</strong>
            </blockquote>
            <div className="section-divider-decorated mt-10" />
          </div>
        </div>
      </section>

      {/* Curation */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-5xl mx-auto">
            <div>
              <img
                src={interior}
                alt="Inside Black & Brown — curated racks of vintage clothing"
                loading="lazy"
                width={1600}
                height={1067}
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div>
              <p className="text-xs tracking-nav uppercase text-muted-foreground mb-4">
                The Curation
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground tracking-wide leading-tight mb-6">
                Never a typical thrift store.
              </h2>
              <div className="section-divider mb-8" />
              <p className="font-serif text-base leading-loose text-foreground/85 mb-5">
                <strong className="font-medium text-foreground">Its strength is curation.</strong>{' '}
                Every rack is built with intention — bringing together vintage pieces, designer
                finds, streetwear, contemporary fashion, and clothing that feels timeless without
                feeling predictable.
              </p>
              <p className="font-serif text-base leading-loose text-foreground/85">
                The shop carries garments from as far back as the <strong className="font-medium text-foreground">1940s</strong>,
                alongside modern pieces that speak to the way people dress now. The result is a
                space where past and present sit comfortably together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Long form continuation */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-10">
            <div>
              <p className="text-xs tracking-nav uppercase text-muted-foreground mb-4 text-center">
                Roots in the City
              </p>
              <div className="section-divider mb-8" />
              <p className="font-serif text-base leading-loose text-foreground/85">
                As San Jose has changed, Black &amp; Brown has grown with it. After its early years
                on San Carlos, the business expanded to The Alameda before eventually settling
                into its current home on <strong className="font-medium text-foreground">West San Carlos Street</strong>.
                The shop’s historic building now feels like part store, part archive, part community
                space — a place where clothing is bought and sold, but also where taste is exchanged,
                stories are shared, and local culture shows up naturally.
              </p>
            </div>

            <div>
              <p className="text-xs tracking-nav uppercase text-muted-foreground mb-4 text-center">
                Mo’s Approach
              </p>
              <div className="section-divider mb-8" />
              <p className="font-serif text-base leading-loose text-foreground/85 mb-5">
                Mo’s approach to fashion is rooted in <strong className="font-medium text-foreground">experience, instinct, and respect for the life of a garment</strong>.
                Black &amp; Brown is built around the belief that good clothing does not have to be
                new to feel relevant.
              </p>
              <p className="font-serif text-base leading-loose text-foreground/85">
                A jacket, dress, pair of jeans, or designer piece can carry history and still feel
                completely current in the right hands. That is part of the shop’s appeal — it gives
                customers a way to dress with individuality while also participating in a more
                <em> thoughtful, sustainable</em> way of buying.
              </p>
            </div>

            <div>
              <p className="text-xs tracking-nav uppercase text-muted-foreground mb-4 text-center">
                More Than Retail
              </p>
              <div className="section-divider mb-8" />
              <p className="font-serif text-base leading-loose text-foreground/85">
                Over the years, Black &amp; Brown has become more than a retail destination. It has
                been part of San Jose’s creative fabric — hosting <strong className="font-medium text-foreground">fashion shows, pop-ups,
                art-centered events, DJs, and community gatherings</strong>. The shop reflects a version
                of the Bay Area that values originality, cultural mix, local ownership, and
                self-expression without needing to over-explain itself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-nav uppercase text-muted-foreground mb-6">
              In Closing
            </p>
            <h2 className="font-serif text-2xl md:text-4xl font-light text-foreground tracking-wide leading-relaxed mb-8">
              At its core, Black &amp; Brown is a <em>San Jose story.</em>
            </h2>
            <div className="section-divider mb-8" />
            <p className="font-serif text-base md:text-lg leading-loose text-foreground/85">
              It is about a local business built through <strong className="font-medium text-foreground">taste, resilience, and community</strong>.
              About giving clothing a second life and giving people a place to find pieces that
              feel like them.
            </p>
            <p className="font-serif text-base md:text-lg leading-loose text-foreground/85 mt-5">
              Proudly <strong className="font-medium text-foreground">Black, woman-owned, and rooted in the city</strong>,
              Black &amp; Brown continues to stand as one of San Jose’s true style landmarks.
            </p>
            <div className="section-divider-decorated mt-10" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
