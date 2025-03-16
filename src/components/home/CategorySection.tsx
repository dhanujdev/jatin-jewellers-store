import Link from 'next/link';
import Image from 'next/image';

// Define the categories with updated images and styling
const categories = [
  {
    id: 'rings',
    name: 'Rings',
    description: 'Elegant solitaires and statement pieces',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/category/rings',
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    description: 'Timeless pendants and chains',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/category/necklaces',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    description: 'Stunning studs and drops',
    image: 'https://images.unsplash.com/photo-1687460854760-5dd33f10c7ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/category/earrings',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    description: 'Elegant bangles and tennis bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/category/bracelets',
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">
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
              className="category-card group"
            >
              <div className="category-card-image">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              </div>
              <div className="category-card-content">
                <h3 className="text-xl md:text-2xl font-medium mb-1 text-white">
                  {category.name}
                </h3>
                <p className="text-white/90 text-sm md:text-base">
                  {category.description}
                </p>
                <span className="mt-4 inline-block text-white border-b border-white/70 pb-0.5 text-sm group-hover:border-white transition-colors">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 md:mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="collection-feature relative h-[400px] md:h-[500px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1601821765780-754fa98637c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Wedding Collection"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black-gradient"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-medium mb-2 text-white">Wedding Collection</h3>
                <p className="text-white/90 mb-4 max-w-md">Timeless pieces for your special day and beyond</p>
                <Link href="/collections/wedding" className="inline-block bg-white text-black px-6 py-2 hover:bg-gold hover:text-white transition-colors">
                  Explore Collection
                </Link>
              </div>
            </div>
            
            <div className="collection-feature relative h-[400px] md:h-[500px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1589674781759-c21c37956a44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Bespoke Collection"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black-gradient"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-medium mb-2 text-white">Bespoke Collection</h3>
                <p className="text-white/90 mb-4 max-w-md">Custom-designed jewelry for your unique style</p>
                <Link href="/collections/bespoke" className="inline-block bg-white text-black px-6 py-2 hover:bg-gold hover:text-white transition-colors">
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
