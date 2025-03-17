import { getProduct, getRelatedProducts, getAllProducts } from '@/lib/products';
import { getAllProductsFromFS } from '@/lib/server/products';
import type { Product } from '@/types/product';
import ProductClient from './client';
import { notFound } from 'next/navigation';
import { generateRandomPrice } from "@/lib/utils";

// Function to format price with currency symbol
function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

// Generate static params for all products
export async function generateStaticParams() {
  // Use server-side function to get products directly from the file system
  const products = await getAllProductsFromFS();
  
  return products.map((product) => ({
    category: product.category,
    id: product.id,
  }));
}

// Define category display names
const categoryDisplayNames: Record<string, string> = {
  'rings': 'Rings',
  'necklaces': 'Necklaces',
  'earrings': 'Earrings',
  'bangles': 'Bangles',
  'waistbands': 'Waistbands',
};

interface Material {
  name: string;
  description: string;
}

interface FormattedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  materials: Material[];
  slug: string;
}

interface FormattedRelatedProduct {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  slug: string;
}

export default async function ProductPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const maybeProduct = await getProduct(params.category, params.id);

  if (!maybeProduct) {
    notFound();
  }

  // After notFound(), we know the product exists
  const product = maybeProduct as Product;

  const price = generateRandomPrice();
  const formattedProduct: FormattedProduct = {
    id: product.id,
    name: product.title,
    description: product.description,
    price,
    formattedPrice: formatPrice(price),
    image: `/products/${product.category}/${product.id}/image.jpg`,
    category: product.category,
    materials: product.materials.map((material) => {
      if (typeof material === 'string') {
        return {
          name: material,
          description: `High quality ${material}`
        };
      }
      return material;
    }),
    slug: product.id,
  };

  const relatedProducts = await getRelatedProducts(product.category, product.id);
  const formattedRelatedProducts: FormattedRelatedProduct[] = relatedProducts.map(
    (relatedProduct) => {
      const relatedPrice = generateRandomPrice();
      return {
        id: relatedProduct.id,
        name: relatedProduct.title,
        price: relatedPrice,
        formattedPrice: formatPrice(relatedPrice),
        image: `/products/${relatedProduct.category}/${relatedProduct.id}/image.jpg`,
        category: relatedProduct.category,
        slug: relatedProduct.id,
      };
    }
  );

  const categoryDisplayName = categoryDisplayNames[product.category] || product.category;

  return (
    <ProductClient
      product={formattedProduct}
      relatedProducts={formattedRelatedProducts}
      categoryDisplayName={categoryDisplayName}
    />
  );
} 