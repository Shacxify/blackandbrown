-- Fix user_roles primary key so a user can hold multiple roles (e.g. admin + employee)
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE public.user_roles ADD PRIMARY KEY (user_id, role);

-- Grant the demo admin both roles so they have full access everywhere
INSERT INTO public.user_roles (user_id, role)
SELECT '496f7cf9-8fde-4bd7-b561-c0ca0babc70b'::uuid, 'employee'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = '496f7cf9-8fde-4bd7-b561-c0ca0babc70b'::uuid
    AND role = 'employee'::app_role
);

-- Update the demo-admin trigger to ALSO grant employee, so admins always have full access
CREATE OR REPLACE FUNCTION public.grant_demo_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.email = 'admin@blackandbrown.demo' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'employee'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;