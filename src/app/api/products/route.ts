import { NextResponse } from "next/server";
import { getAllProductsFromFS, getProductsByCategoryFromFS } from "@/lib/server/products";
import type { Product } from "@/types/product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '0', 10);

    let products;
    if (category) {
      console.log(`Fetching products for category: ${category}`);
      products = await getProductsByCategoryFromFS(category);
    } else {
      console.log('Fetching all products');
      products = await getAllProductsFromFS();
    }

    console.log('Total products fetched:', products.length);
    console.log('Products by category:', products.reduce((acc: { [key: string]: number }, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {}));

    if (featured) {
      // Group products by category
      const productsByCategory = products.reduce((acc: { [key: string]: Product[] }, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {});

      console.log('Categories found:', Object.keys(productsByCategory));
      console.log('Products per category:', Object.keys(productsByCategory).reduce((acc: { [key: string]: number }, category) => {
        acc[category] = productsByCategory[category].length;
        return acc;
      }, {}));

      // Get an equal number of products from each category
      const categories = Object.keys(productsByCategory);
      const productsPerCategory = Math.ceil(limit / categories.length);
      
      console.log('Products per category to select:', productsPerCategory);

      const featuredProducts: Product[] = [];
      for (const category of categories) {
        const categoryProducts = productsByCategory[category];
        const shuffled = [...categoryProducts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, productsPerCategory);
        console.log(`Selected ${selected.length} products from ${category}`);
        featuredProducts.push(...selected);
      }

      // Shuffle the final array and limit to requested size
      products = [...featuredProducts].sort(() => 0.5 - Math.random()).slice(0, limit);
      console.log('Final featured products:', products.map(p => `${p.category}/${p.id}`));
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 