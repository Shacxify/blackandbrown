
-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ PRODUCTS ============
CREATE TYPE public.product_status AS ENUM ('draft', 'published', 'sold');
CREATE TYPE public.product_condition AS ENUM ('Excellent', 'Good', 'Fair');

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  category TEXT NOT NULL,
  size TEXT,
  condition product_condition NOT NULL DEFAULT 'Good',
  ai_suggested_price NUMERIC(10,2),
  price NUMERIC(10,2) NOT NULL,
  photos TEXT[] NOT NULL DEFAULT '{}',
  status product_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published products"
  ON public.products FOR SELECT
  USING (status = 'published');

CREATE POLICY "Employees can view all products"
  ON public.products FOR SELECT
  USING (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can update products"
  ON public.products FOR UPDATE
  USING (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can delete products"
  ON public.products FOR DELETE
  USING (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin'));

-- ============ PRICE SUBMISSIONS ============
CREATE TYPE public.submission_status AS ENUM ('pending', 'reviewed', 'declined');

CREATE TABLE public.price_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  brand TEXT NOT NULL,
  size TEXT NOT NULL,
  use_description TEXT NOT NULL,
  category TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  ai_estimate_low NUMERIC(10,2),
  ai_estimate_high NUMERIC(10,2),
  ai_reasoning TEXT,
  status submission_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.price_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a price request"
  ON public.price_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Employees can view submissions"
  ON public.price_submissions FOR SELECT
  USING (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can update submissions"
  ON public.price_submissions FOR UPDATE
  USING (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin'));

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-photos', 'product-photos', true);

INSERT INTO storage.buckets (id, name, public)
  VALUES ('submission-photos', 'submission-photos', true);

-- product-photos: anyone can view; employees can upload/manage
CREATE POLICY "Public can view product photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-photos');

CREATE POLICY "Employees can upload product photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-photos' AND (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Employees can update product photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-photos' AND (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Employees can delete product photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-photos' AND (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin')));

-- submission-photos: anyone can upload (customers); employees can view
CREATE POLICY "Anyone can upload submission photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'submission-photos');

CREATE POLICY "Public can view submission photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'submission-photos');

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
