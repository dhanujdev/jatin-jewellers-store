import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import { invalidateProductCache, invalidateCategoryCache } from '@/lib/server/products';
import { cacheData } from '@/lib/redis';

// Redis key for storing product data
const PRODUCT_DATA_KEY = (category: string, id: string) => `product_data_${category}_${id}`;
const ALL_PRODUCTS_KEY = 'all_products_data';
const CATEGORY_PRODUCTS_KEY = (category: string) => `category_products_data_${category}`;

export async function GET() {
  // Check admin authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  
  if (!token || token !== 'jatinjewellersadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const productsDir = path.join(process.cwd(), 'public', 'products');
    const categories = await fs.readdir(productsDir);
    
    const products = [];
    
    for (const category of categories) {
      const categoryPath = path.join(productsDir, category);
      const categoryStats = await fs.stat(categoryPath);
      
      if (categoryStats.isDirectory()) {
        const productDirs = await fs.readdir(categoryPath);
        
        for (const productDir of productDirs) {
          const dataPath = path.join(categoryPath, productDir, 'data.json');
          try {
            const data = await fs.readFile(dataPath, 'utf-8');
            const product = JSON.parse(data);
            products.push(product);
          } catch (error) {
            console.error(`Error reading product data from ${dataPath}:`, error);
          }
        }
      }
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Helper function to revalidate paths
async function revalidatePaths(paths: string[]) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `admin-token=jatinjewellersadmin`
      },
      body: JSON.stringify({ paths })
    });

    if (!response.ok) {
      console.error('Failed to revalidate paths:', await response.text());
    } else {
      console.log('Successfully revalidated paths:', await response.json());
    }
  } catch (error) {
    console.error('Error calling revalidation API:', error);
  }
}

export async function POST(request: Request) {
  // Check admin authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token || token !== 'jatinjewellersadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.id || !productData.title || !productData.category) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, or category' },
        { status: 400 }
      );
    }
    
    // In development environment, still create the directory structure
    if (process.env.NODE_ENV === 'development') {
      try {
        // Create product directory
        const productDir = path.join(
          process.cwd(),
          'public',
          'products',
          productData.category,
          productData.id
        );
        
        await fs.mkdir(productDir, { recursive: true });
        
        // Write product data to file system in development
        const dataPath = path.join(productDir, 'data.json');
        await fs.writeFile(dataPath, JSON.stringify(productData, null, 2), 'utf-8');
      } catch (error) {
        console.error('Failed to create product directory or file in development:', error);
        // Continue execution since we'll still store in Redis
      }
    }
    
    // Store product data in Redis
    await cacheData(PRODUCT_DATA_KEY(productData.category, productData.id), productData);
    
    // Update category products in Redis
    const redis = await import('@/lib/redis');
    const categoryProducts = await redis.getCachedData<any[]>(CATEGORY_PRODUCTS_KEY(productData.category)) || [];
    categoryProducts.push(productData);
    await cacheData(CATEGORY_PRODUCTS_KEY(productData.category), categoryProducts);
    
    // Update all products in Redis
    const allProducts = await redis.getCachedData<any[]>(ALL_PRODUCTS_KEY) || [];
    allProducts.push(productData);
    await cacheData(ALL_PRODUCTS_KEY, allProducts);
    
    // Invalidate category cache
    try {
      await invalidateCategoryCache(productData.category);
      console.log(`Invalidated cache for category ${productData.category}`);
      
      // Revalidate the category page
      await revalidatePaths([
        `/category/${productData.category}`
      ]);
    } catch (cacheError) {
      console.error('Failed to invalidate cache:', cacheError);
      // Continue with the response even if cache invalidation fails
    }
    
    return NextResponse.json(productData, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 