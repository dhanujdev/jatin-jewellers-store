import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import { invalidateProductCache, invalidateCategoryCache } from '@/lib/server/products';

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
    
    // Create product directory
    const productDir = path.join(
      process.cwd(),
      'public',
      'products',
      productData.category,
      productData.id
    );
    
    try {
      await fs.mkdir(productDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create product directory:', error);
      return NextResponse.json(
        { error: 'Failed to create product directory' },
        { status: 500 }
      );
    }
    
    // Write product data
    const dataPath = path.join(productDir, 'data.json');
    await fs.writeFile(dataPath, JSON.stringify(productData, null, 2), 'utf-8');
    
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