import React, { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <div data-testid="image-gallery">
      <div className="mb-4 bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={`${productName} - Main View`}
          width={600}
          height={600}
          className="w-full h-auto object-contain"
          data-testid="main-image"
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              className={`bg-gray-50 rounded-lg overflow-hidden border-2 ${
                selectedImage === index ? 'border-gold' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(index)}
              data-testid={`thumbnail-${index}`}
            >
              <Image
                src={image}
                alt={`${productName} view ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-auto object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 