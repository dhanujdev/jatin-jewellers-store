"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { getCategoryInfo } from "@/lib/products";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  // Don't show header in admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

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
      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          {/* Top section with logo and search */}
          <div className="flex items-center justify-between relative">
            {/* Mobile Menu Trigger - Left side */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <button className="w-8 h-8 flex items-center justify-center text-black">
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0" aria-label="Navigation Menu">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-black text-white">
                    <SheetTitle className="text-xl font-serif font-bold text-white">
                      Jatin Jewellers
                    </SheetTitle>
                    <SheetClose className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700">
                      <X size={18} />
                    </SheetClose>
                  </div>
                  
                  <SheetDescription className="sr-only">
                    Navigation menu for mobile devices with search and category links
                  </SheetDescription>
                  
                  {/* Mobile Search */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search for jewelry..." 
                        className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-gold"
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
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {category.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  </nav>
                  
                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200">
                    <Link href="/" className="block w-full py-3 px-4 bg-black text-white text-center font-medium">
                      Home
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center justify-center space-x-2">
              <Image
                src="/products/logo.png"
                alt="Jatin Jewellers"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              <span className="text-xl md:text-3xl font-bold text-gold font-serif">
                Jatin Jewellers
              </span>
            </Link>

            {/* Search Button - Right side */}
            <div>
              <Link 
                href="/search" 
                className="px-4 py-2 bg-black text-white text-sm hover:bg-gold transition-colors duration-300"
              >
                Search
              </Link>
            </div>
          </div>
          
          {/* Desktop Categories Navigation */}
          <div className="hidden md:flex justify-center space-x-8 mt-4">
            <Link href="/" className="text-gray-700 hover:text-gold transition-colors py-2">
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-gray-700 hover:text-gold transition-colors py-2"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
