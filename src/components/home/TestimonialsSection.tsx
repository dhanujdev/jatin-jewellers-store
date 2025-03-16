"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star } from 'lucide-react';

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Hyderabad",
    image: "/products/rings/rings-015/image.jpg",
    rating: 5,
    text: "The craftsmanship of my engagement ring is absolutely stunning. The attention to detail and the quality of the diamonds exceeded my expectations. I've received countless compliments!"
  },
  {
    id: 2,
    name: "Rahul Patel",
    location: "Mumbai",
    image: "/products/rings/rings-020/image.jpg",
    rating: 5,
    text: "I purchased a necklace for my wife's anniversary, and she was overjoyed. The design is elegant and timeless. The customer service was exceptional, helping me choose the perfect piece."
  },
  {
    id: 3,
    name: "Ananya Reddy",
    location: "Bangalore",
    image: "/products/earrings/earrings-020/image.jpg",
    rating: 5,
    text: "Jatin Jewellers has been our family jeweler for generations. Their wedding collection is unmatched in quality and design. I recently purchased my wedding set, and it's absolutely perfect."
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Delhi",
    image: "/products/necklaces/necklaces-010/image.jpg",
    rating: 4,
    text: "The custom-designed earrings I ordered for my daughter's wedding were exquisite. The team worked closely with me to bring my vision to life, and the result was beyond my expectations."
  },
  {
    id: 5,
    name: "Meera Kapoor",
    location: "Chennai",
    image: "/products/bangles/bangles-010/image.jpg",
    rating: 5,
    text: "I've been a loyal customer for years. Their pieces are not just jewelry; they're heirlooms that tell stories. The quality and craftsmanship are consistently outstanding."
  }
];

export default function TestimonialsSection() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={18} 
        className={i < rating ? "fill-gold text-gold" : "text-gray-300"} 
      />
    ));
  };

  return (
    <section className="py-16 md:py-24 bg-cream-light">
      <div className="container mx-auto px-4">
        <h2 className="section-title">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
          Discover why our customers choose Jatin Jewellers for their most precious moments
        </p>

        {isMounted && (
          <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem 
                  key={testimonial.id} 
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill="true"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    <p className="text-gray-700 italic flex-grow">"{testimonial.text}"</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="static relative transform-none mx-1 bg-white border-gray-200 text-gray-700 hover:bg-gold hover:text-white hover:border-gold" />
              <CarouselNext className="static relative transform-none mx-1 bg-white border-gray-200 text-gray-700 hover:bg-gold hover:text-white hover:border-gold" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
} 