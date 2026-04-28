import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LookingForValue {
  keywords: string;
  summary: string;
}

export const useLookingFor = () => {
  const [data, setData] = useState<LookingForValue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: row } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'looking_for')
        .maybeSingle();
      if (!mounted) return;
      const v = (row?.value ?? null) as unknown as LookingForValue | null;
      setData(v && (v.summary || v.keywords) ? v : null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading };
};
