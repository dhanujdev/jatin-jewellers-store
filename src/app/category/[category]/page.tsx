import { getCategoryInfo, getProductsByCategory, Product } from '@/lib/products';
import CategoryClient from './client';

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

export default function CategoryPage({ 
  params
}: { 
  params: { category: string }
}) {
  const { category } = params;
  
  // Get category display name
  const categoryName = categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  
  // Get products for this category
  const productsResult = getProductsByCategory(category);
  let products = productsResult.data;
  
  // Format all products for display
  const formattedProducts = formatProductsForDisplay(products);
  
  // Calculate pagination data for initial view
  const totalProducts = productsResult.pagination.total;
  const totalPages = productsResult.pagination.pageCount;
  
  const paginationData = {
    currentPage: 1,
    totalPages,
    totalProducts,
    pageSize: 12
  };
  
  return (
    <CategoryClient
      categoryName={categoryName}
      allProducts={formattedProducts}
      paginationData={paginationData}
      currentSort="default"
    />
  );
} 