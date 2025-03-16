"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl?: string;
}

export function Pagination({ totalPages, currentPage, baseUrl }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Create a new URLSearchParams instance for manipulation
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    
    // Use provided baseUrl or current pathname
    const base = baseUrl || pathname;
    return `${base}?${params.toString()}`;
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push("ellipsis-start");
    }
    
    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push("ellipsis-end");
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Don't render pagination if only 1 page
  if (totalPages <= 1) {
    return null;
  }
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className="flex justify-center my-8" aria-label="Pagination">
      <ul className="flex items-center space-x-1">
        {/* Previous page button */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-100"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </Link>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 text-gray-300 cursor-not-allowed">
              <ChevronLeft size={16} />
            </span>
          )}
        </li>
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="flex items-center justify-center w-10 h-10 text-gray-500">
                  ...
                </span>
              </li>
            );
          }
          
          const isCurrentPage = page === currentPage;
          
          return (
            <li key={`page-${page}`}>
              {isCurrentPage ? (
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-gold text-white font-medium">
                  {page}
                </span>
              ) : (
                <Link
                  href={createPageUrl(page as number)}
                  className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  {page}
                </Link>
              )}
            </li>
          );
        })}
        
        {/* Next page button */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-100"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 text-gray-300 cursor-not-allowed">
              <ChevronRight size={16} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
} 