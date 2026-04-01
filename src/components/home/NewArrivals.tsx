'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cart-store';

const MOCK_FEATURED: Product[] = [
  {
    _id: 'f1', name: 'Heavyweight Essential Tee', slug: 'heavyweight-essential-tee',
    description: '280gsm heavyweight cotton t-shirt.', price: 2490, compareAtPrice: 2490,
    category: { _id: 'c1', name: 'T-Shirts', slug: 't-shirts', description: '', image: '' },
    brand: 'AVREN', averageRating: 4.9, numReviews: 87, featured: true, isActive: true,
    variants: [
      { _id: 'v1s', size: 'S', color: 'Black', colorHex: '#0a0a0a', stock: 10 },
      { _id: 'v1m', size: 'M', color: 'Black', colorHex: '#0a0a0a', stock: 15 },
      { _id: 'v1l', size: 'L', color: 'Black', colorHex: '#0a0a0a', stock: 12 },
      { _id: 'v1xl', size: 'XL', color: 'Black', colorHex: '#0a0a0a', stock: 8 },
      { _id: 'v1xxl', size: 'XXL', color: 'Black', colorHex: '#0a0a0a', stock: 5 },
    ],
    images: [
      { _id: 'i1', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=780&auto=format&fit=crop', isMain: true },
      { _id: 'i1b', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=830&auto=format&fit=crop', isMain: false },
    ],
  },
  {
    _id: 'f2', name: 'Oxford Button-Down Shirt', slug: 'oxford-button-down-shirt',
    description: 'Premium Egyptian cotton oxford.', price: 4990, compareAtPrice: 6500,
    category: { _id: 'c2', name: 'Shirts', slug: 'shirts', description: '', image: '' },
    brand: 'AVREN', averageRating: 4.7, numReviews: 34, featured: true, isActive: true,
    discountPercentage: 23,
    variants: [
      { _id: 'v2s', size: 'S', color: 'White', colorHex: '#fff', stock: 8 },
      { _id: 'v2m', size: 'M', color: 'White', colorHex: '#fff', stock: 12 },
      { _id: 'v2l', size: 'L', color: 'White', colorHex: '#fff', stock: 10 },
      { _id: 'v2xl', size: 'XL', color: 'White', colorHex: '#fff', stock: 6 },
      { _id: 'v2xxl', size: 'XXL', color: 'White', colorHex: '#fff', stock: 4 },
    ],
    images: [
      { _id: 'i2', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=776&auto=format&fit=crop', isMain: true },
      { _id: 'i2b', url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=774&auto=format&fit=crop', isMain: false },
    ],
  },
  {
    _id: 'f3', name: 'Oversized Graphic Tee', slug: 'oversized-graphic-tee',
    description: 'Heavy-cotton oversized tee.', price: 2990, compareAtPrice: 3500,
    category: { _id: 'c1', name: 'T-Shirts', slug: 't-shirts', description: '', image: '' },
    brand: 'AVREN', averageRating: 4.6, numReviews: 53, featured: true, isActive: true,
    discountPercentage: 14,
    variants: [
      { _id: 'v3s', size: 'S', color: 'Off-White', colorHex: '#f5f0eb', stock: 14 },
      { _id: 'v3m', size: 'M', color: 'Off-White', colorHex: '#f5f0eb', stock: 18 },
      { _id: 'v3l', size: 'L', color: 'Off-White', colorHex: '#f5f0eb', stock: 15 },
      { _id: 'v3xl', size: 'XL', color: 'Off-White', colorHex: '#f5f0eb', stock: 10 },
      { _id: 'v3xxl', size: 'XXL', color: 'Off-White', colorHex: '#f5f0eb', stock: 7 },
    ],
    images: [
      { _id: 'i3', url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=774&auto=format&fit=crop', isMain: true },
      { _id: 'i3b', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=764&auto=format&fit=crop', isMain: false },
    ],
  },
  {
    _id: 'f4', name: 'Premium Leather Loafers', slug: 'premium-leather-loafers',
    description: 'Handcrafted Italian leather loafers.', price: 12990, compareAtPrice: 15000,
    category: { _id: 'c3', name: 'Shoes', slug: 'shoes', description: '', image: '' },
    brand: 'AVREN', averageRating: 4.8, numReviews: 26, featured: true, isActive: true,
    variants: [
      { _id: 'v4-6', size: '6', color: 'Tan', colorHex: '#a0522d', stock: 5 },
      { _id: 'v4-7', size: '7', color: 'Tan', colorHex: '#a0522d', stock: 8 },
      { _id: 'v4-8', size: '8', color: 'Tan', colorHex: '#a0522d', stock: 12 },
      { _id: 'v4-9', size: '9', color: 'Tan', colorHex: '#a0522d', stock: 7 },
      { _id: 'v4-10', size: '10', color: 'Tan', colorHex: '#a0522d', stock: 4 },
    ],
    images: [
      { _id: 'i4', url: 'https://images.unsplash.com/photo-1533274033373-8bc3f208170c?q=80&w=774&auto=format&fit=crop', isMain: true },
      { _id: 'i4b', url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=764&auto=format&fit=crop', isMain: false },
    ],
  },

];

export function NewArrivals() {
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

  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      try {
        const res = await api.get('/products/featured?limit=4');
        const products = res.data.data.products as Product[];
        return products.length > 0 ? products : MOCK_FEATURED;
      } catch {
        return MOCK_FEATURED;
      }
    },
  });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 flex justify-between items-end border-b border-border pb-6">
          <h2 className="font-heading text-4xl uppercase tracking-tighter">New Arrivals</h2>
          <Link href="/products" className="hidden md:block uppercase text-sm tracking-wider font-medium hover:text-accent">
            Shop All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-4">
                <div className="aspect-[3/4] bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-2/3 bg-muted animate-pulse" />
                <div className="h-4 w-1/3 bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-[3/4] mb-4 bg-muted overflow-hidden">
                    {/* Main Image */}
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
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{product.category.name}</p>
                    <h3 className="font-medium text-base truncate">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">₹{product.price}</p>
                      {product.compareAtPrice > product.price && (
                        <p className="text-muted-foreground line-through text-xs">₹{product.compareAtPrice}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
