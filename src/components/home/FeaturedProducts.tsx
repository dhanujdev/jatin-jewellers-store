"use client";

import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
function generateRandomPrice(min: number = 45000, max: number = 450000) {
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
      className="product-card group text-center"
    >
      <div className="product-card-image">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-gold font-medium">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );

  return (
    <section className="py-16 md:py-24 bg-cream-light text-center">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          Featured Products
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
          Discover our most popular and exquisite jewelry pieces
        </p>

        {isMounted ? (
          <>
            {/* Mobile Carousel View */}
            <div className="block md:hidden">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {featuredProducts.map((product) => (
                    <CarouselItem key={product.id} className="basis-full sm:basis-1/2">
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-6 gap-2">
                  <CarouselPrevious className="static relative transform-none mx-1" />
                  <CarouselNext className="static relative transform-none mx-1" />
                </div>
              </Carousel>
            </div>

            {/* Desktop Grid View */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          // Placeholder for SSR
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 h-80 rounded-lg animate-pulse"></div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link 
            href="/collections/new-arrivals" 
            className="inline-block bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
