import { useLookingFor } from '@/hooks/useLookingFor';
import { Sparkles } from 'lucide-react';

interface Props {
  variant?: 'banner' | 'inline';
}

const LookingForBanner = ({ variant = 'banner' }: Props) => {
  const { data, loading } = useLookingFor();
  if (loading || !data?.summary) return null;

  if (variant === 'inline') {
    return (
      <div className="border border-border p-5 text-left">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-foreground" />
          <p className="text-[10px] tracking-nav uppercase text-foreground font-medium">
            What We're Looking For Now
          </p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-secondary/40 border-y border-border">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-foreground" />
          <p className="text-[10px] tracking-nav uppercase text-foreground font-medium">
            What We're Looking For Now
          </p>
        </div>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed tracking-wide">
          {data.summary}
        </p>
      </div>
    </section>
  );
};

export default LookingForBanner;
