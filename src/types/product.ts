export type ProductStatus = 'draft' | 'published' | 'sold';
export type ProductCondition = 'Excellent' | 'Good' | 'Fair';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  category: string;
  size: string | null;
  condition: ProductCondition;
  ai_suggested_price: number | null;
  price: number;
  photos: string[];
  status: ProductStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductCategory =
  | 'All'
  | 'Tops'
  | 'Bottoms'
  | 'Dresses'
  | 'Outerwear'
  | 'Accessories'
  | 'Shoes'
  | 'Bags';

export const CATEGORIES: ProductCategory[] = [
  'All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes', 'Bags',
];

export const CONDITIONS: ProductCondition[] = ['Excellent', 'Good', 'Fair'];
