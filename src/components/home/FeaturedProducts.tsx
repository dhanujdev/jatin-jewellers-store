"use client";

import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useMediaQuery } from '@/lib/hooks';
import { useEffect, useState } from 'react';

// Format price to Indian Rupees
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

// Generate a random price between min and max
function generateRandomPrice(min: number = 15000, max: number = 250000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function FeaturedProducts() {
  // State to track if we're on mobile
  const [isMounted, setIsMounted] = useState(false);
  
  // Mount state for client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Get 8 featured products from our dataset
  const featuredProducts = getFeaturedProducts(8).map(product => ({
    id: product.id,
    name: product.title,
    price: generateRandomPrice(), // Generate a random price since our dataset doesn't have prices
    image: product.imagePath,
    category: product.category,
    slug: product.id,
  }));

  // Product card component to avoid duplication
  const ProductCard = ({ product }: { product: typeof featuredProducts[0] }) => (
    <Link
      href={`/product/${product.category}/${product.slug}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-gray-800 font-medium mb-1 group-hover:text-[#7d6546] transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[#7d6546] font-semibold mt-auto">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair text-gray-800 mb-3">
            Bestsellers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular lab-grown diamond jewelry pieces, crafted with precision and elegance
          </p>
        </div>

        {/* Mobile Carousel View */}
        <div className="md:hidden">
          <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
            <CarouselContent className="-ml-4">
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-[85%] sm:basis-[45%]">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6 gap-1.5">
              <CarouselPrevious className="static relative transform-none mx-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#7d6546]" />
              <CarouselNext className="static relative transform-none mx-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#7d6546]" />
            </div>
          </Carousel>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8 md:mt-10">
          <Link
            href="/collections/bestsellers"
            className="inline-block bg-[#7d6546] hover:bg-[#6a563b] text-white px-8 py-3 rounded-md transition-colors shadow-sm"
          >
            View All Bestsellers
          </Link>
        </div>
      </div>
    </section>
  );
}
