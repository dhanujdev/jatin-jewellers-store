import Link from 'next/link';
import Image from 'next/image';
import { getCategoryInfo } from '@/lib/products';

// Get category information from our dataset
const categoryInfo = getCategoryInfo();

// Map category names to display names and sample images
const categoryMap = {
  rings: {
    name: "Rings",
    image: "/products/rings/rings-001/image.jpg",
    link: "/category/rings",
  },
  earrings: {
    name: "Earrings",
    image: "/products/earrings/earrings-001/image.jpg",
    link: "/category/earrings",
  },
  necklaces: {
    name: "Necklaces",
    image: "/products/necklaces/necklaces-001/image.jpg",
    link: "/category/necklaces",
  },
  bangles: {
    name: "Bangles",
    image: "/products/bangles/bangles-001/image.jpg",
    link: "/category/bangles",
  },
  waistbands: {
    name: "Waistbands",
    image: "/products/waistbands/waistbands-001/image.jpg",
    link: "/category/waistbands",
  }
};

// Create categories array from our dataset categories
const categories = categoryInfo.categories.map(categoryId => categoryMap[categoryId as keyof typeof categoryMap]);

export default function CategorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair text-center mb-12 text-gray-800">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              href={category.link}
              key={category.name}
              className="group relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 w-full p-4 text-center">
                  <h3 className="text-xl font-playfair text-white">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
