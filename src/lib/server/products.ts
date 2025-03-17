import { promises as fs } from 'fs';
import path from 'path';
import type { Product } from '@/types/product';

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

// Get all products from file system
export async function getAllProductsFromFS(): Promise<Product[]> {
  try {
    const productsDir = getProductsDir();
    const items = await fs.readdir(productsDir);
    const products: Product[] = [];

    for (const item of items) {
      const itemPath = path.join(productsDir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory() && !item.startsWith('.')) {
        console.log(`Processing category directory: ${item}`);
        const productDirs = await fs.readdir(itemPath);
        
        for (const productDir of productDirs) {
          const productPath = path.join(itemPath, productDir);
          if (await isProductDirectory(productPath)) {
            const product = await readProductData(itemPath, productDir);
            if (product) {
              console.log(`Added product: ${item}/${productDir}`);
              products.push(product);
            }
          }
        }
      }
    }
    
    console.log(`Total products found: ${products.length}`);
    return products;
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
}

// Get products by category from file system
export async function getProductsByCategoryFromFS(category: string): Promise<Product[]> {
  try {
    const categoryPath = path.join(getProductsDir(), category);
    const items = await fs.readdir(categoryPath);
    const products: Product[] = [];
    
    for (const item of items) {
      const itemPath = path.join(categoryPath, item);
      if (await isProductDirectory(itemPath)) {
        const product = await readProductData(categoryPath, item);
        if (product) {
          console.log(`Added product from category ${category}: ${item}`);
          products.push(product);
        }
      }
    }
    
    console.log(`Total products found for category ${category}: ${products.length}`);
    return products;
  } catch (error) {
    console.error(`Error getting products for category ${category}:`, error);
    return [];
  }
}

// Get categories from file system
export async function getCategoriesFromFS(): Promise<string[]> {
  try {
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
            console.log(`Found category with products: ${item}`);
            categories.push(item);
            break; // Found at least one product, no need to check more
          }
        }
      }
    }
    
    console.log(`Total categories found: ${categories.length}`);
    console.log('Categories:', categories);
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

// Get product by ID from file system
export async function getProductFromFS(category: string, id: string): Promise<Product | null> {
  try {
    const productPath = path.join(getProductsDir(), category, id);
    if (await isProductDirectory(productPath)) {
      return await readProductData(path.dirname(productPath), path.basename(productPath));
    }
    return null;
  } catch (error) {
    console.error(`Error getting product ${id} from category ${category}:`, error);
    return null;
  }
} 