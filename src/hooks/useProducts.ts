import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';

export const useProducts = (opts: { onlyPublished?: boolean } = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (opts.onlyPublished) {
      query = query.eq('status', 'published');
    }
    const { data, error } = await query;
    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.onlyPublished]);

  return { products, loading, refetch: fetchProducts };
};
