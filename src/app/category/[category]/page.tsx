import Image from 'next/image';
import Link from 'next/link';
import { getProductsByCategory, getCategoryInfo } from '@/lib/products';
import { notFound } from 'next/navigation';

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

// Category display names
const categoryDisplayNames: Record<string, string> = {
  rings: "Rings",
  earrings: "Earrings",
  necklaces: "Necklaces",
  bangles: "Bangles",
  waistbands: "Waistbands"
};

// Generate static params for all categories
export function generateStaticParams() {
  const categoryInfo = getCategoryInfo();
  return categoryInfo.categories.map(category => ({
    category,
  }));
}

export default function CategoryPage({ params }: NextJS.PageProps) {
  const category = params?.category as string;
  const products = getProductsByCategory(category);
  
  if (!products.length) {
    notFound();
  }
  
  // Get display name for category
  const categoryName = categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  
  // Format products for display
  const formattedProducts = products.map(product => ({
    id: product.id,
    name: product.title,
    price: generateRandomPrice(),
    image: product.imagePath,
    category: product.category,
    slug: product.id,
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex text-sm">
          <li className="mr-2">
            <Link href="/" className="text-gray-500 hover:text-gold">
              Home
            </Link>
          </li>
          <li className="mx-2 text-gray-500">/</li>
          <li className="text-gray-800">{categoryName}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-playfair text-gray-800 mb-4">{categoryName}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of beautiful {categoryName.toLowerCase()} crafted with precision and elegance.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {formattedProducts.map((product) => (
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
    </div>
  );
} 