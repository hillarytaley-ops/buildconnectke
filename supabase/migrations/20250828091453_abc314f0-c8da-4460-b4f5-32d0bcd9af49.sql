-- Fix sample suppliers to have proper user associations
-- First create some sample user profiles for the suppliers
INSERT INTO public.profiles (id, user_id, full_name, role, company_name) VALUES
(gen_random_uuid(), gen_random_uuid(), 'John Kamau', 'supplier', 'Bamburi Cement Ltd'),
(gen_random_uuid(), gen_random_uuid(), 'Mary Wanjiku', 'supplier', 'Devki Steel Mills'),
(gen_random_uuid(), gen_random_uuid(), 'Peter Otieno', 'supplier', 'Crown Paints Kenya'),
(gen_random_uuid(), gen_random_uuid(), 'Grace Mutua', 'supplier', 'Kenbro Industries'),
(gen_random_uuid(), gen_random_uuid(), 'David Kiplagat', 'supplier', 'Mabati Rolling Mills');

-- Update suppliers to reference these profiles
UPDATE public.suppliers SET user_id = (
  SELECT id FROM public.profiles WHERE company_name = suppliers.company_name LIMIT 1
) WHERE user_id IS NULL;