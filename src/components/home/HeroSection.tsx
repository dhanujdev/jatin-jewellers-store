"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const heroSlides = [
  {
    image: "/products/rings/rings-001/image.jpg",
    title: "Elegance in Every Detail",
    subtitle: "Discover our exquisite collection of custom diamond jewelry",
    buttonText: "Shop Now",
    buttonLink: "/collections/new-arrivals",
    position: "center",
  },
  {
    image: "/products/rings/rings-010/image.jpg",
    title: "Timeless Solitaires",
    subtitle: "Handcrafted Diamond Jewelry of Exceptional Quality",
    buttonText: "Explore Collection",
    buttonLink: "/category/rings",
    position: "right",
  },
  {
    image: "/products/necklaces/necklaces-001/image.jpg",
    title: "Bespoke Creations",
    subtitle: "Custom-designed Jewelry for Your Special Moments",
    buttonText: "View Collection",
    buttonLink: "/collections/new-arrivals",
    position: "left",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-[70vh] md:h-[85vh]">
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black-gradient" />
                
                <div className={`absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 ${
                  slide.position === 'left' ? 'md:items-start md:text-left md:pl-16 md:pr-32' :
                  slide.position === 'right' ? 'md:items-end md:text-right md:pr-16 md:pl-32' :
                  ''
                }`}>
                  <h1 className="text-3xl md:text-5xl font-playfair mb-3 md:mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-xl">
                    {slide.subtitle}
                  </p>
                  <Link 
                    href={slide.buttonLink}
                    className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded transition-colors"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 text-white" />
        <CarouselNext className="absolute right-4 text-white" />
      </Carousel>
    </section>
  );
}
