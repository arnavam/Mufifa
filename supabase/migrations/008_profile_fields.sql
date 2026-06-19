-- Add new fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN full_name TEXT,
ADD COLUMN phone_number TEXT,
ADD COLUMN college TEXT,
ADD COLUMN district TEXT;

-- Update the handle_new_user function to insert these fields from Auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, phone_number, college, district)
  VALUES (
    new.id,
    new.email,
    'participant',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'district'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
