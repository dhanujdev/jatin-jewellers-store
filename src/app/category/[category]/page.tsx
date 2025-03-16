import { getCategoryInfo, getProductsByCategory, Product, getAllProducts } from '@/lib/products';
import CategoryClient from './client';
import productsByCategory from '@/data/products-by-category.json';
import { Suspense } from 'react';

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
      image: product.imagePath,
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

export function generateStaticParams() {
  const categoryInfo = getCategoryInfo();
  
  return categoryInfo.categories.map((category: string) => ({
    category,
  }));
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
  // Await the parameters
  const { category } = await Promise.resolve(params);
  const page = parseInt(await Promise.resolve(searchParams.page || '1'), 10);
  const sort = await Promise.resolve(searchParams.sort || 'default');
  
  // Get category display name
  const categoryName = categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  
  // Get ALL products for this category
  const allCategoryProducts = (productsByCategory as any)[category] || [];
  
  // Format all products for display
  const formattedProducts = formatProductsForDisplay(allCategoryProducts);
  
  // Sort products
  const sortedProducts = sortProducts(formattedProducts, sort);
  
  // Calculate pagination data
  const pageSize = 12;
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  
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
        categoryName={category}
        categoryDisplayName={categoryName}
        products={paginatedProducts}
        paginationData={paginationData}
        currentSort={sort}
      />
    </Suspense>
  );
} 