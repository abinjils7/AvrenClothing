'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-heading font-bold text-2xl tracking-tighter uppercase mb-6 block">
              AVREN
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Never Stop Exploring. Premium streetwear and outdoor gear built for those who push boundaries.
            </p>
          </div>

          <div>
            <h3 className="font-heading uppercase font-bold mb-4 tracking-wider">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/products?category=Men" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Men's Apparel</Link></li>
              <li><Link href="/products?category=Outerwear" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Outerwear</Link></li>
              <li><Link href="/products?category=Streetwear" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Streetwear Collection</Link></li>
              <li><Link href="/products?category=Accessories" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Accessories</Link></li>
              <li><Link href="/products?category=New Arrivals" className="text-muted-foreground hover:text-accent text-sm transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading uppercase font-bold mb-4 tracking-wider">Help</h3>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Help Center</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Returns</Link></li>
              <li><Link href="/track-order" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading uppercase font-bold mb-4 tracking-wider">Join AVREN</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                required
              />
              <button 
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 uppercase tracking-wide"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} AVREN. All rights reserved. Designed for exploration.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
