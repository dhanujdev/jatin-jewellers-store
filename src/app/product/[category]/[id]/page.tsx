import { getProductFromFS, getAllProductsFromFS } from '@/lib/server/products';
import { notFound } from 'next/navigation';
import ProductClient from './client';
import type { Product } from '@/types/product';

// Remove time-based revalidation - we'll use on-demand revalidation instead

// Function to generate a random price between 10000 and 200000
function generateRandomPrice(): number {
  return Math.floor(Math.random() * (200000 - 10000 + 1)) + 10000;
}

// Function to format price with commas and currency symbol
function formatPrice(price: number): string {
  return `₹${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

interface Material {
  name: string;
  description: string;
}

interface FormattedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  materials: Material[];
  slug: string;
}

// Define category display names
const categoryDisplayNames: Record<string, string> = {
  'rings': 'Rings',
  'necklaces': 'Necklaces',
  'earrings': 'Earrings',
  'bangles': 'Bangles',
  'waistbands': 'Waistbands',
};

// Format product for display
function formatProductForDisplay(product: Product): FormattedProduct {
  const price = generateRandomPrice();
  return {
    id: product.id,
    name: product.title,
    description: product.description || '',
    price,
    formattedPrice: formatPrice(price),
    image: `/products/${product.category}/${product.id}/image.jpg`,
    category: product.category,
    materials: product.materials.map((material) => {
      if (typeof material === 'string') {
        return {
          name: material,
          description: `High quality ${material}`
        };
      }
      return material as Material;
    }),
    slug: product.id
  };
}

export async function generateStaticParams() {
  try {
    // Get all products from file system
    const products = await getAllProductsFromFS();
    
    // Limit to a reasonable number (e.g., 100 most recent products)
    // This helps prevent build timeouts while still pre-rendering important pages
    const limitedProducts = products.slice(0, 100);
    
    console.log(`Generating static params for ${limitedProducts.length} products out of ${products.length} total`);
    
    // Generate params for each product
    return limitedProducts.map(product => ({
      category: product.category.toLowerCase(),
      id: product.id
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductPage({ 
  params: paramsPromise 
}: { 
  params: { category: string; id: string } 
}) {
  try {
    // Await the dynamic route parameters
    const params = await Promise.resolve(paramsPromise);
    const category = params.category;
    const id = params.id;
    
    // Get product from file system
    const maybeProduct = await getProductFromFS(category, id);
    
    // If product not found, show 404
    if (!maybeProduct) {
      notFound();
    }
    
    // Format product for display
    const formattedProduct = formatProductForDisplay(maybeProduct as Product);
    
    // Get related products (products from the same category)
    const allProducts = await getAllProductsFromFS();
    const relatedProducts = allProducts
      .filter(p => p.category === category && p.id !== id)
      .slice(0, 4)
      .map(formatProductForDisplay);
    
    // Get category display name
    const categoryDisplayName = categoryDisplayNames[category] || 
      category.charAt(0).toUpperCase() + category.slice(1);
    
    return (
      <ProductClient 
        product={formattedProduct} 
        relatedProducts={relatedProducts} 
        categoryDisplayName={categoryDisplayName}
      />
    );
  } catch (error) {
    console.error('Error in ProductPage:', error);
    throw error; // Let Next.js error boundary handle it
  }
} 