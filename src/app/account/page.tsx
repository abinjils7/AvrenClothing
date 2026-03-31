'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');

  // We should protect the route properly
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data.data.user;
    },
    enabled: isAuthenticated,
  });

  const { data: orders } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data.data.orders;
    },
    enabled: isAuthenticated && activeTab === 'orders',
  });

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || !profile) return null;

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="font-heading text-4xl uppercase mb-10 tracking-tighter">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="md:col-span-3 space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-widest flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-muted border-l-4 border-foreground' : 'hover:bg-muted/50 border-l-4 border-transparent'}`}
            >
              <User className="h-4 w-4" /> Profile
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-widest flex items-center gap-3 transition-colors ${activeTab === 'orders' ? 'bg-muted border-l-4 border-foreground' : 'hover:bg-muted/50 border-l-4 border-transparent'}`}
            >
              <Package className="h-4 w-4" /> Orders
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-widest flex items-center gap-3 transition-colors ${activeTab === 'wishlist' ? 'bg-muted border-l-4 border-foreground' : 'hover:bg-muted/50 border-l-4 border-transparent'}`}
            >
              <Heart className="h-4 w-4" /> Wishlist
            </button>
            
            {profile.role === 'admin' && (
               <Link href="/admin">
                <button className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-widest flex items-center gap-3 transition-colors hover:bg-muted/50 border-l-4 border-transparent text-accent`}>
                  <Settings className="h-4 w-4" /> Admin Panel
                </button>
              </Link>
            )}

            <button 
              onClick={handleLogout}
              className={`w-full mt-8 text-left px-4 py-3 text-sm font-bold uppercase tracking-widest flex items-center gap-3 transition-colors text-destructive hover:bg-destructive/10`}
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-9">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-heading text-2xl uppercase tracking-tighter border-b border-border pb-4">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/50 border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Name</p>
                    <p className="font-medium text-lg">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                    <p className="font-medium text-lg">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Role</p>
                    <p className="font-medium inline-block px-2 py-1 bg-foreground text-background text-xs uppercase">{profile.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
                    <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-heading text-2xl uppercase tracking-tighter border-b border-border pb-4">Order History</h2>
                {!orders || orders.length === 0 ? (
                  <div className="p-8 text-center bg-muted/50 border border-border">
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                    <Link href="/products" className={cn(buttonVariants({ variant: "outline" }), "rounded-none uppercase tracking-widest")}>Shop Now</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order._id} className="p-6 border border-border hover:border-foreground/50 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                          <div>
                            <p className="font-medium uppercase">Order {order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs font-bold uppercase px-3 py-1 ${
                              order.status === 'delivered' ? 'bg-green-500/20 text-green-600' :
                              order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                              'bg-accent/20 text-accent'
                            }`}>
                              {order.status}
                            </span>
                            <p className="font-bold">₹{order.totalPrice}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto">
                           {order.items.slice(0, 4).map((item: any, i: number) => (
                             <img key={i} src={item.image} alt={item.name} className="w-12 h-16 object-cover bg-muted border border-border" />
                           ))}
                           {order.items.length > 4 && (
                             <div className="w-12 h-16 bg-muted flex flex-col items-center justify-center text-xs text-muted-foreground">
                               +{order.items.length - 4}
                             </div>
                           )}
                           <Link href={`/account/orders/${order._id}`} className={cn(buttonVariants({ variant: "link", size: "sm" }), "ml-auto uppercase tracking-wider text-xs")}>View Details</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="font-heading text-2xl uppercase tracking-tighter border-b border-border pb-4">Wishlist ({profile.wishlist?.length || 0})</h2>
                {!profile.wishlist || profile.wishlist.length === 0 ? (
                  <div className="p-8 text-center bg-muted/50 border border-border">
                    <p className="text-muted-foreground">Your wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.wishlist.map((item: any) => (
                      <Link key={item._id} href={`/products/${item.slug}`} className="group relative">
                        <div className="aspect-[3/4] bg-muted mb-2 overflow-hidden">
                          <img src={item.images[0]?.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="font-medium text-sm truncate uppercase">{item.name}</h3>
                        <p className="font-bold text-sm">₹{item.price}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
