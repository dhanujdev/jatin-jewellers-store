import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/products';

// Format price to Indian Rupees
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

// Generate a random price between min and max
function generateRandomPrice(min: number = 15000, max: number = 250000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function FeaturedProducts() {
  // Get 8 featured products from our dataset
  const featuredProducts = getFeaturedProducts(8).map(product => ({
    id: product.id,
    name: product.title,
    price: generateRandomPrice(), // Generate a random price since our dataset doesn't have prices
    image: product.imagePath,
    category: product.category,
    slug: product.id,
  }));

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair text-gray-800 mb-3">
            Bestsellers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular lab-grown diamond jewelry pieces, crafted with precision and elegance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              href={`/product/${product.category}/${product.slug}`}
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-gray-800 font-medium mb-1 group-hover:text-gold-dark transition-colors">
                  {product.name}
                </h3>
                <p className="text-gold font-semibold">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/collections/bestsellers"
            className="inline-block bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded transition-colors"
          >
            View All Bestsellers
          </Link>
        </div>
      </div>
    </section>
  );
}
