"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gold py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-white text-2xl md:text-3xl font-medium mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-white/80">Stay updated with our latest collections and exclusive offers</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[250px]"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-white text-gold hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About */}
          <div>
            <div className="mb-6">
              <span className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-cormorant)' }}>
                JATIN JEWELLERS
              </span>
            </div>
            <p className="text-gray-300 mb-6">
              Jatin Jewellers has been crafting exquisite jewelry since 1985, 
              bringing elegance and luxury to every occasion.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gold">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="text-gray-300 hover:text-gold transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/bestsellers" className="text-gray-300 hover:text-gold transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/collections/wedding" className="text-gray-300 hover:text-gold transition-colors">
                  Wedding Collection
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Categories */}
          <div>
            <h3 className="text-lg font-medium mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gold">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/category/rings" className="text-gray-300 hover:text-gold transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/category/necklaces" className="text-gray-300 hover:text-gold transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="text-gray-300 hover:text-gold transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/category/bracelets" className="text-gray-300 hover:text-gold transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/category/waistbands" className="text-gray-300 hover:text-gold transition-colors">
                  Waistbands
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-medium mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gold">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Jewelry Lane, Diamond District<br />
                  Hyderabad, 500001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-gold mr-3 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-gold transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-gold mr-3 flex-shrink-0" />
                <a href="mailto:info@jatinjewellers.com" className="text-gray-300 hover:text-gold transition-colors">
                  info@jatinjewellers.com
                </a>
              </li>
              <li className="flex items-start">
                <Clock size={20} className="text-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Mon - Sat: 10:00 AM - 8:00 PM<br />
                  Sunday: 11:00 AM - 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Jatin Jewellers. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-gold transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping-policy" className="hover:text-gold transition-colors">
                Shipping Policy
              </Link>
              <Link href="/refund-policy" className="hover:text-gold transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
