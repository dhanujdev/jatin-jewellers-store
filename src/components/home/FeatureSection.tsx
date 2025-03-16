import { Award, Gem, Truck, RotateCcw, Star } from 'lucide-react';

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
    title: "Certified Diamonds",
    description: "All our diamonds are certified for authenticity, exceptional quality, and ethical sourcing."
  },
  {
    id: 3,
    icon: <Star className="h-10 w-10 text-gold" />,
    title: "Premium Quality",
    description: "We use only the finest materials to ensure exceptional quality in every piece we create."
  },
  {
    id: 4,
    icon: <RotateCcw className="h-10 w-10 text-gold" />,
    title: "Bespoke Designs",
    description: "Custom-designed jewelry created to your specifications for truly unique pieces."
  }
];

export default function FeatureSection() {
  return (
    <section className="py-16 bg-white border-t border-b border-gray-200 text-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="mb-4 p-3 rounded-full bg-gray-100">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-black mb-2">
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