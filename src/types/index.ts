
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  subcategory?: string;
  dateAdded: string;
  adminLink?: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories?: string[];
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  category: string;
  subcategory?: string;
  priceRange: PriceRange;
  sortBy: 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc';
}
