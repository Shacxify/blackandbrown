-- Create enum for granular permissions
CREATE TYPE public.app_permission AS ENUM (
  'post_to_feed',
  'use_estimation',
  'manage_payroll',
  'manage_schedule'
);

-- Permissions table mapping users to permissions
CREATE TABLE public.user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  permission public.app_permission NOT NULL,
  granted_by uuid,
  granted_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, permission)
);

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Security definer function to check permissions
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission public.app_permission)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_permissions
    WHERE user_id = _user_id AND permission = _permission
  ) OR public.has_role(_user_id, 'admin'::app_role);
$$;

-- RLS policies
CREATE POLICY "Admins manage permissions"
ON public.user_permissions
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users view their own permissions"
ON public.user_permissions
FOR SELECT
USING (auth.uid() = user_id);