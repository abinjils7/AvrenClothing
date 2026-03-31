import { Hero } from '@/components/home/Hero';
import { FeaturedGrid } from '@/components/home/FeaturedGrid';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { NewArrivals } from '@/components/home/NewArrivals';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedGrid />
      <CategoryShowcase />
      <NewArrivals />
    </div>
  );
}
