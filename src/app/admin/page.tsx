'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

export default function AdminDashboard() {
  // Fetch high-level stats from backend. 
  // For a production app, we would ideally have a dedicated `/api/admin/stats` endpoint.
  // We'll mock the fetching behavior and render dummy stats if the endpoint fails/is absent.
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/stats');
        return res.data.data;
      } catch (e) {
        // Fallback dummy data if backend endpoint is not built yet
        return {
          totalRevenue: 1450000,
          totalOrders: 254,
          totalProducts: 48,
          totalUsers: 1205
        };
      }
    }
  });

  if (isLoading) return <div className="animate-pulse flex space-x-4">Loading dashboard data...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold uppercase tracking-tighter mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store's performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-card border border-border shadow-sm rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="h-4 w-4 text-accent" />
          </div>
          <div className="text-3xl font-heading font-bold">
            ₹{stats?.totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="p-6 bg-card border border-border shadow-sm rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-bold uppercase tracking-wider">Orders</span>
            <ShoppingCart className="h-4 w-4" />
          </div>
          <div className="text-3xl font-heading font-bold">
            {stats?.totalOrders}
          </div>
        </div>

        <div className="p-6 bg-card border border-border shadow-sm rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-bold uppercase tracking-wider">Products</span>
            <Package className="h-4 w-4" />
          </div>
          <div className="text-3xl font-heading font-bold">
            {stats?.totalProducts}
          </div>
        </div>

        <div className="p-6 bg-card border border-border shadow-sm rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-bold uppercase tracking-wider">Active Users</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="text-3xl font-heading font-bold">
            {stats?.totalUsers.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 pt-4">
        {/* Placeholder for charts/graphs */}
        <div className="col-span-4 border border-border bg-card p-6 min-h-[400px] flex items-center justify-center text-muted-foreground uppercase tracking-widest text-sm font-bold">
          Revenue Chart (Coming Soon)
        </div>
        <div className="col-span-3 border border-border bg-card p-6 min-h-[400px] flex items-center justify-center text-muted-foreground uppercase tracking-widest text-sm font-bold">
          Recent Activity (Coming Soon)
        </div>
      </div>
    </div>
  );
}
