'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { searchProducts } from '@/lib/products';

// Format price to Indian Rupees
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

// Generate a random price between min and max
function generateRandomPrice(min: number = 15000, max: number = 250000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Define the search result type
interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  slug: string;
  description: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([] as SearchResult[]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle search when query changes
  useEffect(() => {
    if (query.trim().length > 2) {
      setIsSearching(true);
      
      // Search products
      const searchResults = searchProducts(query);
      
      // Format results for display
      const formattedResults = searchResults.map(product => ({
        id: product.id,
        name: product.title,
        price: generateRandomPrice(),
        image: product.imagePath,
        category: product.category,
        slug: product.id,
        description: product.description,
      }));
      
      setResults(formattedResults);
      setIsSearching(false);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-playfair text-gray-800 mb-8">Search Products</h1>
      
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search for jewelry..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        {query.trim().length > 0 && query.trim().length < 3 && (
          <p className="mt-2 text-sm text-gray-500">Please enter at least 3 characters to search</p>
        )}
      </div>
      
      {/* Search Results */}
      {isSearching ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="mb-6 text-gray-600">Found {results.length} results for "{query}"</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product: SearchResult) => (
              <Link
                href={`/product/${product.category}/${product.slug}`}
                key={product.id}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium mb-1 group-hover:text-gold-dark transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gold font-semibold mb-2">{formatPrice(product.price)}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : query.trim().length >= 3 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No results found for "{query}"</p>
          <p className="mt-2 text-gray-500">Try different keywords or browse our categories</p>
        </div>
      ) : null}
    </div>
  );
} 