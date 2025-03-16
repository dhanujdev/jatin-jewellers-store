"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import customImageLoader from '@/lib/imageLoader';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  slug: string;
  description: string;
  tags: string[];
}

interface PaginationData {
  total: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
  from: number;
  to: number;
  hasMorePages: boolean;
}

interface SearchClientProps {
  allProducts: SearchResult[];
  initialPagination: PaginationData;
}

export default function SearchClient({
  allProducts,
  initialPagination
}: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState({
    ...initialPagination,
    currentPage: initialPage
  });

  // Perform client-side search when query or page changes
  useEffect(() => {
    if (query.trim().length > 2) {
      setIsSearching(true);
      
      // Search products
      const searchTerm = query.toLowerCase();
      const filteredProducts = allProducts.filter(product => {
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      });
      
      // Calculate pagination
      const perPage = 12;
      const total = filteredProducts.length;
      const pageCount = Math.ceil(total / perPage);
      const from = (currentPage - 1) * perPage;
      const to = Math.min(from + perPage, total);
      
      // Get paginated results
      const paginatedResults = filteredProducts.slice(from, to);
      
      setResults(paginatedResults);
      setPagination({
        total,
        pageCount,
        currentPage,
        perPage,
        from: from + 1,
        to,
        hasMorePages: currentPage < pageCount
      });
      
      setIsSearching(false);
    } else {
      setResults([]);
      setPagination({
        ...initialPagination,
        currentPage
      });
    }
  }, [query, currentPage, allProducts, initialPagination]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim().length > 2) {
      setIsSearching(true);
      setCurrentPage(1);
      
      // Update URL with search query
      const params = new URLSearchParams();
      params.set('q', query);
      params.set('page', '1');
      
      router.push(`/search?${params.toString()}`);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL with page
    const params = new URLSearchParams();
    params.set('q', query);
    params.set('page', page.toString());
    
    router.push(`/search?${params.toString()}`);
    
    // Scroll to top of results
    window.scrollTo({
      top: document.getElementById('search-results')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  // Generate pagination links
  const renderPaginationLinks = () => {
    const { currentPage, pageCount } = pagination;
    const links = [];

    // Previous button
    links.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        &laquo; Prev
      </button>
    );

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(pageCount, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            i === currentPage
              ? 'bg-gold text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    links.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
        className={`px-3 py-1 rounded ${
          currentPage === pageCount
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Next &raquo;
      </button>
    );

    return links;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-playfair text-gray-800 mb-8">Search Products</h1>
      
      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-8">
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
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gold text-white px-3 py-1 rounded-md hover:bg-gold-dark"
          >
            Search
          </button>
        </div>
        {query.trim().length > 0 && query.trim().length < 3 && (
          <p className="mt-2 text-sm text-gray-500">Please enter at least 3 characters to search</p>
        )}
      </form>
      
      {/* Search Results */}
      <div id="search-results">
        {isSearching ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="mb-6 text-gray-600">
              Showing {pagination.from}-{pagination.to} of {pagination.total} results for "{query}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
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
                      loader={customImageLoader}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-800 font-medium mb-1 group-hover:text-gold-dark transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gold font-semibold mb-2">{product.formattedPrice}</p>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.pageCount > 1 && (
              <div className="flex justify-center space-x-2">
                {renderPaginationLinks()}
              </div>
            )}
          </div>
        ) : query.trim().length >= 3 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found for "{query}"</p>
            <p className="mt-2 text-gray-500">Try different keywords or browse our categories</p>
          </div>
        ) : null}
      </div>
    </div>
  );
} 