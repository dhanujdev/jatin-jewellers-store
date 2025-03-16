"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1920&auto=format&fit=crop",
    title: "Elegance in Every Detail",
    subtitle: "Discover our exquisite collection of custom diamond jewelry",
    buttonText: "Shop Now",
    buttonLink: "/collections/new-arrivals",
    position: "center",
  },
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1920&auto=format&fit=crop",
    title: "Timeless Solitaires",
    subtitle: "Handcrafted Diamond Jewelry of Exceptional Quality",
    buttonText: "Explore Collection",
    buttonLink: "/category/rings",
    position: "right",
  },
  {
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1920&auto=format&fit=crop",
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
                <div className={`absolute inset-0 flex flex-col justify-center text-white px-6 md:px-16 ${
                  slide.position === 'left' 
                    ? 'items-start text-left md:ml-12' 
                    : slide.position === 'right' 
                      ? 'items-end text-right md:mr-12' 
                      : 'items-center text-center'
                }`}>
                  <div className="max-w-xl">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-cormorant mb-3 md:mb-6 drop-shadow-md leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-xl drop-shadow-md">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.buttonLink}
                      className="inline-block bg-gold hover:bg-gold-dark text-white px-8 py-3 transition-colors shadow-md"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute z-10 bottom-6 left-0 right-0 flex justify-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className="w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-gold border-none" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-gold border-none" />
      </Carousel>
    </section>
  );
}
