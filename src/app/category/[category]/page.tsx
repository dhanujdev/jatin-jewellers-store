import { getCategoriesFromFS, getProductsByCategoryFromFS } from '@/lib/server/products';
import type { Product } from '@/types/product';
import CategoryClient from './client';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

// Enable Incremental Static Regeneration
export const revalidate = 3600; // Revalidate pages every hour

// Function to generate a random price between 10000 and 200000
function generateRandomPrice(): number {
  return Math.floor(Math.random() * (200000 - 10000 + 1)) + 10000;
}

// Function to format price with commas and currency symbol
function formatPrice(price: number): string {
  return `₹${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

// Format products for display
function formatProductsForDisplay(products: Product[]) {
  return products.map(product => {
    const price = generateRandomPrice();
    return {
      id: product.id,
      name: product.title,
      description: product.description || '',
      price,
      formattedPrice: formatPrice(price),
      image: `/products/${product.category}/${product.id}/image.jpg`,
      category: product.category,
      slug: product.id
    };
  });
}

// Category display names
const categoryDisplayNames: Record<string, string> = {
  rings: "Rings",
  earrings: "Earrings",
  necklaces: "Necklaces",
  bangles: "Bangles",
  waistbands: "Waistbands"
};

export async function generateStaticParams() {
  try {
    // Get all categories
    const categories = await getCategoriesFromFS();
    
    console.log(`Generating static params for ${categories.length} categories`);
    
    // Generate params for each category
    return categories.map(category => ({
      category: category.toLowerCase()
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

export default async function CategoryPage({ 
  params
}: { 
  params: { category: string }
}) {
  try {
    // Get category from params
    const category = params.category;
    
    // Validate category exists
    const categories = await getCategoriesFromFS();
    if (!categories.map(c => c.toLowerCase()).includes(category.toLowerCase())) {
      notFound();
    }
    
    // Get products for this category using server-side function
    const products = await getProductsByCategoryFromFS(category);
    
    // Get category display name
    const categoryName = categoryDisplayNames[category] || 
      category.charAt(0).toUpperCase() + category.slice(1);
    
    // Format products for display
    const formattedProducts = formatProductsForDisplay(products);
    
    // Pass all products to the client component and let it handle pagination and sorting
    return (
      <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading category...</div>}>
        <CategoryClient
          categoryName={category}
          categoryDisplayName={categoryName}
          products={formattedProducts}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    throw error; // Let Next.js error boundary handle it
  }
} 