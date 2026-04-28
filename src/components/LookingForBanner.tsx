import { useLookingFor } from '@/hooks/useLookingFor';

interface Props {
  variant?: 'banner' | 'inline';
}

const LookingForBanner = ({ variant = 'banner' }: Props) => {
  const { data, loading } = useLookingFor();
  if (loading || !data?.summary) return null;

  if (variant === 'inline') {
    return (
      <div className="border border-border p-5 text-left">
        <p className="text-[10px] tracking-nav uppercase text-foreground font-medium mb-2">
          What We're Looking For Now
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-secondary/40 border-y border-border">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <p className="text-[10px] tracking-nav uppercase text-foreground font-medium mb-3">
          What We're Looking For Now
        </p>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed tracking-wide">
          {data.summary}
        </p>
      </div>
    </section>
  );
};

export default LookingForBanner;
