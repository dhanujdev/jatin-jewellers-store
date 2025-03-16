"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Breadcrumb } from '../../../components/ui/breadcrumb';
import { Pagination } from '../../../components/ui/pagination';
import { Select } from '../../../components/ui/select';

interface FormattedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  slug: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface CategoryClientProps {
  categoryName: string;
  categoryDisplayName?: string;
  products?: FormattedProduct[];
  paginationData: PaginationData;
  currentSort?: string;
}

export default function CategoryClient({
  categoryName,
  categoryDisplayName = categoryName,
  products = [],
  paginationData,
  currentSort = 'default'
}: CategoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [sortValue, setSortValue] = useState(currentSort);
  const [currentPage, setCurrentPage] = useState(paginationData.currentPage);
  
  // Sort options
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortValue(value);
    
    // Update URL with new sort parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1'); // Reset to page 1 when sorting changes
    
    router.replace(`/category/${categoryName}?${params.toString()}`);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    
    router.replace(`/category/${categoryName}?${params.toString()}`);
  };
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: categoryDisplayName }
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Category Title */}
      <h1 className="text-3xl font-playfair text-gray-800 mb-8 text-center">
        {categoryDisplayName}
      </h1>
      
      {/* Sort Options */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center">
          <label htmlFor="sort-select" className="mr-2 text-gray-700">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
            data-testid="sort-select"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Products Grid */}
      <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8" data-testid="products-grid">
        {products.length > 0 ? (
          products.map((product: FormattedProduct) => (
            <Link
              href={`/product/${product.category}/${product.slug}`}
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              data-testid="product-card"
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
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No products found. Please try a different category or filter.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {paginationData.totalPages > 1 && (
        <div data-testid="pagination">
          <div className="border-t border-b border-gray-200 mb-8">
            <div className="flex justify-center items-center space-x-2 py-4">
              <button
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous page"
                key="pagination-prev"
              >
                « Prev
              </button>
              {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={`pagination-page-${page}`}
                  className={`px-3 py-2 rounded-md ${
                    page === currentPage ? 'bg-gold text-white font-medium' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === paginationData.totalPages}
                className={`px-3 py-2 rounded-md ${
                  currentPage === paginationData.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next page"
                key="pagination-next"
              >
                Next »
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 