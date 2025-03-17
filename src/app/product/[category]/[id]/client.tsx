"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle 
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import customImageLoader from '@/lib/imageLoader';

interface Material {
  name: string;
  description: string;
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
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    formattedPrice: string;
    image: string;
    category: string;
    materials: Material[];
    slug: string;
  };
  relatedProducts: RelatedProduct[];
  categoryDisplayName: string;
}

export default function ProductClient({
  product,
  relatedProducts,
  categoryDisplayName
}: ProductClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Product image
  const productImage = product.image;

  // Generate additional images for demo purposes - for now, we'll just use the main image
  // In a real implementation, you would fetch multiple images from the backend
  const additionalImages: string[] = [];

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
              {categoryDisplayName}
            </Link>
          </li>
          <li className="mx-2 text-gray-500">/</li>
          <li className="text-gray-800">{product.name}</li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="flex justify-center items-center">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <div className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-gold transition-colors max-w-md">
                <Image
                  src={productImage}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain transition-transform hover:scale-105"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <DialogTitle className="sr-only">
                {product.name} - Enlarged View
              </DialogTitle>
              <div className="relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
                <Image
                  src={productImage}
                  alt={product.name}
                  width={1200}
                  height={1200}
                  className="w-full h-auto object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-playfair text-gray-800 mb-4">{product.name}</h1>
          <p className="text-2xl text-gold font-semibold mb-6">Product ID: {product.id}</p>
          
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Product Details</h3>
            <ul className="text-gray-600 space-y-2">
              <li>
                <span className="font-medium">Category:</span> {categoryDisplayName}
              </li>
              <li>
                <span className="font-medium">Product ID:</span> {product.id}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-16">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="care">Care Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-6 bg-gray-50 rounded-b-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Product Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
              <br /><br />
              Each piece is meticulously crafted by our skilled artisans, ensuring exceptional quality and attention to detail.
              Our jewelry is designed to be timeless, allowing you to cherish it for years to come.
            </p>
          </TabsContent>
          <TabsContent value="materials" className="p-6 bg-gray-50 rounded-b-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Materials Used</h3>
            <div className="space-y-4">
              {product.materials && product.materials.length > 0 ? (
                product.materials.map((material, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-gray-700">{material.name}</h4>
                    <p className="text-gray-600">{material.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  This product is crafted using the finest materials, including premium metals and ethically sourced gemstones.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="care" className="p-6 bg-gray-50 rounded-b-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Care Instructions</h3>
            <ul className="text-gray-600 space-y-2 list-disc pl-5">
              <li>Store your jewelry in a cool, dry place away from direct sunlight.</li>
              <li>Clean with a soft, lint-free cloth to maintain its shine.</li>
              <li>Avoid contact with perfumes, lotions, and chemicals.</li>
              <li>Remove jewelry before swimming, bathing, or engaging in physical activities.</li>
              <li>Have your jewelry professionally cleaned and inspected periodically.</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-playfair text-gray-800 mb-8 text-center">You May Also Like</h2>
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
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium group-hover:text-gold-dark transition-colors">
                    {relatedProduct.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
 