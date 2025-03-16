import { getCategoryInfo, getProductsByCategory, Product, getAllProducts } from '@/lib/products';
import CategoryClient from './client';
import productsByCategory from '@/data/products-by-category.json';

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
  
  // Get ALL products for this category (not just the first page)
  const allCategoryProducts = (productsByCategory as any)[category] || [];
  
  // Format all products for display
  const formattedProducts = formatProductsForDisplay(allCategoryProducts);
  
  // Calculate pagination data for initial view
  const totalProducts = allCategoryProducts.length;
  const pageSize = 12;
  const totalPages = Math.ceil(totalProducts / pageSize);
  
  const paginationData = {
    currentPage: 1,
    totalPages,
    totalProducts,
    pageSize
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