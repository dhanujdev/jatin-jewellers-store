import { ArrowLeftRight, Award, Package, Shield, Truck } from 'lucide-react';

const promises = [
  {
    title: "80% Buyback",
    description: "Get up to 80% of your original value back when you return your jewelry.",
    icon: ArrowLeftRight,
  },
  {
    title: "100% Exchange",
    description: "Exchange your jewelry with any other piece of equal or higher value.",
    icon: ArrowLeftRight,
  },
  {
    title: "Certified Jewelry",
    description: "All our diamonds come with IGI or GIA certification.",
    icon: Award,
  },
  {
    title: "Free Shipping & Insurance",
    description: "Enjoy free, fully insured shipping on all orders.",
    icon: Truck,
  },
  {
    title: "Hallmarked Gold",
    description: "All our gold jewelry is BIS Hallmarked for quality assurance.",
    icon: Shield,
  },
  {
    title: "Easy 15 Day Returns",
    description: "Not satisfied? Return within 15 days for a full refund.",
    icon: Package,
  },
];

export default function OurPromise() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair text-center mb-12 text-gray-800">
          Our Promise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promises.map((promise, index) => (
            <div
              key={index}
              className="flex items-start p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="mr-4 text-gold">
                <promise.icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{promise.title}</h3>
                <p className="text-gray-600">{promise.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-3xl mx-auto">
            At Jatin Jewellers, we take pride in our commitment to quality, transparency, and customer satisfaction.
            Our lab-grown diamonds are ethically sourced, environmentally friendly, and indistinguishable from mined diamonds.
          </p>
        </div>
      </div>
    </section>
  );
}
