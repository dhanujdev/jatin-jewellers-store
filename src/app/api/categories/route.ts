import { NextResponse } from 'next/server';
import { getCategoriesFromFS } from '@/lib/server/products';

export async function GET() {
  try {
    const categories = await getCategoriesFromFS();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 