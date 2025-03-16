import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  slug: string;
}

interface RelatedProductsProps {
  products: Product[];
  category: string;
  currentProductId: string;
}

export function RelatedProducts({ products, category, currentProductId }: RelatedProductsProps) {
  // Filter out the current product
  const filteredProducts = products.filter(product => product.id !== currentProductId);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="related-products mt-12" data-testid="related-products">
      <h2 className="text-2xl font-playfair text-gray-800 mb-6">You May Also Like</h2>
      <span data-testid="related-category" className="hidden">Category: {category}</span>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Link 
            href={`/product/${product.category}/${product.slug}`} 
            key={product.id}
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="text-gray-800 font-medium group-hover:text-gold-dark transition-colors">
                {product.name}
              </h3>
              <p className="text-gold mt-2 font-medium">{product.formattedPrice}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 