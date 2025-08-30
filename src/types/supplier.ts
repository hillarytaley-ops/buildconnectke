export interface Supplier {
  id: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  specialties: string[];
  materials_offered: string[];
  rating: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;
  contact_info_status?: string;
  can_view_contact?: boolean;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  supplier: Supplier;
  price?: number;
  unit?: string;
  description?: string;
  image_url?: string;
  rating?: number;
  in_stock?: boolean;
}

export interface SupplierFilters {
  search: string;
  category: string;
  location: string;
  rating: number;
  verified: boolean | null;
}

export interface MaterialFilters {
  search: string;
  category: string;
  priceRange: [number, number];
  inStock: boolean | null;
}

export const MATERIAL_CATEGORIES = [
  "All Categories",
  "Cement",
  "Steel", 
  "Tiles",
  "Aggregates",
  "Roofing",
  "Paint",
  "Timber",
  "Hardware",
  "Plumbing",
  "Electrical"
] as const;

export type MaterialCategory = typeof MATERIAL_CATEGORIES[number];