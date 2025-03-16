import React from 'react';

interface Product {
  id: string;
  name: string;
  price?: number;
  formattedPrice?: string;
}

interface AddToCartProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function AddToCart({ product, quantity, onQuantityChange }: AddToCartProps) {
  return (
    <div className="add-to-cart" data-testid="add-to-cart">
      <div className="flex items-center mb-4">
        <label htmlFor="quantity" className="mr-4 text-gray-700">
          Quantity:
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gold"
          data-testid="quantity-select"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      
      <button
        className="w-full bg-gold hover:bg-gold-dark text-white py-3 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
        data-testid="add-to-cart-button"
      >
        Add to Cart - {product.formattedPrice || `$${product.price?.toLocaleString()}`}
      </button>
    </div>
  );
} 