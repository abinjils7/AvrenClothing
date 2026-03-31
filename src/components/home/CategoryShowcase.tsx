'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Men', image: '/image.png', comingSoon: false },
  { name: 'Outerwear', image: '/image copy 2.png', comingSoon: false },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', comingSoon: false },
  { name: 'Accessories', image: '', comingSoon: true },
];

export function CategoryShowcase() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="font-heading text-4xl md:text-6xl uppercase tracking-tighter mb-12 text-center">Shop By <span className="text-muted-foreground">Category</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {cat.comingSoon ? (
                <div className="relative aspect-[3/4] overflow-hidden border border-dashed border-border flex items-center justify-center bg-muted/30">
                  <div className="text-center space-y-3">
                    <p className="font-heading text-3xl uppercase tracking-tighter text-muted-foreground/60">{cat.name}</p>
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground/40 border border-border/50 px-4 py-2 inline-block">
                      Coming Soon
                    </span>
                  </div>
                </div>
              ) : (
                <Link href={`/products?category=${cat.name}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: `url('${cat.image}')` }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                    <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-end">
                      <h3 className="font-heading text-3xl text-white uppercase tracking-tighter mix-blend-difference">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
