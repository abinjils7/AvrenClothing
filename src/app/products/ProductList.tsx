'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';

// ── Temporary Mock Data ─────────────────────────────────────────────────────
const MOCK_CATEGORIES: Category[] = [
  { _id: 'cat-1', name: 'Shirts', slug: 'shirts', description: 'Premium shirts', image: '' },
  { _id: 'cat-2', name: 'T-Shirts', slug: 't-shirts', description: 'Casual tees', image: '' },
  { _id: 'cat-3', name: 'Outerwear', slug: 'outerwear', description: 'Jackets & layers', image: '' },
  { _id: 'cat-4', name: 'Streetwear', slug: 'streetwear', description: 'Urban essentials', image: '' },
  { _id: 'cat-5', name: 'Shoes', slug: 'shoes', description: 'Premium footwear', image: '' },
];

const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'p-shoe-1', name: 'Nike Air Force 1 \'07', slug: 'nike-air-force-1-07',
    description: 'The radiance lives on in the Nike Air Force 1 ’07, the b-ball icon that puts a fresh spin on what you know best.',
    price: 8990, compareAtPrice: 8990,
    category: MOCK_CATEGORIES[4], brand: 'Nike',
    variants: [
      { _id: 'v-s1-6', size: '6', color: 'White', colorHex: '#FFFFFF', stock: 5 },
      { _id: 'v-s1-7', size: '7', color: 'White', colorHex: '#FFFFFF', stock: 8 },
      { _id: 'v-s1-8', size: '8', color: 'White', colorHex: '#FFFFFF', stock: 15 },
      { _id: 'v-s1-9', size: '9', color: 'White', colorHex: '#FFFFFF', stock: 10 },
      { _id: 'v-s1-10', size: '10', color: 'White', colorHex: '#FFFFFF', stock: 4 },
    ],
    images: [
      { _id: 'i-s1', url: '/Af1.png', alt: 'Nike Air Force 1', isMain: true },
    ],
    averageRating: 4.9, numReviews: 124, featured: true, isActive: true,
    tags: ['sneakers', 'classic'],
  },
  {
    _id: 'p-shoe-2', name: 'Air Jordan 1 Retro High', slug: 'air-jordan-1-retro-high',
    description: 'Familiar but always fresh, the iconic Air Jordan 1 is remastered for today\'s sneakerhead culture.',
    price: 15990, compareAtPrice: 16500,
    category: MOCK_CATEGORIES[4], brand: 'Jordan',
    variants: [
      { _id: 'v-s3-6', size: '6', color: 'Bred', colorHex: '#ff0000', stock: 3 },
      { _id: 'v-s3-7', size: '7', color: 'Bred', colorHex: '#ff0000', stock: 5 },
      { _id: 'v-s3-8', size: '8', color: 'Bred', colorHex: '#ff0000', stock: 8 },
      { _id: 'v-s3-9', size: '9', color: 'Bred', colorHex: '#ff0000', stock: 5 },
      { _id: 'v-s3-10', size: '10', color: 'Bred', colorHex: '#ff0000', stock: 2 },
    ],
    images: [
      { _id: 'i-s2', url: '/Aj1.png', alt: 'Air Jordan 1 High', isMain: true },
    ],
    averageRating: 5.0, numReviews: 89, featured: true, isActive: true,
    tags: ['sneakers', 'jordan'], discountPercentage: 3,
  },
  {
    _id: 'p-shoe-3', name: 'Adidas Superstar', slug: 'adidas-superstar',
    description: 'Originally made for basketball courts in the \'70s. Championed by hip hop royalty in the \'80s. The adidas Superstar shoe is now a lifestyle staple for streetwear enthusiasts.',
    price: 7990, compareAtPrice: 8500,
    category: MOCK_CATEGORIES[4], brand: 'Adidas',
    variants: [
      { _id: 'v-s5-6', size: '6', color: 'White/Black', colorHex: '#FFFFFF', stock: 10 },
      { _id: 'v-s5-7', size: '7', color: 'White/Black', colorHex: '#FFFFFF', stock: 15 },
      { _id: 'v-s5-8', size: '8', color: 'White/Black', colorHex: '#FFFFFF', stock: 20 },
      { _id: 'v-s5-9', size: '9', color: 'White/Black', colorHex: '#FFFFFF', stock: 12 },
      { _id: 'v-s5-10', size: '10', color: 'White/Black', colorHex: '#FFFFFF', stock: 8 },
    ],
    images: [
      { _id: 'i-s3', url: '/superstar.png', alt: 'Adidas Superstar', isMain: true },
    ],
    averageRating: 4.7, numReviews: 156, featured: false, isActive: true,
    tags: ['sneakers', 'classic', 'adidas'], discountPercentage: 6,
  },
  {
    _id: 'p-shoe-4', name: 'Converse Chuck 70', slug: 'converse-chuck-70',
    description: 'The Chuck 70 mixes the best details from the ’70s-era Chuck with impeccable craftsmanship and premium materials.',
    price: 6590, compareAtPrice: 6590,
    category: MOCK_CATEGORIES[4], brand: 'Converse',
    variants: [
      { _id: 'v-s7-6', size: '6', color: 'Parchment', colorHex: '#f1e8d9', stock: 15 },
      { _id: 'v-s7-7', size: '7', color: 'Parchment', colorHex: '#f1e8d9', stock: 20 },
      { _id: 'v-s7-8', size: '8', color: 'Parchment', colorHex: '#f1e8d9', stock: 30 },
      { _id: 'v-s7-9', size: '9', color: 'Parchment', colorHex: '#f1e8d9', stock: 25 },
      { _id: 'v-s7-10', size: '10', color: 'Parchment', colorHex: '#f1e8d9', stock: 22 },
    ],
    images: [
      { _id: 'i-s4', url: '/converce.png', alt: 'Converse Chuck 70', isMain: true },
    ],
    averageRating: 4.8, numReviews: 210, featured: true, isActive: true,
    tags: ['sneakers', 'canvas', 'converse'],
  },
  {
    _id: 'p1', name: 'Oxford Button-Down Shirt', slug: 'oxford-button-down-shirt',
    description: 'A timeless oxford weave button-down crafted from premium Egyptian cotton.',
    price: 4990, compareAtPrice: 6500,
    category: MOCK_CATEGORIES[0], brand: 'AVREN',
    variants: [
      { _id: 'v1s', size: 'S', color: 'White', colorHex: '#FFFFFF', stock: 10 },
      { _id: 'v1m', size: 'M', color: 'White', colorHex: '#FFFFFF', stock: 12 },
      { _id: 'v1l', size: 'L', color: 'White', colorHex: '#FFFFFF', stock: 8 },
      { _id: 'v1xl', size: 'XL', color: 'White', colorHex: '#FFFFFF', stock: 5 },
      { _id: 'v1xxl', size: 'XXL', color: 'White', colorHex: '#FFFFFF', stock: 3 },
      { _id: 'v3s', size: 'S', color: 'Navy', colorHex: '#1a1a2e', stock: 4 },
      { _id: 'v3m', size: 'M', color: 'Navy', colorHex: '#1a1a2e', stock: 5 },
      { _id: 'v3l', size: 'L', color: 'Navy', colorHex: '#1a1a2e', stock: 3 },
    ],
    images: [
      { _id: 'i1', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=776&auto=format&fit=crop', alt: 'Oxford Shirt', isMain: true },
      { _id: 'i1b', url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=774&auto=format&fit=crop', alt: 'Oxford Shirt Back', isMain: false },
    ],
    averageRating: 4.7, numReviews: 34, featured: true, isActive: true,
    tags: ['formal', 'cotton'], discountPercentage: 23,
  },
  {
    _id: 'p2', name: 'Heavyweight Essential Tee', slug: 'heavyweight-essential-tee',
    description: 'A 280gsm heavyweight cotton t-shirt with a relaxed, boxy silhouette.',
    price: 2490, compareAtPrice: 2490,
    category: MOCK_CATEGORIES[1], brand: 'AVREN',
    variants: [
      { _id: 'v4', size: 'S', color: 'Black', colorHex: '#0a0a0a', stock: 20 },
      { _id: 'v5', size: 'M', color: 'Black', colorHex: '#0a0a0a', stock: 15 },
      { _id: 'v6', size: 'L', color: 'Black', colorHex: '#0a0a0a', stock: 10 },
      { _id: 'v6xl', size: 'XL', color: 'Black', colorHex: '#0a0a0a', stock: 8 },
      { _id: 'v6xxl', size: 'XXL', color: 'Black', colorHex: '#0a0a0a', stock: 5 },
    ],
    images: [
      { _id: 'i2', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=780&auto=format&fit=crop', alt: 'Black Tee', isMain: true },
      { _id: 'i2b', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=830&auto=format&fit=crop', alt: 'Black Tee Alt', isMain: false },
    ],
    averageRating: 4.9, numReviews: 87, featured: true, isActive: true,
    tags: ['casual', 'essential'],
  },
  {
    _id: 'p3', name: 'Linen Camp Collar Shirt', slug: 'linen-camp-collar-shirt',
    description: 'A breezy camp-collar shirt in premium European linen. Perfect for warm evenings.',
    price: 5990, compareAtPrice: 7500,
    category: MOCK_CATEGORIES[0], brand: 'AVREN',
    variants: [
      { _id: 'v7s', size: 'S', color: 'Beige', colorHex: '#d4c5a9', stock: 5 },
      { _id: 'v7', size: 'M', color: 'Beige', colorHex: '#d4c5a9', stock: 6 },
      { _id: 'v8', size: 'L', color: 'Beige', colorHex: '#d4c5a9', stock: 4 },
      { _id: 'v8xl', size: 'XL', color: 'Beige', colorHex: '#d4c5a9', stock: 3 },
      { _id: 'v8xxl', size: 'XXL', color: 'Beige', colorHex: '#d4c5a9', stock: 2 },
    ],
    images: [
      { _id: 'i3', url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=725&auto=format&fit=crop', alt: 'Linen Shirt', isMain: true },
      { _id: 'i3b', url: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?q=80&w=774&auto=format&fit=crop', alt: 'Linen Shirt Alt', isMain: false },
    ],
    averageRating: 4.5, numReviews: 21, featured: false, isActive: true,
    tags: ['linen', 'summer'], discountPercentage: 20,
  },
  {
    _id: 'p4', name: 'Oversized Graphic Tee', slug: 'oversized-graphic-tee',
    description: 'Heavy-cotton oversized tee with a minimal front graphic print.',
    price: 2990, compareAtPrice: 3500,
    category: MOCK_CATEGORIES[1], brand: 'AVREN',
    variants: [
      { _id: 'v9s', size: 'S', color: 'Off-White', colorHex: '#f5f0eb', stock: 10 },
      { _id: 'v9', size: 'M', color: 'Off-White', colorHex: '#f5f0eb', stock: 18 },
      { _id: 'v10', size: 'L', color: 'Off-White', colorHex: '#f5f0eb', stock: 12 },
      { _id: 'v11', size: 'XL', color: 'Off-White', colorHex: '#f5f0eb', stock: 7 },
      { _id: 'v11xxl', size: 'XXL', color: 'Off-White', colorHex: '#f5f0eb', stock: 4 },
    ],
    images: [
      { _id: 'i4', url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=774&auto=format&fit=crop', alt: 'Graphic Tee', isMain: true },
      { _id: 'i4b', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=764&auto=format&fit=crop', alt: 'Graphic Tee Alt', isMain: false },
    ],
    averageRating: 4.6, numReviews: 53, featured: true, isActive: true,
    tags: ['streetwear', 'graphic'], discountPercentage: 14,
  },
  {
    _id: 'p5', name: 'Slim Fit Navy  Shirt', slug: 'slim-fit-navy-shirt',
    description: 'A tailored-fit dress shirt in midnight navy with French seams and mother-of-pearl buttons.',
    price: 5490, compareAtPrice: 5490,
    category: MOCK_CATEGORIES[0], brand: 'AVREN',
    variants: [
      { _id: 'v12', size: 'S', color: 'Navy', colorHex: '#0d1b2a', stock: 9 },
      { _id: 'v13', size: 'M', color: 'Navy', colorHex: '#0d1b2a', stock: 14 },
      { _id: 'v14', size: 'L', color: 'Navy', colorHex: '#0d1b2a', stock: 6 },
      { _id: 'v14xl', size: 'XL', color: 'Navy', colorHex: '#0d1b2a', stock: 4 },
      { _id: 'v14xxl', size: 'XXL', color: 'Navy', colorHex: '#0d1b2a', stock: 2 },
    ],
    images: [
      { _id: 'i5', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=770&auto=format&fit=crop', alt: 'Navy Dress Shirt', isMain: true },
      { _id: 'i5b', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=780&auto=format&fit=crop', alt: 'Navy Dress Shirt Alt', isMain: false },
    ],
    averageRating: 4.8, numReviews: 42, featured: false, isActive: true,
    tags: ['formal', 'slim-fit'],
  },
  {
    _id: 'p6', name: 'Washed Cotton Pocket Tee', slug: 'washed-cotton-pocket-tee',
    description: 'Garment-dyed pocket tee in a vintage wash. Lived-in softness from day one.',
    price: 1990, compareAtPrice: 2500,
    category: MOCK_CATEGORIES[1], brand: 'AVREN',
    variants: [
      { _id: 'v15s', size: 'S', color: 'Sage', colorHex: '#9caf88', stock: 10 },
      { _id: 'v15', size: 'M', color: 'Sage', colorHex: '#9caf88', stock: 22 },
      { _id: 'v16', size: 'L', color: 'Sage', colorHex: '#9caf88', stock: 16 },
      { _id: 'v17s', size: 'S', color: 'Clay', colorHex: '#b85c38', stock: 5 },
      { _id: 'v17', size: 'M', color: 'Clay', colorHex: '#b85c38', stock: 11 },
      { _id: 'v17l', size: 'L', color: 'Clay', colorHex: '#b85c38', stock: 8 },
    ],
    images: [
      { _id: 'i6', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=654&auto=format&fit=crop', alt: 'Pocket Tee', isMain: true },
      { _id: 'i6b', url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=769&auto=format&fit=crop', alt: 'Pocket Tee Alt', isMain: false },
    ],
    averageRating: 4.4, numReviews: 67, featured: false, isActive: true,
    tags: ['casual', 'washed'], discountPercentage: 20,
  },
  {
    _id: 'p8', name: 'Acid Wash Drop Shoulder Tee', slug: 'acid-wash-drop-shoulder-tee',
    description: 'An acid-washed, drop-shoulder tee with raw hems. Peak streetwear energy.',
    price: 3490, compareAtPrice: 3490,
    category: MOCK_CATEGORIES[1], brand: 'AVREN',
    variants: [
      { _id: 'v20s', size: 'S', color: 'Charcoal', colorHex: '#36454F', stock: 8 },
      { _id: 'v20', size: 'M', color: 'Charcoal', colorHex: '#36454F', stock: 14 },
      { _id: 'v21', size: 'L', color: 'Charcoal', colorHex: '#36454F', stock: 9 },
      { _id: 'v22', size: 'XL', color: 'Charcoal', colorHex: '#36454F', stock: 4 },
      { _id: 'v22xxl', size: 'XXL', color: 'Charcoal', colorHex: '#36454F', stock: 2 },
    ],
    images: [
      { _id: 'i8', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=774&auto=format&fit=crop', alt: 'Acid Wash Tee', isMain: true },
      { _id: 'i8b', url: 'https://images.unsplash.com/photo-1523381294911-8d3cead13b03?q=80&w=770&auto=format&fit=crop', alt: 'Acid Wash Tee Alt', isMain: false },
    ],
    averageRating: 4.3, numReviews: 38, featured: false, isActive: true,
    tags: ['streetwear', 'acid-wash'],
  },
  {
    _id: 'p9', name: 'Mandarin Collar Henley', slug: 'mandarin-collar-henley',
    description: 'A streamlined henley with mandarin collar and tortoiseshell buttons. Crafted in Supima cotton.',
    price: 3990, compareAtPrice: 4990,
    category: MOCK_CATEGORIES[0], brand: 'AVREN',
    variants: [
      { _id: 'v23', size: 'S', color: 'Olive', colorHex: '#556b2f', stock: 8 },
      { _id: 'v24', size: 'M', color: 'Olive', colorHex: '#556b2f', stock: 11 },
    ],
    images: [
      { _id: 'i9', url: 'https://images.unsplash.com/photo-1620806815344-9dc3abdf13a4?q=80&w=774&auto=format&fit=crop', alt: 'Henley Shirt', isMain: true },
      { _id: 'i9b', url: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=774&auto=format&fit=crop', alt: 'Henley Shirt Alt', isMain: false },
    ],
    averageRating: 4.6, numReviews: 28, featured: false, isActive: true,
    tags: ['casual', 'henley'], discountPercentage: 20,
  },
];

// ── Component ───────────────────────────────────────────────────────────────
export default function ProductList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const defaultVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
    
    if (defaultVariant) {
      addItem({
        product: product,
        name: product.name,
        image: product.images[0]?.url || '',
        price: product.price,
        size: defaultVariant.size,
        color: defaultVariant.color,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`);
    } else {
      addItem({
        product: product,
        name: product.name,
        image: product.images[0]?.url || '',
        price: product.price,
        size: 'OS',
        color: 'Default',
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`);
    }
  };

  const categoryStr = searchParams.get('category') || '';
  const searchStr = searchParams.get('search') || '';
  const sortStr = searchParams.get('sort') || '-createdAt';

  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories — fallback to mock
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await api.get('/categories');
        return res.data.data.categories as Category[];
      } catch {
        return MOCK_CATEGORIES;
      }
    },
  });

  const catId = categories?.find(c => c.name === categoryStr)?._id;

  // Fetch products — fallback to mock
  const { data, isLoading } = useQuery({
    queryKey: ['products', catId, searchStr, sortStr],
    queryFn: async () => {
      try {
        let url = `/products?sort=${sortStr}`;
        if (catId) url += `&category=${catId}`;
        if (searchStr) url += `&search=${searchStr}`;

        const res = await api.get(url);
        const products = res.data.data.products as Product[];
        return products.length > 0 ? products : MOCK_PRODUCTS;
      } catch {
        // Backend not running — use mock data
        let filtered = [...MOCK_PRODUCTS];

        // Filter by category
        if (categoryStr) {
          filtered = filtered.filter(p => p.category.name === categoryStr);
        }

        // Filter by search
        if (searchStr) {
          const q = searchStr.toLowerCase();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          );
        }

        // Sort
        if (sortStr === 'price') filtered.sort((a, b) => a.price - b.price);
        else if (sortStr === '-price') filtered.sort((a, b) => b.price - a.price);
        else if (sortStr === '-averageRating') filtered.sort((a, b) => b.averageRating - a.averageRating);

        return filtered;
      }
    },
  });

  const handleCategoryChange = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (name === categoryStr) {
      params.delete('category');
    } else {
      params.set('category', name);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/products?${params.toString()}`);
  };

  // Star rating renderer
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className="lg:w-1/4">
        <div className="flex lg:hidden justify-between items-center mb-4">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          <div className="text-sm text-muted-foreground">{data?.length || 0} Products</div>
        </div>

        <div className={`space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div>
            <h3 className="font-heading font-medium uppercase tracking-wider mb-4 pb-2 border-b border-border">Categories</h3>
            <ul className="space-y-3">
              {(categories || MOCK_CATEGORIES).map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`text-sm uppercase tracking-wide hover:text-accent transition-colors ${categoryStr === cat.name ? 'font-bold text-accent' : 'text-muted-foreground'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-medium uppercase tracking-wider mb-4 pb-2 border-b border-border">Sort By</h3>
            <select
              value={sortStr}
              onChange={handleSortChange}
              className="w-full bg-transparent border border-input rounded-sm text-sm uppercase p-2 focus:ring-1 focus:ring-accent"
            >
              <option className="bg-background text-foreground" value="-createdAt">Newest</option>
              <option className="bg-background text-foreground" value="price">Price: Low to High</option>
              <option className="bg-background text-foreground" value="-price">Price: High to Low</option>
              <option className="bg-background text-foreground" value="-averageRating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="lg:w-3/4">
        <div className="hidden lg:flex justify-end items-center mb-6">
          <div className="text-sm text-muted-foreground uppercase tracking-wider">{data?.length || 0} Products</div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="space-y-4">
                <div className="aspect-[3/4] bg-muted animate-pulse rounded-sm" />
                <div className="h-4 w-2/3 bg-muted animate-pulse" />
                <div className="h-4 w-1/3 bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : data?.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-heading uppercase mb-2">No products found</h2>
            <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
            <Button
              variant="outline"
              className="mt-6 rounded-none uppercase tracking-widest"
              onClick={() => router.push('/products')}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {data?.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group cursor-pointer flex flex-col"
              >
                <Link href={`/products/${product.slug}`} className="flex-1">
                  <div className="relative aspect-[3/4] mb-4 bg-muted overflow-hidden">
                    <img
                      src={product.images[0]?.url || 'https://via.placeholder.com/400x500'}
                      alt={product.images[0]?.alt || product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <button 
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="absolute right-3 bottom-3 lg:bottom-4 lg:left-4 lg:right-4 bg-background/90 backdrop-blur-md text-foreground h-10 w-10 lg:w-auto lg:h-auto lg:py-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 hover:bg-foreground hover:text-background rounded-full lg:rounded-none z-10 border border-border lg:border-none"
                    >
                      <ShoppingBag className="h-4 w-4" /> 
                      <span className="hidden lg:block">Quick Add</span>
                    </button>
                  </div>
                  <div className="space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1">{product.category.name}</p>
                      <h3 className="font-heading font-medium tracking-wide uppercase text-sm line-clamp-2 leading-snug">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-sm">₹{product.price.toLocaleString()}</p>
                        {product.compareAtPrice > product.price && (
                          <p className="text-muted-foreground line-through text-xs">₹{product.compareAtPrice.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {renderStars(product.averageRating)}
                        <span className="text-[10px] text-muted-foreground">({product.numReviews})</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
