import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    name?: string;
    title?: string;
    price?: number;
    formattedPrice?: string;
    image?: string;
    imagePath?: string;
    category: string;
    slug: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use name or title, depending on what's available
  const displayName = product.name || product.title || 'Product';
  const displayImage = product.image || product.imagePath || '/placeholder.jpg';
  
  return (
    <Link
      href={`/product/${product.category}/${product.slug}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      data-testid="product-card"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={displayImage}
          alt={displayName}
          width={300}
          height={300}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          data-testid="product-image"
        />
      </div>
      <div className="p-4">
        <h3 className="text-gray-800 font-medium group-hover:text-gold-dark transition-colors" data-testid="product-title">
          {displayName}
        </h3>
        {(product.price || product.formattedPrice) && (
          <p className="text-gold mt-1" data-testid="product-price">
            {product.formattedPrice || `$${product.price?.toLocaleString()}`}
          </p>
        )}
      </div>
    </Link>
  );
} 