'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, User, Heart, X } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';

const MENUS = [
  { name: 'Menswear', href: '/products?category=Men' },
  { name: 'Outerwear', href: '/products?category=Outerwear' },
  { name: 'Streetwear', href: '/products?category=Streetwear' },
  { name: 'New Arrivals', href: '/products?category=New Arrivals' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();
  const cartItemsCount = useCartStore((state) => state.TotalItems);
  const { isAuthenticated } = useAuthStore();

  const isHome = pathname === '/';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 border-b',
        isScrolled || !isHome
          ? 'bg-background/80 backdrop-blur-md border-border py-4'
          : 'bg-transparent border-transparent py-6 dark:text-white'
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger className="lg:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="font-heading text-2xl tracking-tighter uppercase text-left">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {MENUS.map((menu) => (
                  <SheetClose key={menu.name} className="text-left w-full">
                    <Link
                      href={menu.href}
                      className="block text-lg font-medium hover:text-accent transition-colors"
                    >
                      {menu.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-heading font-bold text-2xl tracking-tighter uppercase">
            AVREN
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {MENUS.map((menu) => (
            <Link
              key={menu.name}
              href={menu.href}
              className="text-sm font-medium uppercase tracking-wider hover:text-accent transition-colors"
            >
              {menu.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <ThemeToggle />

          <Link href="/account/wishlist" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          <Link href={isAuthenticated ? "/account" : "/login"}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
