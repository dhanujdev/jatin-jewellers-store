import Link from 'next/link';
import Image from 'next/image';

// Define the categories with updated images and styling
const categories = [
  {
    id: 'rings',
    name: 'Rings',
    description: 'Elegant solitaires and statement pieces',
    image: '/products/rings/rings-005/image.jpg',
    link: '/category/rings',
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    description: 'Timeless pendants and chains',
    image: '/products/necklaces/necklaces-010/image.jpg',
    link: '/category/necklaces',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    description: 'Stunning studs and drops',
    image: '/products/earrings/earrings-015/image.jpg',
    link: '/category/earrings',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    description: 'Elegant bangles and tennis bracelets',
    image: '/products/bangles/bangles-001/image.jpg',
    link: '/category/bracelets',
  },
];

export default function CategorySection() {
  return (
    <section 
      className="py-16 md:py-24 bg-white text-center"
      role="region"
      aria-label="Product Categories"
    >
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          Shop by Category
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
          Explore our curated collections of fine diamond jewelry for every occasion
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={category.link}
              className="group relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 w-full p-4 text-center">
                  <h3 className="text-xl font-playfair text-white">{category.name}</h3>
                  <p className="text-sm text-white/80 mt-1">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
