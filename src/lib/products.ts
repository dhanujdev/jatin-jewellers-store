import allProducts from '../data/all-products.json';
import productsByCategory from '../data/products-by-category.json';
import categories from '../data/categories.json';

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  materials: string[];
  features: string;
  colors: string[];
  occasions: string[];
  tags: string[];
  imagePath: string;
  thumbnailPath: string;
  original_id?: string;
  collection?: string;
  original_type?: string;
}

export interface CategoryInfo {
  categories: string[];
  total_products: number;
  category_counts: {
    [key: string]: number;
  };
}

// Get all products
export function getAllProducts(): Product[] {
  return allProducts as Product[];
}

// Get products by category
export function getProductsByCategory(category: string): Product[] {
  return (productsByCategory as any)[category] || [];
}

// Get product by ID
export function getProductById(id: string): Product | null {
  return getAllProducts().find(product => product.id === id) || null;
}

// Get featured products (random selection from all categories)
export function getFeaturedProducts(count: number = 8): Product[] {
  const products = getAllProducts();
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get category information
export function getCategoryInfo(): CategoryInfo {
  return categories as CategoryInfo;
}

// Search products by query
export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase();
  return getAllProducts().filter(product => {
    return (
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });
}

// Get related products (same category, excluding the current product)
export function getRelatedProducts(productId: string, count: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  
  const sameCategory = getProductsByCategory(product.category)
    .filter(p => p.id !== productId);
  
  const shuffled = [...sameCategory].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 