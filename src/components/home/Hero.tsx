'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HERO_IMAGES = ['/image.png', '/image copy.png', '/image copy 2.png'];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-black">
      {/* Crossfading Background Images */}
      {HERO_IMAGES.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 z-0 transition-opacity duration-[2s] ease-in-out"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        >
          <img
            src={src}
            alt={`AVREN Hero ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-[1]" />

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-8 text-black dark:text-white text-center md:text-left pt-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="mb-8"
        >
          <span className="text-xs tracking-[0.6em] uppercase text-black dark:text-white font-bold drop-shadow-sm">
            The Autumn / Winter Collection
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-6xl md:text-8xl lg:text-[10rem] font-bold uppercase tracking-widest leading-[0.85] mb-8"
        >
          A V R E N<br /> 
          <span className="text-black/80 dark:text-white/80 shrink-0 text-4xl md:text-6xl lg:text-7xl tracking-[0.2em] font-light mt-4 block">MENSWEAR</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center md:justify-start"
        >
          <Link href="/products?category=Men" className={cn(buttonVariants({ size: "lg" }), "rounded-none h-14 px-10 text-xs md:text-sm tracking-widest uppercase font-bold bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-colors shadow-2xl")}>
            Explore Collection
          </Link>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex gap-2 mt-10 justify-center md:justify-start">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-[3px] rounded-full transition-all duration-500",
                index === currentIndex 
                  ? "w-10 bg-black dark:bg-white" 
                  : "w-4 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
