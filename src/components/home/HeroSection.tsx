import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const heroSlides = [
  {
    image: "https://ext.same-assets.com/3644294737/32073042.jpeg",
    title: "Elegance in Every Detail",
    subtitle: "Because Everyday Is Worthy of a Diamond",
    buttonText: "Shop Now",
    buttonLink: "/collections/new-arrivals",
  },
  {
    image: "https://ext.same-assets.com/3240105443/2056002979.jpeg",
    title: "Timeless Solitaires",
    subtitle: "Lab Grown Diamonds of Exceptional Quality",
    buttonText: "Explore Collection",
    buttonLink: "/category/solitaire",
  },
  {
    image: "https://ext.same-assets.com/1376627070/710333777.jpeg",
    title: "New Arrivals",
    subtitle: "Discover Our Latest Creations",
    buttonText: "View New Arrivals",
    buttonLink: "/collections/new-arrivals",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-[70vh] md:h-[80vh]">
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
                  <h1 className="text-3xl md:text-5xl font-playfair mb-3 md:mb-6 drop-shadow-md">{slide.title}</h1>
                  <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-xl drop-shadow-md">{slide.subtitle}</p>
                  <Link
                    href={slide.buttonLink}
                    className="bg-[#7d6546] hover:bg-[#6a563b] text-white px-8 py-3 rounded-md transition-colors shadow-md"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute z-10 bottom-4 left-0 right-0 flex justify-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 border-none" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 border-none" />
      </Carousel>
    </section>
  );
}
