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
}

export default function CategoryClient({
  categoryName,
  categoryDisplayName = categoryName,
  products = []
}: CategoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const pageParam = searchParams.get('page') || '1';
  const sortParam = searchParams.get('sort') || 'default';
  
  // State for sorting and pagination
  const [sortValue, setSortValue] = useState(sortParam);
  const [currentPage, setCurrentPage] = useState(parseInt(pageParam, 10));
  const [sortedProducts, setSortedProducts] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  
  // Pagination settings
  const pageSize = 12;
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Sort options
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];
  
  // Sort products based on sort parameter
  const sortProducts = (products: FormattedProduct[], sortBy: string = 'default') => {
    const productsCopy = [...products];
    
    switch (sortBy) {
      case 'price-asc':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return productsCopy;
    }
  };
  
  // Update sorted products when sort value changes
  useEffect(() => {
    const sorted = sortProducts(products, sortValue);
    setSortedProducts(sorted);
  }, [products, sortValue]);
  
  // Update paginated products when sorted products or page changes
  useEffect(() => {
    const validPage = Math.max(1, Math.min(currentPage, totalPages));
    const startIndex = (validPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedProducts(sortedProducts.slice(startIndex, endIndex));
  }, [sortedProducts, currentPage, totalPages]);
  
  // Update URL when page or sort changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', currentPage.toString());
    params.set('sort', sortValue);
    
    // Use replace to avoid adding to history stack
    router.replace(`/category/${categoryName}?${params.toString()}`, { scroll: false });
  }, [currentPage, sortValue, router, categoryName, searchParams]);
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(e.target.value);
    setCurrentPage(1); // Reset to page 1 when sorting changes
  };
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: categoryDisplayName }
  ];
  
  // Create pagination data object for the Pagination component
  const paginationData: PaginationData = {
    currentPage,
    totalPages,
    pageSize,
    totalItems
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Category Title */}
      <h1 className="text-3xl font-playfair text-gray-800 mb-8 text-center">
        {categoryDisplayName}
      </h1>
      
      {/* Sort Options */}
      <div className="flex justify-end items-center mb-6">
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
      {totalPages > 1 && (
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
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product: FormattedProduct) => (
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
      {totalPages > 1 && (
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