'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types';

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', searchTerm],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: { search: searchTerm, limit: 50 }
      });
      return res.data.data.products as Product[];
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold uppercase tracking-tighter mb-1">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your inventory and catalog.</p>
        </div>
        <Button asChild className="rounded-none uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 font-bold h-12 px-6">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-card border border-border shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 border-border rounded-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground uppercase tracking-widest text-xs font-bold">
                    No products found.
                  </td>
                </tr>
              ) : (
                data?.map((product) => (
                  <tr key={product._id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-4">
                      <div className="h-12 w-10 bg-muted shrink-0 border border-border">
                        {product.images[0] && <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <Link href={`/products/${product.slug}`} className="hover:underline uppercase tracking-wide truncate max-w-[200px]">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 uppercase tracking-wider text-muted-foreground">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      {product.variants.reduce((acc, v) => acc + v.stock, 0) > 0 
                        ? <span className="text-green-600 dark:text-green-500 font-medium">In Stock</span>
                        : <span className="text-destructive font-bold uppercase tracking-widest text-[10px] px-2 py-1 bg-destructive/10">Out of stock</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-accent group">
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive group hover:bg-destructive/10">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
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
