-- Add some sample suppliers for demonstration
INSERT INTO public.suppliers (
  company_name, 
  contact_person, 
  email, 
  phone, 
  address, 
  specialties, 
  materials_offered, 
  is_verified, 
  rating
) VALUES
(
  'Bamburi Cement Ltd',
  'John Kamau',
  'sales@bamburi.com',
  '+254722123456',
  'Bamburi Road, Mombasa',
  ARRAY['Cement', 'Concrete', 'Building Solutions'],
  ARRAY['Cement', 'Concrete', 'Aggregates'],
  true,
  4.8
),
(
  'Devki Steel Mills',
  'Mary Wanjiku',
  'info@devki.com',
  '+254733456789',
  'Industrial Area, Ruiru',
  ARRAY['Steel', 'Iron Sheets', 'Wire Products'],
  ARRAY['Steel', 'Iron Sheets', 'Wire', 'Roofing'],
  true,
  4.7
),
(
  'Crown Paints Kenya',
  'Peter Otieno',
  'sales@crownpaints.co.ke',
  '+254711987654',
  'Enterprise Road, Nairobi',
  ARRAY['Paint', 'Coatings', 'Construction Chemicals'],
  ARRAY['Paint', 'Primer', 'Varnish'],
  true,
  4.6
),
(
  'Kenbro Industries',
  'Grace Mutua',
  'sales@kenbro.co.ke',
  '+254745321098',
  'Mombasa Road, Nairobi',
  ARRAY['Tiles', 'Ceramics', 'Sanitary Ware'],
  ARRAY['Tiles', 'Ceramic', 'Sanitary'],
  false,
  4.4
),
(
  'Mabati Rolling Mills',
  'David Kiplagat',
  'sales@mabati.com',
  '+254756789123',
  'Nakuru Industrial Area',
  ARRAY['Iron Sheets', 'Roofing', 'Steel Products'],
  ARRAY['Iron Sheets', 'Roofing', 'Steel'],
  true,
  4.5
);