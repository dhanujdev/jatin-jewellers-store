import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

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

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
} 