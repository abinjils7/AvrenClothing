'use client';

import { useCartStore } from '@/store/cart-store';
import { buttonVariants, Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, removeItem, updateQuantity, TotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-16 min-h-[70vh] flex flex-col items-center justify-center container mx-auto text-center px-4">
        <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mb-6">
          <ShoppingBagIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl uppercase mb-4 tracking-tighter">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Discover your next favorite gear.</p>
        <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "rounded-none uppercase tracking-widest px-8")}>Shop Collection</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="font-heading text-4xl md:text-5xl uppercase mb-10 tracking-tighter border-b border-border pb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-4 border-b border-border">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item, i) => (
              <motion.div 
                key={`${item.product._id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b border-border border-dashed"
              >
                <div className="col-span-1 md:col-span-6 flex gap-4">
                  <div className="w-24 h-32 bg-muted relative shrink-0">
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center space-y-2">
                    <h3 className="font-heading font-medium uppercase tracking-wide text-sm">{item.name}</h3>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product._id, item.size, item.color)}
                      className="text-xs text-muted-foreground flex items-center gap-1 hover:text-destructive w-fit transition-colors mt-2"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 mt-4 md:mt-0 md:text-center text-sm font-medium">
                   <span className="md:hidden text-muted-foreground text-xs uppercase mr-2">Price:</span>
                   ₹{item.price}
                </div>

                <div className="col-span-1 md:col-span-2 mt-2 md:mt-0 flex md:justify-center">
                  <div className="flex items-center border border-border h-10 w-24">
                    <button 
                      onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)} 
                      className="flex-1 flex justify-center hover:bg-muted transition-colors h-full items-center"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-medium font-mono text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)} 
                      className="flex-1 flex justify-center hover:bg-muted transition-colors h-full items-center"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 mt-2 md:mt-0 md:text-right font-bold text-base">
                   <span className="md:hidden text-muted-foreground text-xs uppercase mr-2 font-normal">Total:</span>
                   ₹{item.price * item.quantity}
                </div>
              </motion.div>
            ))}

            <div className="flex justify-between items-center pt-6">
              <Link href="/products" className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto text-muted-foreground hover:text-foreground hover:no-underline flex items-center gap-2")}>
                 <ArrowRight className="h-4 w-4 rotate-180" /> Continue Shopping
              </Link>
              <Button variant="ghost" onClick={clearCart} className="text-destructive hover:bg-destructive/10 hover:text-destructive text-sm uppercase">
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-muted p-8 sticky top-32">
              <h2 className="font-heading text-2xl uppercase tracking-tighter mb-6 border-b border-border/10 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="font-medium">₹{TotalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium uppercase text-accent tracking-widest text-xs">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-medium">₹{Math.round(TotalPrice * 0.18)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border/10 pt-6 mb-8 text-lg font-bold">
                <span className="uppercase tracking-wider">Total</span>
                <span>₹{TotalPrice + Math.round(TotalPrice * 0.18)}</span>
              </div>

              <Link href="/checkout" className={cn(buttonVariants(), "w-full h-14 rounded-none uppercase tracking-widest text-sm bg-foreground text-background hover:bg-foreground/90 font-bold flex items-center justify-between px-6 group")}>
                  <span>Checkout</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="mt-6 flex justify-center gap-4 text-muted-foreground">
                {/* Icons placeholder for secure checkout */}
                <p className="text-xs text-center uppercase tracking-widest">100% Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dummy icon to not clutter imports
function ShoppingBagIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
