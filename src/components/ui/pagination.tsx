"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  currentSort: string;
  totalItems: number;
  pageSize: number;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  currentSort,
  totalItems,
  pageSize,
}: PaginationProps) {
  // If there are no items or only one page, don't render pagination
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageUrl = (page: number) => {
    return `${basePath}?sort=${currentSort}&page=${page}`;
  };

  // Function to determine which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7; // Show at most 7 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have 7 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination" className="flex flex-col items-center my-8">
      <div className="text-sm text-gray-700 mb-4">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>
      <ul className="flex items-center space-x-1">
        <li>
          {currentPage > 1 ? (
            <a
              href={getPageUrl(1)}
              aria-label="Go to first page"
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
            >
              <ChevronsLeft className="h-4 w-4" />
            </a>
          ) : (
            <span 
              aria-label="Go to first page"
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-300 cursor-not-allowed"
            >
              <ChevronsLeft className="h-4 w-4" />
            </span>
          )}
        </li>
        <li>
          {currentPage > 1 ? (
            <a
              href={getPageUrl(currentPage - 1)}
              aria-label="Go to previous page"
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </a>
          ) : (
            <span 
              aria-label="Go to previous page"
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-300 cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
        </li>
        {getPageNumbers().map((page, i) => {
          if (page === '...') {
            return (
              <li key={`ellipsis-${i}`}>
                <span className="flex items-center justify-center w-10 h-10">...</span>
              </li>
            );
          }
          return (
            <li key={page}>
              {page === currentPage ? (
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-gold text-white font-medium">
                  {page}
                </span>
              ) : (
                <a
                  href={getPageUrl(page as number)}
                  className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
                >
                  {page}
                </a>
              )}
            </li>
          );
        })}
        <li>
          {currentPage < totalPages ? (
            <a
              href={getPageUrl(currentPage + 1)}
              aria-label="Go to next page"
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </a>
          ) : (
            <span 
              aria-label="Go to next page"
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-300 cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </li>
        <li>
          {currentPage < totalPages ? (
            <a
              href={getPageUrl(totalPages)}
              aria-label="Go to last page"
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
            >
              <ChevronsRight className="h-4 w-4" />
            </a>
          ) : (
            <span 
              aria-label="Go to last page"
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-300 cursor-not-allowed"
            >
              <ChevronsRight className="h-4 w-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}