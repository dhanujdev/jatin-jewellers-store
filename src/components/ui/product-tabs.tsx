import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  materials?: string;
  dimensions?: string;
  care?: string;
}

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="product-tabs">
      <div className="tabs-header">
        <ul className="flex border-b">
          <li
            className={`px-4 py-2 cursor-pointer ${activeTab === 'description' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('description')}
            data-testid="tab-description"
          >
            Description
          </li>
          {product.materials && (
            <li
              className={`px-4 py-2 cursor-pointer ${activeTab === 'materials' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('materials')}
              data-testid="tab-materials"
            >
              Materials
            </li>
          )}
          {product.dimensions && (
            <li
              className={`px-4 py-2 cursor-pointer ${activeTab === 'dimensions' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('dimensions')}
              data-testid="tab-dimensions"
            >
              Dimensions
            </li>
          )}
          {product.care && (
            <li
              className={`px-4 py-2 cursor-pointer ${activeTab === 'care' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('care')}
              data-testid="tab-care"
            >
              Care Instructions
            </li>
          )}
        </ul>
      </div>
      <div className="tabs-content p-4">
        {activeTab === 'description' && (
          <div data-testid="product-description">
            {product.description}
          </div>
        )}
        {activeTab === 'materials' && product.materials && (
          <div data-testid="product-materials">
            {product.materials}
          </div>
        )}
        {activeTab === 'dimensions' && product.dimensions && (
          <div data-testid="product-dimensions">
            {product.dimensions}
          </div>
        )}
        {activeTab === 'care' && product.care && (
          <div data-testid="product-care">
            {product.care}
          </div>
        )}
      </div>
    </div>
  );
} 