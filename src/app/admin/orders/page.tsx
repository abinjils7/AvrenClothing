'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      // In a real app we would have an admin specific /orders/all route
      const res = await api.get('/orders');
      return res.data.data.orders;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.put(`/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    }
  });

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    // Rotating status logic for simple demo purposes
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    updateStatusMutation.mutate({ id: orderId, status: statuses[nextIndex] });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold uppercase tracking-tighter mb-1">Orders</h1>
        <p className="text-muted-foreground text-sm">Monitor and update customer orders.</p>
      </div>

      <div className="bg-card border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                 <tr>
                 <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                   <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                   Loading orders...
                 </td>
               </tr>
              ) : !orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground uppercase tracking-widest text-xs font-bold">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-bold tracking-wider text-muted-foreground">
                       {order.shippingAddress.fullName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ₹{order.totalPrice}
                    </td>
                    <td className="px-6 py-4">
                       <button 
                         onClick={() => handleStatusChange(order._id, order.status)}
                         disabled={updateStatusMutation.isPending}
                         className={`text-xs font-bold uppercase tracking-widest px-3 py-1 cursor-pointer transition-opacity hover:opacity-80 ${
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-600' :
                          order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                          'bg-accent/20 text-accent'
                        }`}
                        title="Click to cycle status"
                      >
                         {updateStatusMutation.isPending && updateStatusMutation.variables?.id === order._id ? 'UPDATING...' : order.status}
                       </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="sm" asChild className="uppercase tracking-widest text-xs">
                         <Link href={`/account/orders/${order._id}`}>
                           <ExternalLink className="h-3 w-3 mr-2" /> View
                         </Link>
                       </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
