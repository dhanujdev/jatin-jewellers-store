"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, X, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

// Helper function to capitalize first letter
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched categories:', data);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch categories');
      }
    }

    fetchCategories();
  }, []);

  // Don't show header in admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

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
                <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
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
                      <div className="space-y-1 px-4">
                        <Link href="/" className={`block py-2 text-sm font-medium ${pathname === "/" ? "text-foreground" : "text-foreground/60"} transition-colors hover:text-foreground/80`}>
                          Home
                        </Link>
                        {categories.map((category: string) => (
                          <SheetClose asChild key={category}>
                            <Link
                              href={`/category/${category.toLowerCase()}`}
                              className={`block py-2 text-sm font-medium ${pathname === `/category/${category.toLowerCase()}` ? "text-foreground" : "text-foreground/60"} transition-colors hover:text-foreground/80`}
                            >
                              {capitalizeFirstLetter(category)}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  </nav>
                  
                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex flex-col space-y-2">
                      <Link href="/" className="block w-full py-3 px-4 bg-black text-white text-center font-medium">
                        Home
                      </Link>
                      <Link href="/admin" className="block w-full py-3 px-4 bg-gray-800 text-white text-center font-medium">
                        Admin
                      </Link>
                    </div>
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

            {/* Search and Admin Buttons - Right side */}
            <div className="flex items-center space-x-2">
              <Link 
                href="/search" 
                className="px-4 py-2 bg-black text-white text-sm hover:bg-gold transition-colors duration-300 flex items-center"
              >
                <Search size={16} className="mr-1" />
                <span className="hidden sm:inline">Search</span>
              </Link>
              <Link 
                href="/admin" 
                className="px-4 py-2 bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors duration-300 flex items-center"
              >
                <Settings size={16} className="mr-1" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Categories Navigation */}
          <div className="hidden md:flex justify-center space-x-8 mt-4">
            <Link href="/" className={`transition-colors hover:text-foreground/80 ${pathname === "/" ? "text-foreground" : "text-foreground/60"}`}>
              Home
            </Link>
            {categories.map((category: string) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className={`transition-colors hover:text-foreground/80 ${pathname === `/category/${category.toLowerCase()}` ? "text-foreground" : "text-foreground/60"}`}
              >
                {capitalizeFirstLetter(category)}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
