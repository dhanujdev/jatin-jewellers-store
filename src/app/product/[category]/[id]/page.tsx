import { getProductById, getRelatedProducts, getAllProducts, Product } from '@/lib/products';
import ProductClient from './client';
import { notFound } from 'next/navigation';

// Function to format price with currency symbol
function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

// Function to generate a random price between 5000 and 50000
function generateRandomPrice(): number {
  return Math.floor(Math.random() * 45000) + 5000;
}

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllProducts();
  
  return products.map((product) => ({
    category: product.category,
    id: product.id, // Use id as the URL parameter
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

export default async function ProductPage({ params }: { params: { category: string; id: string } }) {
  // Get product details
  const product = await getProductById(params.id);
  
  // If product not found, show 404 page
  if (!product) {
    notFound();
  }
  
  // Generate a random price for the product
  const price = generateRandomPrice();
  const formattedPrice = formatPrice(price);
  
  // Format the product for display
  const formattedProduct = {
    id: product.id,
    name: product.title,
    description: product.description,
    price,
    formattedPrice,
    image: product.imagePath,
    category: product.category,
    materials: product.materials?.map(material => ({
      name: typeof material === 'string' ? material : material.name,
      description: typeof material === 'string' ? '' : material.description
    })) || [],
    slug: product.id,
  };
  
  // Get related products
  const relatedProducts = await getRelatedProducts(product.category, product.id);
  
  // Format related products with prices
  const formattedRelatedProducts = relatedProducts.map(relatedProduct => {
    const relatedPrice = generateRandomPrice();
    return {
      id: relatedProduct.id,
      name: relatedProduct.title,
      price: relatedPrice,
      formattedPrice: formatPrice(relatedPrice),
      image: relatedProduct.imagePath,
      category: relatedProduct.category,
      slug: relatedProduct.id,
    };
  });
  
  // Get category display name
  const categoryDisplayName = categoryDisplayNames[product.category] || product.category;
  
  return (
    <ProductClient 
      product={formattedProduct}
      relatedProducts={formattedRelatedProducts}
      categoryDisplayName={categoryDisplayName}
    />
  );
} 