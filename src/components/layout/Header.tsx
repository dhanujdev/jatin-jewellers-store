"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User, Heart, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { getCategoryInfo } from "@/lib/products";

// Get category information from our dataset
const categoryInfo = getCategoryInfo();

// Map category IDs to display names and links
const categoryMap = {
  rings: { name: "Rings", href: "/category/rings" },
  earrings: { name: "Earrings", href: "/category/earrings" },
  necklaces: { name: "Necklaces", href: "/category/necklaces" },
  bangles: { name: "Bangles", href: "/category/bangles" },
  waistbands: { name: "Waistbands", href: "/category/waistbands" },
};

// Create categories array from our dataset categories
const categories = categoryInfo.categories.map(categoryId => 
  categoryMap[categoryId as keyof typeof categoryMap]
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-playfair font-bold text-[#7d6546]">
          JATIN JEWELLERS
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="text-sm font-medium text-gray-700 hover:text-[#7d6546] transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Utility Icons */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <Link href="/search" className="hidden md:flex w-8 h-8 items-center justify-center text-gray-700 hover:text-[#7d6546]">
            <Search size={20} />
          </Link>
          <Link href="/wishlist" className="hidden md:flex w-8 h-8 items-center justify-center text-gray-700 hover:text-[#7d6546]">
            <Heart size={20} />
          </Link>
          <Link href="/account" className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#7d6546]">
            <User size={20} />
          </Link>
          <Link href="/cart" className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#7d6546]">
            <ShoppingBag size={20} />
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <button className="w-8 h-8 flex items-center justify-center text-gray-700">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <Link href="/" className="text-xl font-playfair font-bold text-[#7d6546]">
                    JATIN JEWELLERS
                  </Link>
                  <SheetClose className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100">
                    <X size={18} />
                  </SheetClose>
                </div>
                
                {/* Mobile Search */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search for jewelry..." 
                      className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#7d6546]"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                
                {/* Mobile Navigation */}
                <nav className="flex-1 overflow-y-auto">
                  <div className="py-2">
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <SheetClose asChild key={category.name}>
                          <Link
                            href={category.href}
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#7d6546] transition-colors"
                          >
                            {category.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>
                  
                  <div className="py-2 border-t border-gray-200">
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
                    <div className="space-y-1">
                      <SheetClose asChild>
                        <Link href="/wishlist" className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#7d6546]">
                          <Heart size={18} className="mr-3" />
                          Wishlist
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/account" className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#7d6546]">
                          <User size={18} className="mr-3" />
                          My Account
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/cart" className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#7d6546]">
                          <ShoppingBag size={18} className="mr-3" />
                          Shopping Bag
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </nav>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                  <Link href="/contact" className="block w-full py-3 px-4 bg-[#7d6546] text-white text-center rounded-md font-medium">
                    Contact Us
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
