"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import customImageLoader from '@/lib/imageLoader';

interface FormattedProduct {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  slug: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  pageSize: number;
}

interface CategoryClientProps {
  categoryName: string;
  allProducts: FormattedProduct[];
  paginationData: PaginationData;
  currentSort: string;
}

// Pagination component for reuse
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void 
}) {
  if (totalPages <= 1) return null;
  
  const links = [];

  // Previous button
  links.push(
    <button
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-2 rounded-md ${
        currentPage === 1
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      aria-label="Previous page"
    >
      &laquo; Prev
    </button>
  );

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  // First page
  if (startPage > 1) {
    links.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
      >
        1
      </button>
    );
    
    // Ellipsis if needed
    if (startPage > 2) {
      links.push(
        <span key="ellipsis-start" className="px-2 py-2">
          ...
        </span>
      );
    }
  }

  // Page numbers in range
  for (let i = startPage; i <= endPage; i++) {
    links.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`px-3 py-2 rounded-md ${
          i === currentPage
            ? 'bg-gold text-white font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {i}
      </button>
    );
  }
  
  // Ellipsis if needed
  if (endPage < totalPages - 1) {
    links.push(
      <span key="ellipsis-end" className="px-2 py-2">
        ...
      </span>
    );
  }
  
  // Last page
  if (endPage < totalPages) {
    links.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
      >
        {totalPages}
      </button>
    );
  }

  // Next button
  links.push(
    <button
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-3 py-2 rounded-md ${
        currentPage === totalPages
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      aria-label="Next page"
    >
      Next &raquo;
    </button>
  );

  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      {links}
    </div>
  );
}

export default function CategoryClient({
  categoryName,
  allProducts,
  paginationData,
  currentSort: initialSort
}: CategoryClientProps) {
  const [currentPage, setCurrentPage] = useState(paginationData.currentPage);
  const [currentSort, setCurrentSort] = useState(initialSort);
  const [sortedProducts, setSortedProducts] = useState<FormattedProduct[]>(allProducts);
  const [displayedProducts, setDisplayedProducts] = useState<FormattedProduct[]>([]);
  const [totalPages, setTotalPages] = useState(Math.ceil(allProducts.length / paginationData.pageSize));
  
  // Apply sorting and pagination whenever sort or page changes
  useEffect(() => {
    // Apply sorting
    let sorted = [...allProducts];
    
    if (currentSort === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setSortedProducts(sorted);
    setTotalPages(Math.ceil(sorted.length / paginationData.pageSize));
    
    // Apply pagination
    const startIndex = (currentPage - 1) * paginationData.pageSize;
    const endIndex = startIndex + paginationData.pageSize;
    setDisplayedProducts(sorted.slice(startIndex, endIndex));
    
    // Log for debugging
    console.log(`Displaying products ${startIndex + 1}-${Math.min(endIndex, sorted.length)} of ${sorted.length}`);
    console.log(`Current page: ${currentPage}, Total pages: ${Math.ceil(sorted.length / paginationData.pageSize)}`);
  }, [allProducts, currentSort, currentPage, paginationData.pageSize]);

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSort(e.target.value);
    setCurrentPage(1); // Reset to page 1 when sorting changes
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    console.log(`Changing to page ${page}`);
    setCurrentPage(page);
    // Scroll to top of products
    window.scrollTo({
      top: document.getElementById('products-grid')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex text-sm">
          <li className="mr-2">
            <Link href="/" className="text-gray-500 hover:text-gold">
              Home
            </Link>
          </li>
          <li className="mx-2 text-gray-500">/</li>
          <li className="text-gray-800">{categoryName}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-playfair text-gray-800 mb-4">{categoryName}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of beautiful {categoryName.toLowerCase()} crafted with the finest materials and exquisite craftsmanship.
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="text-gray-600">
          Showing {displayedProducts.length} of {sortedProducts.length} products
          {totalPages > 1 && (
            <span className="ml-2">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </div>
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-gray-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={handleSortChange}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Top Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-b border-gray-200 mb-8">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}

      {/* Products Grid */}
      <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product: FormattedProduct) => (
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
                <p className="text-gold font-semibold">{product.formattedPrice}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No products found. Please try a different category or filter.</p>
          </div>
        )}
      </div>

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
    </div>
  );
} 