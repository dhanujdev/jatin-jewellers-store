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
      className="product-card group"
    >
      <div className="product-card-image">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-luxury-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
          <span className="bg-gold text-luxury-white text-xs px-4 py-2">View Details</span>
        </div>
      </div>
      <div className="product-card-content">
        <h3 className="product-title group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );

  return (
    <section className="py-16 md:py-20 bg-luxury-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">
          Bestsellers
        </h2>
        <p className="text-luxury-gray max-w-2xl mx-auto text-center mb-12">
          Discover our most popular custom diamond jewelry pieces, crafted with precision and elegance
        </p>

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
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="static relative transform-none mx-1 bg-luxury-white border-luxury-lightgray text-luxury-gray hover:bg-gold hover:text-luxury-white hover:border-gold" />
              <CarouselNext className="static relative transform-none mx-1 bg-luxury-white border-luxury-lightgray text-luxury-gray hover:bg-gold hover:text-luxury-white hover:border-gold" />
            </div>
          </Carousel>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/collections/bestsellers"
            className="gold-button"
          >
            View All Bestsellers
          </Link>
        </div>
      </div>
    </section>
  );
}
