'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const FEATURES = [
  {
    id: 1,
    title: 'The Summit Series',
    subtitle: 'High Altitude Gear',
    image: 'https://images.unsplash.com/photo-1622290291468-b3281177afcc?q=80&w=1974&auto=format&fit=crop',
    size: 'col-span-1 md:col-span-2 row-span-2',
    link: '/products?category=Streetwear'
  },
  {
    id: 2,
    title: 'Urban Exploration',
    subtitle: 'City Essentials',
    image: 'https://images.unsplash.com/photo-1510aa2dc2625-3949df2fafe8?q=80&w=1969&auto=format&fit=crop',
    size: 'col-span-1 row-span-1',
    link: '/products?category=Essentials'
  },
  {
    id: 3,
    title: 'Base Station',
    subtitle: 'Durable Footwear',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop',
    size: 'col-span-1 row-span-1',
    link: '/products?category=Footwear'
  }
];

export function FeaturedGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 flex justify-between items-end">
          <h2 className="font-heading text-4xl md:text-6xl uppercase tracking-tighter">Featured <br/> <span className="text-muted-foreground">Collections</span></h2>
          <Link href="/products" className="uppercase text-sm tracking-wider font-medium hover:text-accent hidden md:block border-b border-foreground pb-1">
            View All Series
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 auto-rows-[300px] md:auto-rows-[400px] gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative group overflow-hidden bg-muted ${feature.size}`}
            >
              <Link href={feature.link} className="block w-full h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${feature.image})` }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white/80 uppercase tracking-widest text-xs font-semibold mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {feature.subtitle}
                  </p>
                  <h3 className="font-heading text-3xl md:text-4xl uppercase tracking-tighter text-white">
                    {feature.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
