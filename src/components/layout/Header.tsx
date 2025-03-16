"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag, User, Heart, X, ChevronDown, Phone, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { getCategoryInfo } from "@/lib/products";
import { useState, useEffect } from "react";

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
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-gold text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Phone size={14} className="mr-2" />
              <span>+91 99999 99999</span>
            </div>
            <div className="flex items-center">
              <MapPin size={14} className="mr-2" />
              <span>Diamond District, New Delhi</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/about-us" className="hover:underline">About Us</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/faqs" className="hover:underline">FAQs</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-gold" style={{ fontFamily: 'var(--font-cormorant)' }}>
              JATIN JEWELLERS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-sm font-medium text-gray-700 hover:text-gold transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/collections/bestsellers" className="text-sm font-medium text-gray-700 hover:text-gold transition-colors">
              Bestsellers
            </Link>
            <Link href="/collections/new-arrivals" className="text-sm font-medium text-gray-700 hover:text-gold transition-colors">
              New Arrivals
            </Link>
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link href="/search" className="hidden md:flex w-8 h-8 items-center justify-center text-gray-700 hover:text-gold transition-colors">
              <Search size={20} />
            </Link>
            <Link href="/wishlist" className="hidden md:flex w-8 h-8 items-center justify-center text-gray-700 hover:text-gold transition-colors">
              <Heart size={20} />
            </Link>
            <Link href="/account" className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gold transition-colors">
              <User size={20} />
            </Link>
            <Link href="/cart" className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gold transition-colors">
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
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gold text-white">
                    <Link href="/" className="text-xl font-playfair font-bold">
                      JATIN JEWELLERS
                    </Link>
                    <SheetClose className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gold-dark">
                      <X size={18} />
                    </SheetClose>
                  </div>
                  
                  {/* Mobile Search */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search for jewelry..." 
                        className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gold"
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
                              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gold transition-colors"
                            >
                              {category.name}
                            </Link>
                          </SheetClose>
                        ))}
                        <SheetClose asChild>
                          <Link
                            href="/collections/bestsellers"
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gold transition-colors"
                          >
                            Bestsellers
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/collections/new-arrivals"
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gold transition-colors"
                          >
                            New Arrivals
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                    
                    <div className="py-2 border-t border-gray-200">
                      <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <Link href="/wishlist" className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gold">
                            <Heart size={18} className="mr-3" />
                            Wishlist
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/account" className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gold">
                            <User size={18} className="mr-3" />
                            My Account
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/cart" className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gold">
                            <ShoppingBag size={18} className="mr-3" />
                            Shopping Bag
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    <div className="py-2 border-t border-gray-200">
                      <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Information</h3>
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <Link href="/about-us" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gold">
                            About Us
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/contact" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gold">
                            Contact
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/faqs" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gold">
                            FAQs
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  </nav>
                  
                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <a href="tel:+919999999999" className="flex items-center text-sm text-gray-700">
                        <Phone size={16} className="mr-2" />
                        +91 99999 99999
                      </a>
                    </div>
                    <Link href="/contact" className="block w-full py-3 px-4 bg-gold text-white text-center rounded-md font-medium">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
