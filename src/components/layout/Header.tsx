import Link from "next/link";
import { Menu, Search, ShoppingBag, User, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
        <Link href="/" className="text-2xl font-playfair font-bold text-[#7d6546]">
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
        <div className="flex items-center space-x-4">
          <Link href="/search" className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#7d6546]">
            <Search size={20} />
          </Link>
          <Link href="/wishlist" className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#7d6546]">
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
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="text-base font-medium text-gray-700 hover:text-[#7d6546] transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
