import { Suspense } from 'react';
import { getAllProducts } from '@/lib/products';
import SearchClient from './client';

// Function to generate a random price between 10000 and 200000
function generateRandomPrice(): number {
  return Math.floor(Math.random() * (200000 - 10000 + 1)) + 10000;
}

// Function to format price with commas and currency symbol
function formatPrice(price: number): string {
  return `₹${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

// Format all products for search
function formatAllProducts(products: any[]) {
  return products.map(product => {
    const price = generateRandomPrice();
    return {
      id: product.id,
      name: product.title,
      price,
      formattedPrice: formatPrice(price),
      image: product.imagePath,
      category: product.category,
      slug: product.id,
      description: product.description,
      tags: product.tags || [],
    };
  });
}

export default function SearchPage() {
  // Get all products for client-side search
  const allProducts = getAllProducts();
  const formattedProducts = formatAllProducts(allProducts);
  
  // Default empty pagination data
  const paginationData = {
    total: 0,
    pageCount: 1,
    currentPage: 1,
    perPage: 12,
    from: 0,
    to: 0,
    hasMorePages: false,
  };
  
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading search...</div>}>
      <SearchClient 
        allProducts={formattedProducts}
        initialPagination={paginationData}
      />
    </Suspense>
  );
} 