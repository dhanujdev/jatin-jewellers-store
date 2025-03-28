import allProducts from '../data/all-products.json';
import productsByCategory from '../data/products-by-category.json';
import categories from '../data/categories.json';

export interface Material {
  name: string;
  description: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  materials: (string | Material)[];
  features: string;
  colors: string[];
  occasions: string[];
  tags: string[];
  imagePath: string;
  thumbnailPath: string;
  original_id?: string;
  collection?: string;
  original_type?: string;
  slug: string;
}

export interface CategoryInfo {
  categories: string[];
  total_products: number;
  category_counts: {
    [key: string]: number;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
    from: number;
    to: number;
    hasMorePages: boolean;
  };
}

// Get all products
export function getAllProducts(): Product[] {
  const products = allProducts as any[];
  return products.map(p => ({
    ...p,
    slug: p.id // Ensure slug is set
  }));
}

// Get products by category with pagination
export function getProductsByCategory(
  category: string,
  page: number = 1,
  perPage: number = 12
): PaginatedResult<Product> {
  const products = ((productsByCategory as any)[category] || []) as Product[];
  const total = products.length;
  
  // Calculate pagination values
  const pageCount = Math.ceil(total / perPage);
  const from = (page - 1) * perPage;
  const to = Math.min(from + perPage - 1, total - 1);
  
  // Get paginated data
  const paginatedData = products.slice(from, to + 1).map(p => ({
    ...p,
    slug: p.id // Ensure slug is set
  }));
  
  return {
    data: paginatedData,
    pagination: {
      total,
      pageCount,
      currentPage: page,
      perPage,
      from: from + 1,
      to: to + 1,
      hasMorePages: page < pageCount,
    },
  };
}

// Get product by ID
export function getProductById(id: string): Product | null {
  const product = getAllProducts().find(product => product.id === id);
  if (!product) return null;
  
  return {
    ...product,
    slug: product.id // Ensure slug is set
  };
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

// Search products by query with pagination
export function searchProducts(
  query: string,
  page: number = 1,
  perPage: number = 12
): PaginatedResult<Product> {
  const searchTerm = query.toLowerCase();
  const allMatchingProducts = getAllProducts().filter(product => {
    return (
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });
  
  const total = allMatchingProducts.length;
  
  // Calculate pagination values
  const pageCount = Math.ceil(total / perPage);
  const from = (page - 1) * perPage;
  const to = Math.min(from + perPage - 1, total - 1);
  
  // Get paginated data
  const paginatedData = allMatchingProducts.slice(from, to + 1);
  
  return {
    data: paginatedData,
    pagination: {
      total,
      pageCount,
      currentPage: page,
      perPage,
      from: from + 1,
      to: to + 1,
      hasMorePages: page < pageCount,
    },
  };
}

// Get related products (same category, excluding the current product)
export function getRelatedProducts(productId: string): Product[] {
  const currentProduct = getProductById(productId);
  if (!currentProduct) return [];
  
  const sameCategory = ((productsByCategory as any)[currentProduct.category] || []) as Product[];
  const filtered = sameCategory.filter(p => p.id !== productId);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).map(p => ({
    ...p,
    slug: p.id // Ensure slug is set
  }));
}

// Helper function to create pagination metadata
export function createPaginationMetadata(
  total: number,
  page: number,
  perPage: number
) {
  const pageCount = Math.ceil(total / perPage);
  const from = (page - 1) * perPage;
  const to = Math.min(from + perPage - 1, total - 1);
  
  return {
    total,
    pageCount,
    currentPage: page,
    perPage,
    from: from + 1,
    to: to + 1,
    hasMorePages: page < pageCount,
  };
} 