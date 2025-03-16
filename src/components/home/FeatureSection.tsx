import { Award, Gem, Truck, RotateCcw } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: <Gem className="h-10 w-10 text-gold" />,
    title: "Exquisite Craftsmanship",
    description: "Each piece is meticulously crafted by our skilled artisans with attention to every detail."
  },
  {
    id: 2,
    icon: <Award className="h-10 w-10 text-gold" />,
    title: "Certified Quality",
    description: "All our diamonds and gemstones are certified for authenticity and exceptional quality."
  },
  {
    id: 3,
    icon: <Truck className="h-10 w-10 text-gold" />,
    title: "Free Shipping",
    description: "Enjoy complimentary shipping on all orders within India, securely packaged."
  },
  {
    id: 4,
    icon: <RotateCcw className="h-10 w-10 text-gold" />,
    title: "30-Day Returns",
    description: "Not completely satisfied? Return your purchase within 30 days for a full refund."
  }
];

export default function FeatureSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:shadow-md"
            >
              <div className="mb-4 p-3 rounded-full bg-cream-light">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 