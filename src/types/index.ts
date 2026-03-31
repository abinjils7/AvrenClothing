export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  wishlist?: Product[] | string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories?: Category[];
}

export interface Variant {
  _id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
}

export interface ProductImage {
  _id: string;
  url: string;
  alt?: string;
  isMain: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number;
  category: Category;
  brand: string;
  variants: Variant[];
  images: ProductImage[];
  averageRating: number;
  numReviews: number;
  featured: boolean;
  isActive: boolean;
  tags?: string[];
  discountPercentage?: number;
  inStock?: boolean;
  material?: string;
  careInstructions?: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice?: number;
  totalItems?: number;
}
