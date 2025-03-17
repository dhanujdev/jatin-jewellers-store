import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readFile } from 'fs/promises';
import path from 'path';
import { invalidateProductCache, invalidateCategoryCache, getProductFromFS } from '@/lib/server/products';
import { cacheData } from '@/lib/redis';

// Redis key for storing product data
const PRODUCT_DATA_KEY = (category: string, id: string) => `product_data_${category}_${id}`;

export async function GET(
  request: Request,
  { params: paramsPromise }: { params: { category: string; id: string } }
) {
  const params = await Promise.resolve(paramsPromise);
  
  // Check admin authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token || token !== 'jatinjewellersadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Try to get the product from Redis first
    const redis = await import('@/lib/redis');
    const cachedProduct = await redis.getCachedData(PRODUCT_DATA_KEY(params.category, params.id));
    
    if (cachedProduct) {
      return NextResponse.json(cachedProduct);
    }
    
    // Fallback to file system for initial data loading
    const productPath = path.join(process.cwd(), 'public', 'products', params.category, params.id, 'data.json');
    const data = await readFile(productPath, 'utf-8');
    const product = JSON.parse(data);
    
    // Cache the product data in Redis for future requests
    await cacheData(PRODUCT_DATA_KEY(params.category, params.id), product);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
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

export async function PUT(
  request: Request,
  { params: paramsPromise }: { params: { category: string; id: string } }
) {
  const params = await Promise.resolve(paramsPromise);
  
  // Check admin authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token || token !== 'jatinjewellersadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if product exists in Redis or file system
    const redis = await import('@/lib/redis');
    let existingProduct = await redis.getCachedData(PRODUCT_DATA_KEY(params.category, params.id));
    
    if (!existingProduct) {
      try {
        // Try to get from file system as fallback
        const productPath = path.join(process.cwd(), 'public', 'products', params.category, params.id, 'data.json');
        const data = await readFile(productPath, 'utf-8');
        existingProduct = JSON.parse(data);
      } catch (error) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    // Update the product data
    const updatedData = await request.json();
    
    // Ensure ID doesn't change
    const productData = {
      ...updatedData,
      id: params.id,
    };

    // Store the updated data in Redis instead of writing to file system
    await cacheData(PRODUCT_DATA_KEY(params.category, params.id), productData);

    // Invalidate cache for this product and its category
    try {
      console.log(`Invalidating cache for product ${params.id} in category ${params.category}`);
      await invalidateProductCache(params.category, params.id);
      await invalidateCategoryCache(params.category);
      
      // Force refresh the product in cache
      console.log(`Force refreshing product ${params.id} in category ${params.category}`);
      await getProductFromFS(params.category, params.id, true);
      
      console.log('Cache invalidated and refreshed successfully');
      
      // Revalidate the product page and category page
      await revalidatePaths([
        `/product/${params.category}/${params.id}`,
        `/category/${params.category}`
      ]);
    } catch (cacheError) {
      console.error('Failed to invalidate cache:', cacheError);
      // Continue with the response even if cache invalidation fails
    }

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params: paramsPromise }: { params: { category: string; id: string } }
) {
  const params = await Promise.resolve(paramsPromise);
  
  // Check admin authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token || token !== 'jatinjewellersadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const redis = await import('@/lib/redis');
    
    // Check if product exists in Redis
    const existingProduct = await redis.getCachedData(PRODUCT_DATA_KEY(params.category, params.id));
    
    if (!existingProduct) {
      // Try to check file system as fallback
      try {
        const productPath = path.join(process.cwd(), 'public', 'products', params.category, params.id, 'data.json');
        await readFile(productPath, 'utf-8');
      } catch (error) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }
    
    // Delete from Redis
    await redis.invalidateCache(PRODUCT_DATA_KEY(params.category, params.id));
    
    // Update category products in Redis
    const categoryProductsKey = `category_products_data_${params.category}`;
    const categoryProducts = await redis.getCachedData<any[]>(categoryProductsKey) || [];
    const updatedCategoryProducts = categoryProducts.filter(product => product.id !== params.id);
    await redis.cacheData(categoryProductsKey, updatedCategoryProducts);
    
    // Update all products in Redis
    const allProductsKey = 'all_products_data';
    const allProducts = await redis.getCachedData<any[]>(allProductsKey) || [];
    const updatedAllProducts = allProducts.filter(product => product.id !== params.id);
    await redis.cacheData(allProductsKey, updatedAllProducts);
    
    // Invalidate cache for this product and its category
    try {
      console.log(`Invalidating cache for product ${params.id} in category ${params.category}`);
      await invalidateProductCache(params.category, params.id);
      await invalidateCategoryCache(params.category);
      
      // Revalidate the category page
      await revalidatePaths([
        `/category/${params.category}`
      ]);
    } catch (cacheError) {
      console.error('Failed to invalidate cache:', cacheError);
      // Continue with the response even if cache invalidation fails
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 