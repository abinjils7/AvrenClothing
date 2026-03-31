import { Suspense } from 'react';
import ProductList from './ProductList';

export const metadata = {
  title: 'Shop All | AVREN',
  description: 'Explore the full AVREN collection.',
};

export default function ProductsPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-tighter mb-8 border-b border-border pb-6">
          The Collection
        </h1>
        <Suspense fallback={<div>Loading collection...</div>}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
}
