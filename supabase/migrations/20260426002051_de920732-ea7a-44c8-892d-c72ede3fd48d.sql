
-- Drop the old surrogate primary key and the unique (user_id, role) constraint
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Remove the columns
ALTER TABLE public.user_roles DROP COLUMN IF EXISTS id;
ALTER TABLE public.user_roles DROP COLUMN IF EXISTS created_at;

-- Make user_id the new primary key (one role per user)
ALTER TABLE public.user_roles ADD PRIMARY KEY (user_id);
