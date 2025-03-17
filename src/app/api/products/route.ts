import { NextRequest, NextResponse } from 'next/server';
import { getAllProductsFromFS, getProductsByCategoryFromFS } from '@/lib/server/products';
import { cacheData, getCachedData } from '@/lib/redis';
import type { Product } from "@/types/product";

// Cache TTL in seconds
const CACHE_TTL = {
  API_PRODUCTS: 1800, // 30 minutes
  API_PRODUCTS_CATEGORY: 1800, // 30 minutes
  API_FEATURED_PRODUCTS: 1800 // 30 minutes
};

// Cache keys
const CACHE_KEYS = {
  API_PRODUCTS: 'api_products',
  API_PRODUCTS_CATEGORY: (category: string) => `api_products_category_${category}`,
  API_FEATURED_PRODUCTS: 'api_featured_products'
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    
    // Log the request parameters
    console.log(`API Request - Category: ${category || 'all'}, Featured: ${featured}`);
    
    // Handle featured products request with caching
    if (featured) {
      // Try to get from cache first
      const cachedFeaturedProducts = await getCachedData(CACHE_KEYS.API_FEATURED_PRODUCTS);
      if (cachedFeaturedProducts) {
        console.log('Returning featured products from cache');
        return NextResponse.json(cachedFeaturedProducts);
      }
      
      console.log('Fetching featured products from file system');
      // Get all products
      const allProducts = await getAllProductsFromFS();
      
      // Group products by category
      const productsByCategory: Record<string, any[]> = {};
      allProducts.forEach(product => {
        if (!productsByCategory[product.category]) {
          productsByCategory[product.category] = [];
        }
        productsByCategory[product.category].push(product);
      });
      
      // Log the categories found
      console.log('Categories found:', Object.keys(productsByCategory));
      console.log('Products per category:', Object.entries(productsByCategory).map(([cat, prods]) => `${cat}: ${prods.length}`));
      
      // Select 3 random products from each category
      const featuredProducts: any[] = [];
      Object.entries(productsByCategory).forEach(([category, products]) => {
        // Shuffle the products
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        // Take up to 3 products
        const selected = shuffled.slice(0, 3);
        console.log(`Selected ${selected.length} products from ${category}`);
        featuredProducts.push(...selected);
      });
      
      console.log(`Total featured products: ${featuredProducts.length}`);
      
      // Cache the results
      await cacheData(CACHE_KEYS.API_FEATURED_PRODUCTS, featuredProducts, CACHE_TTL.API_FEATURED_PRODUCTS);
      
      return NextResponse.json(featuredProducts);
    }
    
    // Handle category-specific request with caching
    if (category) {
      const cacheKey = CACHE_KEYS.API_PRODUCTS_CATEGORY(category);
      
      // Try to get from cache first
      const cachedCategoryProducts = await getCachedData(cacheKey);
      if (cachedCategoryProducts) {
        console.log(`Returning products for category ${category} from cache`);
        return NextResponse.json(cachedCategoryProducts);
      }
      
      console.log(`Fetching products for category ${category} from file system`);
      const products = await getProductsByCategoryFromFS(category);
      
      // Cache the results
      await cacheData(cacheKey, products, CACHE_TTL.API_PRODUCTS_CATEGORY);
      
      return NextResponse.json(products);
    }
    
    // Handle all products request with caching
    const cachedAllProducts = await getCachedData(CACHE_KEYS.API_PRODUCTS);
    if (cachedAllProducts) {
      console.log('Returning all products from cache');
      return NextResponse.json(cachedAllProducts);
    }
    
    console.log('Fetching all products from file system');
    const products = await getAllProductsFromFS();
    
    // Cache the results
    await cacheData(CACHE_KEYS.API_PRODUCTS, products, CACHE_TTL.API_PRODUCTS);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
} 