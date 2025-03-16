"use client";

import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
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
  
  // Sort options
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(e.target.value);
    
    // Update URL with new sort parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1'); // Reset to page 1 when sorting changes
    
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
      
      {/* Sort Options and Product Count */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-700">
          Showing {((paginationData.currentPage - 1) * paginationData.pageSize) + 1}-
          {Math.min(paginationData.currentPage * paginationData.pageSize, paginationData.totalItems)} of {paginationData.totalItems} products
        </div>
        <div className="flex items-center">
          <label htmlFor="sort-select" className="mr-2 text-gray-700">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortValue}
            onChange={handleSortChange}
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
      
      {/* Top Pagination */}
      {paginationData.totalPages > 1 && (
        <div className="mb-6" data-testid="pagination-top">
          <Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            basePath={`/category/${categoryName}`}
            currentSort={sortValue}
            totalItems={paginationData.totalItems}
            pageSize={paginationData.pageSize}
          />
        </div>
      )}
      
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
      
      {/* Bottom Pagination */}
      {paginationData.totalPages > 1 && (
        <div data-testid="pagination">
          <Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            basePath={`/category/${categoryName}`}
            currentSort={sortValue}
            totalItems={paginationData.totalItems}
            pageSize={paginationData.pageSize}
          />
        </div>
      )}
    </div>
  );
} 