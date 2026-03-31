export const dynamicParams = true; // allow dynamic routes

import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `${params.slug.replace('-', ' ').toUpperCase()} | AVREN`,
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Pass the slug to the client component to fetch and manage state
  return <ProductDetailClient slug={params.slug} />;
}
