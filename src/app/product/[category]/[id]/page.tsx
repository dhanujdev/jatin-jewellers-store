import { getProductById, getRelatedProducts, getAllProducts, Product, Material as ProductMaterial } from '@/lib/products';
import ProductClient from './client';
import { notFound } from 'next/navigation';
import { generateRandomPrice } from "@/lib/utils";

// Function to format price with currency symbol
function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllProducts();
  
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
  'bracelets': 'Bracelets',
  'pendants': 'Pendants',
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
  const maybeProduct = await getProductById(params.id);

  if (!maybeProduct) {
    notFound();
  }

  // After this point, TypeScript knows maybeProduct is not null
  const product = maybeProduct;

  const formattedProduct: FormattedProduct = {
    id: product.id,
    name: product.title,
    description: product.description,
    price: generateRandomPrice(),
    formattedPrice: formatPrice(generateRandomPrice()),
    image: product.imagePath,
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

  const relatedProducts = await getRelatedProducts(product.id);
  const formattedRelatedProducts: FormattedRelatedProduct[] = relatedProducts.map(
    (relatedProduct) => ({
      id: relatedProduct.id,
      name: relatedProduct.title,
      price: generateRandomPrice(),
      formattedPrice: formatPrice(generateRandomPrice()),
      image: relatedProduct.imagePath,
      category: relatedProduct.category,
      slug: relatedProduct.id,
    })
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