import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import { invalidateProductCache, invalidateCategoryCache } from '@/lib/server/products';

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  // Check admin authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token || token !== 'jatinjewellersadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const productId = params.productId;
    const productsDir = path.join(process.cwd(), 'public', 'products');
    const categories = await fs.readdir(productsDir);
    
    let productFound = false;
    let productCategory = '';
    
    // Find the product in any category
    for (const category of categories) {
      const categoryPath = path.join(productsDir, category);
      const categoryStats = await fs.stat(categoryPath);
      
      if (categoryStats.isDirectory()) {
        const productDirs = await fs.readdir(categoryPath);
        
        if (productDirs.includes(productId)) {
          const productPath = path.join(categoryPath, productId);
          await fs.rm(productPath, { recursive: true, force: true });
          productFound = true;
          productCategory = category;
          break;
        }
      }
    }
    
    if (!productFound) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Invalidate cache for this product and its category
    try {
      console.log(`Invalidating cache for product ${productId} and category ${productCategory} after deletion`);
      await invalidateProductCache(productCategory, productId);
      await invalidateCategoryCache(productCategory);
      console.log('Cache invalidated successfully');
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