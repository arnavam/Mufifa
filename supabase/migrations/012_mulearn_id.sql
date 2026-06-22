-- 012_mulearn_id.sql
-- Capture each participant's muLearn ID at registration. muLearn IDs are
-- handles that always end with "@mulearn" (e.g. "john@mulearn").

ALTER TABLE public.profiles
ADD COLUMN mulearn_id TEXT;

-- Update the signup trigger to copy mulearn_id from auth metadata, alongside
-- the existing profile fields (added in 008_profile_fields.sql).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, phone_number, college, district, mulearn_id)
  VALUES (
    new.id,
    new.email,
    'participant',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'district',
    new.raw_user_meta_data->>'mulearn_id'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
