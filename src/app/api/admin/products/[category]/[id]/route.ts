import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { invalidateProductCache, invalidateCategoryCache, getProductFromFS } from '@/lib/server/products';

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
    const productPath = path.join(process.cwd(), 'public', 'products', params.category, params.id, 'data.json');
    const data = await readFile(productPath, 'utf-8');
    const product = JSON.parse(data);
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
    const productPath = path.join(process.cwd(), 'public', 'products', params.category, params.id, 'data.json');
    
    // Ensure the product exists
    try {
      await readFile(productPath, 'utf-8');
    } catch (error) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update the product data
    const updatedData = await request.json();
    
    // Ensure ID doesn't change
    const productData = {
      ...updatedData,
      id: params.id,
    };

    // Write the updated data
    await writeFile(productPath, JSON.stringify(productData, null, 2), 'utf-8');

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