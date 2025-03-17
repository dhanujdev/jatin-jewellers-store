import { promises as fs } from 'fs';
import path from 'path';
import type { Product } from '@/types/product';
import { cacheData, getCachedData, invalidateCache } from '../redis';

// Add a flag to disable logging during build
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME;

// Helper function for conditional logging
function log(message: string) {
  if (!isBuildTime) {
    console.log(message);
  }
}

// Cache TTL in seconds
const CACHE_TTL = {
  PRODUCTS: 3600, // 1 hour
  CATEGORIES: 3600 * 24, // 24 hours
  PRODUCT: 3600 * 2 // 2 hours
};

// Cache keys
const CACHE_KEYS = {
  ALL_PRODUCTS: 'all_products',
  CATEGORIES: 'all_categories',
  CATEGORY_PRODUCTS: (category: string) => `products_category_${category}`,
  PRODUCT: (category: string, id: string) => `product_${category}_${id}`
};

// Helper function to get products directory
function getProductsDir() {
  return path.join(process.cwd(), 'public', 'products');
}

// Helper function to check if a directory is a product directory
async function isProductDirectory(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) return false;

    const contents = await fs.readdir(dirPath);
    return contents.includes('data.json');
  } catch (error) {
    console.error(`Error checking directory ${dirPath}:`, error);
    return false;
  }
}

// Helper function to read product data from file
async function readProductData(categoryPath: string, productDir: string): Promise<Product | null> {
  try {
    const dataPath = path.join(categoryPath, productDir, 'data.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading product data from ${productDir}:`, error);
    return null;
  }
}

// Get all products from file system with caching
export async function getAllProductsFromFS(): Promise<Product[]> {
  try {
    // Try to get from cache first
    const cachedProducts = await getCachedData<Product[]>(CACHE_KEYS.ALL_PRODUCTS);
    if (cachedProducts) {
      log('Retrieved all products from cache');
      return cachedProducts;
    }

    // If not in cache, fetch from file system
    log('Fetching all products from file system');
    const productsDir = getProductsDir();
    const items = await fs.readdir(productsDir);
    const products: Product[] = [];

    for (const item of items) {
      const itemPath = path.join(productsDir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory() && !item.startsWith('.')) {
        log(`Processing category directory: ${item}`);
        const productDirs = await fs.readdir(itemPath);
        
        for (const productDir of productDirs) {
          const productPath = path.join(itemPath, productDir);
          if (await isProductDirectory(productPath)) {
            const product = await readProductData(itemPath, productDir);
            if (product) {
              log(`Added product: ${item}/${productDir}`);
              products.push(product);
            }
          }
        }
      }
    }
    
    log(`Total products found: ${products.length}`);
    
    // Cache the results
    await cacheData(CACHE_KEYS.ALL_PRODUCTS, products, CACHE_TTL.PRODUCTS);
    
    return products;
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
}

// Get products by category from file system with caching
export async function getProductsByCategoryFromFS(category: string): Promise<Product[]> {
  try {
    // Try to get from cache first
    const cacheKey = CACHE_KEYS.CATEGORY_PRODUCTS(category);
    const cachedProducts = await getCachedData<Product[]>(cacheKey);
    if (cachedProducts) {
      log(`Retrieved products for category ${category} from cache`);
      return cachedProducts;
    }

    // If not in cache, fetch from file system
    log(`Fetching products for category ${category} from file system`);
    const categoryPath = path.join(getProductsDir(), category);
    const items = await fs.readdir(categoryPath);
    const products: Product[] = [];
    
    for (const item of items) {
      const itemPath = path.join(categoryPath, item);
      if (await isProductDirectory(itemPath)) {
        const product = await readProductData(categoryPath, item);
        if (product) {
          log(`Added product from category ${category}: ${item}`);
          products.push(product);
        }
      }
    }
    
    log(`Total products found for category ${category}: ${products.length}`);
    
    // Cache the results
    await cacheData(cacheKey, products, CACHE_TTL.PRODUCTS);
    
    return products;
  } catch (error) {
    console.error(`Error getting products for category ${category}:`, error);
    return [];
  }
}

// Get categories from file system with caching
export async function getCategoriesFromFS(): Promise<string[]> {
  try {
    // Try to get from cache first
    const cachedCategories = await getCachedData<string[]>(CACHE_KEYS.CATEGORIES);
    if (cachedCategories) {
      log('Retrieved categories from cache');
      return cachedCategories;
    }

    // If not in cache, fetch from file system
    log('Fetching categories from file system');
    const productsDir = getProductsDir();
    const items = await fs.readdir(productsDir);
    const categories: string[] = [];
    
    for (const item of items) {
      const itemPath = path.join(productsDir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory() && !item.startsWith('.')) {
        const subDirs = await fs.readdir(itemPath);
        
        // Check if any subdirectory is a product directory
        for (const dir of subDirs) {
          if (await isProductDirectory(path.join(itemPath, dir))) {
            log(`Found category with products: ${item}`);
            categories.push(item);
            break; // Found at least one product, no need to check more
          }
        }
      }
    }
    
    log(`Total categories found: ${categories.length}`);
    log('Categories: ' + categories.join(', '));
    
    // Cache the results
    await cacheData(CACHE_KEYS.CATEGORIES, categories, CACHE_TTL.CATEGORIES);
    
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

// Get product by ID from file system with caching
export async function getProductFromFS(category: string, id: string, forceRefresh = false): Promise<Product | null> {
  try {
    // Try to get from cache first (unless force refresh is requested)
    const cacheKey = CACHE_KEYS.PRODUCT(category, id);
    if (!forceRefresh) {
      const cachedProduct = await getCachedData<Product>(cacheKey);
      if (cachedProduct) {
        log(`Retrieved product ${id} from category ${category} from cache`);
        return cachedProduct;
      }
    } else {
      log(`Force refresh requested for product ${id} from category ${category}`);
    }

    // If not in cache or force refresh, fetch from file system
    log(`Fetching product ${id} from category ${category} from file system`);
    const productPath = path.join(getProductsDir(), category, id);
    if (await isProductDirectory(productPath)) {
      const product = await readProductData(path.dirname(productPath), path.basename(productPath));
      
      // Cache the result if found
      if (product) {
        await cacheData(cacheKey, product, CACHE_TTL.PRODUCT);
        log(`Product ${id} from category ${category} cached successfully`);
      }
      
      return product;
    }
    return null;
  } catch (error) {
    console.error(`Error getting product ${id} from category ${category}:`, error);
    return null;
  }
}

// Invalidate product cache
export async function invalidateProductCache(category: string, id: string): Promise<void> {
  try {
    // Invalidate specific product cache
    await invalidateCache(CACHE_KEYS.PRODUCT(category, id));
    
    // Invalidate category products cache
    await invalidateCache(CACHE_KEYS.CATEGORY_PRODUCTS(category));
    
    // Invalidate all products cache
    await invalidateCache(CACHE_KEYS.ALL_PRODUCTS);
    
    log(`Invalidated cache for product ${id} in category ${category}`);
  } catch (error) {
    console.error(`Error invalidating product cache for ${category}/${id}:`, error);
  }
}

// Invalidate category cache
export async function invalidateCategoryCache(category: string): Promise<void> {
  try {
    // Invalidate category products cache
    await invalidateCache(CACHE_KEYS.CATEGORY_PRODUCTS(category));
    
    // Invalidate all products cache
    await invalidateCache(CACHE_KEYS.ALL_PRODUCTS);
    
    // Invalidate categories cache
    await invalidateCache(CACHE_KEYS.CATEGORIES);
    
    log(`Invalidated cache for category ${category}`);
  } catch (error) {
    console.error(`Error invalidating category cache for ${category}:`, error);
  }
} 