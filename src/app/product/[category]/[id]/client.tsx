"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import customImageLoader from '@/lib/imageLoader';

interface FormattedProduct extends Product {
  formattedPrice: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  slug: string;
}

interface ProductClientProps {
  product: FormattedProduct;
  relatedProducts: RelatedProduct[];
}

export default function ProductClient({ 
  product, 
  relatedProducts
}: ProductClientProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex text-sm">
          <li className="mr-2">
            <Link href="/" className="text-gray-500 hover:text-gold">
              Home
            </Link>
          </li>
          <li className="mx-2 text-gray-500">/</li>
          <li className="mr-2">
            <Link href={`/category/${product.category}`} className="text-gray-500 hover:text-gold">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
          </li>
          <li className="mx-2 text-gray-500">/</li>
          <li className="text-gray-800">{product.title}</li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative h-[500px] rounded-lg overflow-hidden">
          <Image
            src={product.imagePath}
            alt={product.title}
            fill
            className="object-contain"
            priority
            loader={customImageLoader}
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-playfair text-gray-800 mb-4">{product.title}</h1>
          <p className="text-2xl text-gold font-semibold mb-6">{product.formattedPrice}</p>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {product.materials && product.materials.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Materials</h2>
              <ul className="list-disc list-inside text-gray-600">
                {product.materials.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>
          )}
          
          {product.features && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Features</h2>
              <p className="text-gray-600">{product.features}</p>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <button className="w-full bg-gold hover:bg-gold-dark text-white py-3 px-6 rounded transition-colors mb-4">
            Add to Cart
          </button>
          
          {/* Wishlist Button */}
          <button className="w-full border border-gray-300 text-gray-800 hover:bg-gray-50 py-3 px-6 rounded transition-colors">
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-playfair text-gray-800 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                href={`/product/${relatedProduct.category}/${relatedProduct.slug}`}
                key={relatedProduct.id}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    loader={customImageLoader}
                    priority={false}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium mb-1 group-hover:text-gold-dark transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-gold font-semibold">{relatedProduct.formattedPrice}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
 