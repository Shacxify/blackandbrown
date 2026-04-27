
-- Add unique constraint on user_roles if missing
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

-- Update demo admin password to 'jalal1234'
UPDATE auth.users
SET encrypted_password = crypt('jalal1234', gen_salt('bf'))
WHERE email = 'admin@blackandbrown.demo';

-- Ensure the admin role is granted
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'admin@blackandbrown.demo'
ON CONFLICT (user_id, role) DO NOTHING;
