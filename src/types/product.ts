export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  size?: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  description: string;
  image: string;
  dateAdded: Date;
  sold: boolean;
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
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Accessories',
  'Shoes',
  'Bags',
];

export const CONDITIONS: Product['condition'][] = ['Excellent', 'Good', 'Fair'];
