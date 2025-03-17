"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Social Media Section */}
      <div className="bg-gold py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-white text-2xl md:text-3xl font-medium mb-4">Follow Us on Instagram</h3>
            <p className="text-white/80 mb-6">Stay updated with our latest collections and exclusive designs</p>
            <div>
              <a 
                href="https://www.instagram.com/jatinjewellershyd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-white text-gold hover:bg-gray-100 px-6 py-3 font-medium transition-colors"
              >
                <span>Follow @jatinjewellershyd</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Column 1: About */}
          <div className="text-center">
            <div className="mb-6 flex flex-col items-center">
              <Image
                src="/products/logo.png"
                alt="Jatin Jewellers"
                width={60}
                height={60}
                className="object-contain mb-3"
              />
              <span className="text-xl md:text-2xl font-bold text-white font-serif">
                Jatin Jewellers
              </span>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-medium mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-gold">
              Quick Links
            </h3>
            <ul className="space-y-3 text-left flex flex-col items-start">
              <li>
                <Link href="/about" className="text-white/80 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="text-white/80 hover:text-gold transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/bestsellers" className="text-white/80 hover:text-gold transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/collections/wedding" className="text-white/80 hover:text-gold transition-colors">
                  Wedding Collection
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div className="text-center">
            <h3 className="text-lg font-medium mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-gold">
              Visit Our Store
            </h3>
            <ul className="space-y-4 text-left">
              <li className="flex items-start">
                <MapPin size={20} className="text-gold mr-3 mt-1 flex-shrink-0" />
                <a 
                  href="https://maps.app.goo.gl/S84vSu7"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-white/80 hover:text-gold transition-colors"
                >
                  Jatin Jewellers, Road No.36,<br />
                  Jubilee Hills Checkpost,<br />
                  Hyderabad, Telangana, 500033
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-gold mr-3 flex-shrink-0" />
                <a href="tel:+919866186960" className="text-white/80 hover:text-gold transition-colors">
                  +91 98661 86960
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-gold mr-3 flex-shrink-0" />
                <a href="mailto:jatinjewellershyd@gmail.com" className="text-white/80 hover:text-gold transition-colors">
                  jatinjewellershyd@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
