import type { Product } from '@/types/product';

export interface Material {
  name: string;
  description: string;
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

// Helper function to get base URL
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side
    return '';
  }
  // Server-side
  return process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch(`${getBaseUrl()}/api/products`);
  if (!response.ok) {
    console.error('Error fetching products:', response.statusText);
    return [];
  }
  return response.json();
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const response = await fetch(`${getBaseUrl()}/api/products?category=${encodeURIComponent(category)}`);
  if (!response.ok) {
    console.error(`Error fetching products for category ${category}:`, response.statusText);
    return [];
  }
  return response.json();
}

// Get product by ID
export async function getProduct(category: string, id: string): Promise<Product | null> {
  const response = await fetch(`${getBaseUrl()}/api/products/${category}/${id}`);
  if (!response.ok) {
    console.error(`Error fetching product ${id}:`, response.statusText);
    return null;
  }
  return response.json();
}

// Get featured products
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const response = await fetch(`${getBaseUrl()}/api/products?featured=true&limit=${limit}`);
  if (!response.ok) {
    console.error('Error fetching featured products:', response.statusText);
    return [];
  }
  return response.json();
}

// Get category information
export async function getCategoryInfo(): Promise<CategoryInfo> {
  try {
    const products = await getAllProducts();
    const categories = products.map(p => p.category);
    const categoryCounts = categories.reduce((counts: { [key: string]: number }, category: string) => {
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {});
    
    return {
      categories: Object.keys(categoryCounts),
      total_products: products.length,
      category_counts: categoryCounts
    };
  } catch (error) {
    console.error('Error getting category info:', error);
    return {
      categories: [],
      total_products: 0,
      category_counts: {}
    };
  }
}

// Search products
export async function searchProducts(
  query: string,
  page: number = 1,
  perPage: number = 12
): Promise<PaginatedResult<Product>> {
  const allProducts = await getAllProducts();
  const searchTerm = query.toLowerCase();
  
  const matchingProducts = allProducts.filter(product => 
    product.title.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  const total = matchingProducts.length;
  const pageCount = Math.ceil(total / perPage);
  const from = (page - 1) * perPage;
  const to = Math.min(from + perPage - 1, total - 1);
  const paginatedData = matchingProducts.slice(from, to + 1);

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

// Get related products
export async function getRelatedProducts(category: string, productId: string, limit: number = 4): Promise<Product[]> {
  const products = await getProductsByCategory(category);
  const filtered = products.filter(product => product.id !== productId);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

// Get categories
export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${getBaseUrl()}/api/categories`);
  if (!response.ok) {
    console.error('Error fetching categories:', response.statusText);
    return [];
  }
  return response.json();
} 