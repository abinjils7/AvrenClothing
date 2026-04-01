'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Star, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import api from '@/lib/api';
import { Product, Variant } from '@/types';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { addItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  // We don't have a useToast hook, let's implement a simple alert or shadcn generic toast soon. Wait, shadcn wasn't fully set up for toast. I'll use standard window.alert for now if missing, or build a simple state. Let's rely on standard UI feedback.

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data.data.product as Product;
    },
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Initialize selected variants when data loads
  if (product && !selectedColor && product.variants.length > 0) {
    setSelectedColor(product.variants[0].color);
  }

  // Get available sizes for the selected color
  const availableVariantsForColor = product?.variants.filter(v => v.color === selectedColor) || [];
  const uniqueColors = Array.from(new Set(product?.variants.map(v => v.color) || []));

  // Determine actual stock for selected variant
  const selectedVariant = product?.variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (selectedVariant && selectedVariant.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    setIsAdding(true);
    addItem({
      product: product,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    
    // Quick feedback
    setTimeout(() => {
      setIsAdding(false);
      // Optional: open cart drawer here
      toast.success(`${product.name} added to cart!`, {
        description: `${selectedColor} / ${selectedSize} (x${quantity})`,
      });
    }, 600);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please login to add to wishlist');
    try {
      await api.post(`/wishlist/${product?._id}`);
      toast.success('Wishlist updated!');
    } catch (e) {
      toast.error('Error updating wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-muted animate-pulse" />
        <div className="space-y-6 pt-10">
          <div className="h-10 w-3/4 bg-muted animate-pulse" />
          <div className="h-6 w-1/4 bg-muted animate-pulse" />
          <div className="h-24 w-full bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-16 min-h-[70vh] flex flex-col items-center justify-center container mx-auto text-center">
        <h1 className="font-heading text-4xl uppercase mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the product you're looking for.</p>
        <Link href="/products" className={buttonVariants()}>Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-foreground">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/products?category=${product.category.name}`} className="hover:text-foreground">{product.category.name}</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery Area */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 h-fit">
            <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-auto snap-x md:w-24 shrink-0">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    "aspect-[3/4] shrink-0 w-20 md:w-full border-2 transition-all overflow-hidden",
                    idx === selectedImageIndex ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="order-1 md:order-2 flex-grow aspect-[3/4] md:aspect-auto md:h-[80vh] relative bg-muted overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[selectedImageIndex]?.url}
                  alt={product.images[selectedImageIndex]?.alt || product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Info Area */}
          <div className="lg:col-span-5 flex flex-col space-y-8 sticky top-32 h-fit">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-medium">₹{product.price}</p>
                {product.compareAtPrice > product.price && (
                  <p className="text-muted-foreground text-lg line-through">₹{product.compareAtPrice}</p>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            {/* Form Area */}
            <div className="space-y-6 pt-4 border-t border-border">
              
              {/* Colors */}
              {uniqueColors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium uppercase tracking-wider">
                    <span>Color: </span>
                    <span className="text-muted-foreground">{selectedColor || 'Select'}</span>
                  </div>
                  <div className="flex gap-3">
                    {uniqueColors.map(color => {
                      const v = product.variants.find(v => v.color === color);
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedSize(''); // Reset size on color change
                          }}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 p-1 transition-all",
                            selectedColor === color ? "border-accent scale-110" : "border-transparent"
                          )}
                          title={color}
                        >
                          <span 
                            className="block w-full h-full rounded-full border border-black/10 dark:border-white/10" 
                            style={{ backgroundColor: v?.colorHex || '#000' }} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div className="space-y-3">
                <div className="flex justify-between flex-wrap text-sm font-medium uppercase tracking-wider">
                  <span>Size</span>
                  <button className="text-muted-foreground underline underline-offset-4 decoration-muted hover:text-foreground">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {availableVariantsForColor.map((variant) => (
                    <button
                      key={variant._id}
                      disabled={variant.stock === 0}
                      onClick={() => setSelectedSize(variant.size)}
                      className={cn(
                        "h-12 border uppercase text-xs sm:text-sm font-medium transition-all px-1",
                        selectedSize === variant.size 
                          ? "border-accent bg-accent text-accent-foreground dark:text-black font-bold" 
                          : "border-border hover:border-foreground/50",
                        variant.stock === 0 && "opacity-30 cursor-not-allowed strike-through relative after:absolute after:inset-0 after:border-t after:border-border after:top-1/2 after:origin-center after:rotate-[20deg]"
                      )}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="flex gap-4 pt-4">
                <div className="flex items-center border border-border h-14 w-32 shrink-0">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 flex justify-center hover:bg-muted transition-colors h-full items-center"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center font-medium font-mono">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="flex-1 flex justify-center hover:bg-muted transition-colors h-full items-center"><Plus className="h-4 w-4" /></button>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  disabled={!selectedSize || (selectedVariant?.stock === 0) || isAdding}
                  className="flex-1 h-14 rounded-none uppercase tracking-widest text-sm bg-foreground text-background hover:bg-foreground/90 font-bold"
                >
                  {isAdding ? 'Adding...' : selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add To Cart'}
                </Button>

                <Button variant="outline" size="icon" onClick={handleWishlist} className="h-14 w-14 rounded-none shrink-0 border-border">
                  <Heart className="h-5 w-5 hover:fill-accent hover:stroke-accent transition-colors" />
                </Button>
              </div>

              {/* Product Info Accordion Details */}
              <div className="space-y-4 pt-8 text-sm">
                {product.material && (
                  <div className="border-t border-border pt-4">
                    <h3 className="uppercase tracking-wider font-semibold mb-2 flex items-center justify-between">
                      Material <ChevronRight className="h-4 w-4 text-muted-foreground"/>
                    </h3>
                    <p className="text-muted-foreground">{product.material}</p>
                  </div>
                )}
                {product.careInstructions && (
                  <div className="border-t border-border pt-4">
                    <h3 className="uppercase tracking-wider font-semibold mb-2 flex items-center justify-between">
                      Care <ChevronRight className="h-4 w-4 text-muted-foreground"/>
                    </h3>
                    <p className="text-muted-foreground">{product.careInstructions}</p>
                  </div>
                )}
                <div className="border-t border-border pt-4">
                   <p className="uppercase tracking-wider font-semibold mb-2 flex items-center justify-between">
                      Shipping & Returns <ChevronRight className="h-4 w-4 text-muted-foreground"/>
                   </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
