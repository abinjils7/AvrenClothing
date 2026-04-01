'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartSubtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to login if not authenticated or empty cart
  if (!isAuthenticated && typeof window !== 'undefined') {
    router.push('/login');
    return null;
  }
  
  if (!mounted && typeof window !== 'undefined') return null;

  if (items.length === 0 && typeof window !== 'undefined') {
    router.push('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/orders', {
        shippingAddress,
        paymentMethod: 'COD', // Default to COD since user said "no payment rn"
      });

      clearCart();
      router.push(`/account/orders/${res.data.data.order._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  const tax = Math.round(cartSubtotal * 0.18);
  const shipping = cartSubtotal > 2000 ? 0 : 199;
  const total = cartSubtotal + tax + shipping;

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="font-heading text-4xl uppercase mb-10 tracking-tighter">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-4 mb-6 border border-destructive/20 uppercase tracking-wider font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl uppercase tracking-tighter mb-4 border-b border-border pb-2">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <Input required name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} className="h-12 border-border rounded-none" />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                    <Input required name="phone" value={shippingAddress.phone} onChange={handleInputChange} className="h-12 border-border rounded-none" />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Street Address</label>
                    <Input required name="street" value={shippingAddress.street} onChange={handleInputChange} className="h-12 border-border rounded-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</label>
                    <Input required name="city" value={shippingAddress.city} onChange={handleInputChange} className="h-12 border-border rounded-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State / Province</label>
                    <Input required name="state" value={shippingAddress.state} onChange={handleInputChange} className="h-12 border-border rounded-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ZIP / Postal Code</label>
                    <Input required name="zipCode" value={shippingAddress.zipCode} onChange={handleInputChange} className="h-12 border-border rounded-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Country</label>
                    <Input required name="country" value={shippingAddress.country} onChange={handleInputChange} disabled className="h-12 border-border rounded-none" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl uppercase tracking-tighter mb-4 border-b border-border pb-2">Payment</h2>
                <div className="bg-muted p-6 border border-border">
                  <p className="font-medium uppercase tracking-wider mb-2">Cash on Delivery (COD)</p>
                  <p className="text-sm text-muted-foreground">Pay with cash upon delivery. Online payments are currently unavailable.</p>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-14 rounded-none uppercase tracking-widest text-sm font-bold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-70">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Place Order — ₹${total}`}
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-muted p-8 sticky top-32 border border-border">
              <h2 className="font-heading text-2xl uppercase tracking-tighter mb-6 border-b border-border/10 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-20 bg-background relative shrink-0 border border-border/10">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-heading text-sm uppercase truncate font-medium">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.color} / {item.size}</p>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 py-4 border-y border-border/10 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>₹{tax}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold font-heading">
                <span className="uppercase tracking-wider">Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
