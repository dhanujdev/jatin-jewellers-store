import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#141818] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/rings" className="text-gray-300 hover:text-white text-sm">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="text-gray-300 hover:text-white text-sm">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/category/pendants" className="text-gray-300 hover:text-white text-sm">
                  Pendants
                </Link>
              </li>
              <li>
                <Link href="/category/bracelets" className="text-gray-300 hover:text-white text-sm">
                  Bracelets & Bangles
                </Link>
              </li>
              <li>
                <Link href="/category/solitaire" className="text-gray-300 hover:text-white text-sm">
                  Solitaire
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Collections</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/collections/bestsellers" className="text-gray-300 hover:text-white text-sm">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="text-gray-300 hover:text-white text-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/engagement" className="text-gray-300 hover:text-white text-sm">
                  Engagement
                </Link>
              </li>
              <li>
                <Link href="/collections/wedding" className="text-gray-300 hover:text-white text-sm">
                  Wedding
                </Link>
              </li>
              <li>
                <Link href="/collections/daily-wear" className="text-gray-300 hover:text-white text-sm">
                  Daily Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about-lab-grown-diamonds" className="text-gray-300 hover:text-white text-sm">
                  About Lab Grown Diamonds
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-300 hover:text-white text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300 text-sm space-y-2">
              <p>123 Jewellery Lane</p>
              <p>Diamond District, New Delhi</p>
              <p>India - 110001</p>
              <p className="mt-4">
                <a href="tel:+919999999999" className="hover:text-white">
                  +91 99999 99999
                </a>
              </p>
              <p>
                <a href="mailto:support@jatinjewellers.in" className="hover:text-white">
                  support@jatinjewellers.in
                </a>
              </p>
            </address>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              Copyright &copy; {new Date().getFullYear()} Jatin Jewellers - All Rights Reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-xs text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/shipping-policy" className="text-xs text-gray-400 hover:text-white">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
