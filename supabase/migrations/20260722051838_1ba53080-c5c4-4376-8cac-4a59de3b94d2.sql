
-- Scope employee-role policies to authenticated users so anonymous guests don't
-- trigger has_role() (which they cannot execute) when reading products.
DROP POLICY IF EXISTS "Employees can view all products" ON public.products;
DROP POLICY IF EXISTS "Employees can insert products" ON public.products;
DROP POLICY IF EXISTS "Employees can update products" ON public.products;
DROP POLICY IF EXISTS "Employees can delete products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view published products" ON public.products;

CREATE POLICY "Anyone can view published products"
ON public.products FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Employees can view all products"
ON public.products FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'employee'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees can insert products"
ON public.products FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'employee'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees can update products"
ON public.products FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'employee'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees can delete products"
ON public.products FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'employee'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
