import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';

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