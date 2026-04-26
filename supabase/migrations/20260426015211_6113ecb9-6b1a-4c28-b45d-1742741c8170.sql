ALTER TABLE public.products ADD COLUMN is_hot boolean NOT NULL DEFAULT false;
CREATE INDEX idx_products_is_hot ON public.products(is_hot) WHERE is_hot = true;