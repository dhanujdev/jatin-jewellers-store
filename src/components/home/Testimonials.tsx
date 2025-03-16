import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Priya Sharma",
    date: "March 12, 2025",
    rating: 5,
    text: "The ring I purchased from Jatin Jewellers exceeded my expectations. The quality and craftsmanship are outstanding, and the customer service was exceptional throughout the entire process.",
  },
  {
    name: "Aditya Patel",
    date: "February 28, 2025",
    rating: 5,
    text: "My wife absolutely loved the anniversary gift I got her from Jatin Jewellers. The diamond earrings are stunning, and the lab-grown diamonds are indistinguishable from mined ones. Highly recommend!",
  },
  {
    name: "Meera Singh",
    date: "February 15, 2025",
    rating: 5,
    text: "I was initially skeptical about lab-grown diamonds, but after visiting Jatin Jewellers and seeing the quality firsthand, I'm a convert. Beautiful jewelry at a more accessible price point without compromising on quality.",
  },
  {
    name: "Vikram Malhotra",
    date: "January 30, 2025",
    rating: 4,
    text: "The engagement ring I purchased was beautiful and my fiancée loves it. The only reason for 4 stars instead of 5 is that delivery took slightly longer than expected, but the quality was worth the wait.",
  },
  {
    name: "Neha Joshi",
    date: "January 18, 2025",
    rating: 5,
    text: "Excellent experience from browsing to purchase. The website is easy to navigate, and the pieces are even more beautiful in person. I'll definitely be shopping at Jatin Jewellers again.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair text-center mb-12 text-gray-800">
          Customer Reviews
        </h2>

        <Carousel
          opts={{ loop: true, align: "start" }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, i) => (
              <CarouselItem key={i} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < testimonial.rating ? "fill-gold text-gold" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">{testimonial.date}</span>
                  </div>
                  <p className="text-gray-600 italic mb-4 flex-grow">{testimonial.text}</p>
                  <div className="font-medium text-gray-800">{testimonial.name}</div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative static translate-y-0 mr-2" />
            <CarouselNext className="relative static translate-y-0" />
          </div>
        </Carousel>

        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/place/Jatin+Jewellers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-dark hover:underline inline-flex items-center"
          >
            View all reviews on Google
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
