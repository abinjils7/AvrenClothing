'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const ADMIN_MENUS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!mounted || !user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="font-heading font-bold text-xl uppercase flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ChevronLeft className="h-5 w-5" /> Back to Store
          </Link>
        </div>
        
        <div className="p-6 pb-2">
          <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-4">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {ADMIN_MENUS.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors uppercase tracking-wider",
                  isActive 
                    ? "bg-foreground text-background font-bold shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive hover:font-bold uppercase tracking-wider"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-muted/20">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 md:hidden">
          <span className="font-heading font-bold text-xl uppercase">Avren Admin</span>
        </header>
        
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
