import { getAllProducts, getProductById, getRelatedProducts, Product } from '@/lib/products';
import ProductClient from './client';

// Function to generate a random price between 10000 and 200000
function generateRandomPrice(): number {
  return Math.floor(Math.random() * (200000 - 10000 + 1)) + 10000;
}

// Function to format price with commas and currency symbol
function formatPrice(price: number): string {
  return `₹${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

// Format product data for client component
function formatProductData(product: Product, price: number) {
  return {
    ...product,
    formattedPrice: formatPrice(price)
  };
}

// Format related products data for client component
function formatRelatedProductsData(products: Product[]) {
  return products.map(product => {
    const price = generateRandomPrice();
    return {
      id: product.id,
      name: product.title,
      price: price,
      formattedPrice: formatPrice(price),
      image: product.imagePath,
      category: product.category,
      slug: product.id // Using id as slug
    };
  });
}

export function generateStaticParams() {
  const products = getAllProducts();
  
  return products.map((product) => ({
    category: product.category,
    id: product.id,
  }));
}

export default function ProductPage({ params }: { params: { category: string; id: string } }) {
  const product = getProductById(params.id);
  
  if (!product) {
    return <div>Product not found</div>;
  }
  
  const price = generateRandomPrice();
  const relatedProducts = getRelatedProducts(product.id, 4);
  
  const formattedProduct = formatProductData(product, price);
  const formattedRelatedProducts = formatRelatedProductsData(relatedProducts);
  
  return (
    <ProductClient 
      product={formattedProduct} 
      relatedProducts={formattedRelatedProducts}
    />
  );
} 