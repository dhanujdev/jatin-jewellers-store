import { getCategories } from '@/lib/products';
import { getCategoriesFromFS, getProductsByCategoryFromFS } from '@/lib/server/products';
import type { Product } from '@/types/product';
import CategoryClient from './client';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

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
    // Use server-side function to get categories directly from the file system
    const categories = await getCategoriesFromFS();
    return categories.map((category: string) => ({
      category: category.toLowerCase(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Sort products based on sort parameter
function sortProducts(products: any[], sortBy: string = 'default') {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sortedProducts;
  }
}

export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: { category: string },
  searchParams: { page?: string, sort?: string }
}) {
  try {
    // Validate category exists
    const categories = await getCategoriesFromFS();
    if (!categories.map(c => c.toLowerCase()).includes(params.category.toLowerCase())) {
      notFound();
    }
    
    // Get products for this category using server-side function
    const products = await getProductsByCategoryFromFS(params.category);
    
    // Parse page number and handle invalid values
    const page = parseInt(searchParams.page || '1', 10);
    const sort = searchParams.sort || 'default';
    
    // Get category display name
    const categoryName = categoryDisplayNames[params.category] || 
      params.category.charAt(0).toUpperCase() + params.category.slice(1);
    
    // Format products for display
    const formattedProducts = formatProductsForDisplay(products);
    
    // Sort products
    const sortedProducts = sortProducts(formattedProducts, sort);
    
    // Calculate pagination data
    const pageSize = 12;
    const totalProducts = sortedProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
    
    // Ensure page is within valid range
    const validPage = Math.max(1, Math.min(page, totalPages));
    
    // Get products for current page
    const startIndex = (validPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
    
    const paginationData = {
      currentPage: validPage,
      totalPages,
      totalItems: totalProducts,
      pageSize
    };
    
    return (
      <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading category...</div>}>
        <CategoryClient
          categoryName={params.category}
          categoryDisplayName={categoryName}
          products={paginatedProducts}
          paginationData={paginationData}
          currentSort={sort}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    throw error; // Let Next.js error boundary handle it
  }
} 