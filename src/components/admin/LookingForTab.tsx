import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';

const LookingForTab = () => {
  const [keywords, setKeywords] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'looking_for')
        .maybeSingle();
      const v = (data?.value ?? {}) as { keywords?: string; summary?: string };
      setKeywords(v.keywords ?? '');
      setSummary(v.summary ?? '');
      setLoading(false);
    })();
  }, []);

  const generate = async () => {
    if (!keywords.trim()) {
      toast.error('Add some keywords first');
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke('summarize-looking-for', {
      body: { keywords: keywords.trim() },
    });
    setSaving(false);
    if (error || data?.error) {
      toast.error(error?.message || data?.error || 'Failed to generate');
      return;
    }
    setSummary(data.summary);
    toast.success('Published to homepage');
  };

  const clearAll = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .delete()
      .eq('key', 'looking_for');
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setKeywords('');
    setSummary('');
    toast.success('Removed from homepage');
  };

  if (loading) {
    return <div className="text-center text-sm text-muted-foreground py-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-xl font-light tracking-wide uppercase">
            What We're Looking For Now
          </CardTitle>
          <div className="section-divider mt-4" />
          <p className="text-xs tracking-nav uppercase text-muted-foreground mt-3">
            Admin · Buying Priorities
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-xs tracking-wide uppercase">Keywords</Label>
            <Textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. 90s denim, Carhartt jackets, vintage band tees, leather boots size 9-11"
              className="mt-1.5 min-h-[120px]"
              maxLength={1000}
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Separate ideas with commas. Will be summarized into a short customer blurb.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="minimal"
              className="flex-1 gap-2"
              onClick={generate}
              disabled={saving}
            >
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Working...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Generate & Publish</>
              )}
            </Button>
            {summary && (
              <Button variant="outline" onClick={clearAll} disabled={saving}>
                Remove from site
              </Button>
            )}
          </div>

          {summary && (
            <div className="border border-border p-4">
              <p className="text-[10px] tracking-nav uppercase text-muted-foreground mb-2">
                Live on homepage & sell page
              </p>
              <p className="text-sm text-foreground leading-relaxed">{summary}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LookingForTab;
