import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Secret token for revalidation security
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'jatinjewellersrevalidate';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token || token !== 'jatinjewellersadmin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get paths to revalidate from request body
    const { paths = [] } = await request.json();

    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing paths array' },
        { status: 400 }
      );
    }

    // Revalidate each path
    const revalidatedPaths = [];
    for (const path of paths) {
      try {
        revalidatePath(path);
        revalidatedPaths.push(path);
        console.log(`Revalidated path: ${path}`);
      } catch (error) {
        console.error(`Error revalidating path ${path}:`, error);
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths
    });
  } catch (error) {
    console.error('Error in revalidation API:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate paths' },
      { status: 500 }
    );
  }
}

// Also support GET requests with a token for external triggers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const path = searchParams.get('path');

    // Validate token
    if (!token || token !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Validate path
    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    // Revalidate the path
    revalidatePath(path);
    console.log(`Revalidated path via GET: ${path}`);

    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    console.error('Error in revalidation API (GET):', error);
    return NextResponse.json(
      { error: 'Failed to revalidate path' },
      { status: 500 }
    );
  }
} 