import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getCategoryInfo,
  searchProducts,
  getRelatedProducts,
  createPaginationMetadata,
  Product
} from '@/lib/products';

// Mock the data imports
jest.mock('@/data/all-products.json', () => [
  {
    id: 'product-1',
    title: 'Test Product 1',
    category: 'rings',
    description: 'This is test product 1',
    materials: ['Gold', 'Diamond'],
    features: 'Feature 1, Feature 2',
    colors: ['Gold'],
    occasions: ['Wedding'],
    tags: ['gold', 'diamond', 'wedding'],
    imagePath: '/test-image-1.jpg',
    thumbnailPath: '/test-thumbnail-1.jpg',
    slug: 'test-product-1'
  },
  {
    id: 'product-2',
    title: 'Test Product 2',
    category: 'earrings',
    description: 'This is test product 2',
    materials: ['Silver', 'Ruby'],
    features: 'Feature 1, Feature 2',
    colors: ['Silver'],
    occasions: ['Party'],
    tags: ['silver', 'ruby', 'party'],
    imagePath: '/test-image-2.jpg',
    thumbnailPath: '/test-thumbnail-2.jpg',
    slug: 'test-product-2'
  },
  {
    id: 'product-3',
    title: 'Test Product 3',
    category: 'rings',
    description: 'This is test product 3',
    materials: ['Gold', 'Emerald'],
    features: 'Feature 1, Feature 2',
    colors: ['Gold'],
    occasions: ['Casual'],
    tags: ['gold', 'emerald', 'casual'],
    imagePath: '/test-image-3.jpg',
    thumbnailPath: '/test-thumbnail-3.jpg',
    slug: 'test-product-3'
  }
]);

jest.mock('@/data/products-by-category.json', () => ({
  rings: [
    {
      id: 'product-1',
      title: 'Test Product 1',
      category: 'rings',
      description: 'This is test product 1',
      materials: ['Gold', 'Diamond'],
      features: 'Feature 1, Feature 2',
      colors: ['Gold'],
      occasions: ['Wedding'],
      tags: ['gold', 'diamond', 'wedding'],
      imagePath: '/test-image-1.jpg',
      thumbnailPath: '/test-thumbnail-1.jpg',
      slug: 'test-product-1'
    },
    {
      id: 'product-3',
      title: 'Test Product 3',
      category: 'rings',
      description: 'This is test product 3',
      materials: ['Gold', 'Emerald'],
      features: 'Feature 1, Feature 2',
      colors: ['Gold'],
      occasions: ['Casual'],
      tags: ['gold', 'emerald', 'casual'],
      imagePath: '/test-image-3.jpg',
      thumbnailPath: '/test-thumbnail-3.jpg',
      slug: 'test-product-3'
    }
  ],
  earrings: [
    {
      id: 'product-2',
      title: 'Test Product 2',
      category: 'earrings',
      description: 'This is test product 2',
      materials: ['Silver', 'Ruby'],
      features: 'Feature 1, Feature 2',
      colors: ['Silver'],
      occasions: ['Party'],
      tags: ['silver', 'ruby', 'party'],
      imagePath: '/test-image-2.jpg',
      thumbnailPath: '/test-thumbnail-2.jpg',
      slug: 'test-product-2'
    }
  ]
}));

jest.mock('@/data/categories.json', () => ({
  categories: ['rings', 'earrings', 'necklaces', 'bangles', 'waistbands'],
  total_products: 3,
  category_counts: {
    rings: 2,
    earrings: 1,
    necklaces: 0,
    bangles: 0,
    waistbands: 0
  }
}));

describe('Product Utility Functions', () => {
  describe('getAllProducts', () => {
    it('returns all products', () => {
      const products = getAllProducts();
      expect(products).toHaveLength(3);
      expect(products[0].id).toBe('product-1');
      expect(products[1].id).toBe('product-2');
      expect(products[2].id).toBe('product-3');
    });
  });

  describe('getProductById', () => {
    it('returns a product by ID', () => {
      const product = getProductById('product-2');
      expect(product).not.toBeNull();
      expect(product?.id).toBe('product-2');
      expect(product?.title).toBe('Test Product 2');
    });

    it('returns null for non-existent product ID', () => {
      const product = getProductById('non-existent');
      expect(product).toBeNull();
    });
  });

  describe('getProductsByCategory', () => {
    it('returns products for a specific category with default pagination', () => {
      const result = getProductsByCategory('rings');
      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('product-1');
      expect(result.data[1].id).toBe('product-3');
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.currentPage).toBe(1);
    });

    it('returns empty array for non-existent category', () => {
      const result = getProductsByCategory('non-existent');
      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    it('handles pagination correctly', () => {
      const result = getProductsByCategory('rings', 1, 1);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.pageCount).toBe(2);
      expect(result.pagination.hasMorePages).toBe(true);
    });
  });

  describe('getFeaturedProducts', () => {
    it('returns the specified number of featured products', () => {
      const featured = getFeaturedProducts(2);
      expect(featured).toHaveLength(2);
    });

    it('returns all products if count is greater than total products', () => {
      const featured = getFeaturedProducts(10);
      expect(featured).toHaveLength(3);
    });
  });

  describe('getCategoryInfo', () => {
    it('returns category information', () => {
      const info = getCategoryInfo();
      expect(info.categories).toHaveLength(5);
      expect(info.total_products).toBe(3);
      expect(info.category_counts.rings).toBe(2);
      expect(info.category_counts.earrings).toBe(1);
    });
  });

  describe('searchProducts', () => {
    it('finds products matching the search term in title', () => {
      const result = searchProducts('Test Product 1');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('product-1');
    });

    it('finds products matching the search term in description', () => {
      const result = searchProducts('test product');
      expect(result.data).toHaveLength(3);
    });

    it('finds products matching the search term in tags', () => {
      const result = searchProducts('emerald');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('product-3');
    });

    it('returns empty array for non-matching search term', () => {
      const result = searchProducts('non-existent');
      expect(result.data).toHaveLength(0);
    });
  });

  describe('getRelatedProducts', () => {
    it('returns related products from the same category', () => {
      const related = getRelatedProducts('product-1');
      expect(related).toHaveLength(1);
      expect(related[0].id).toBe('product-3');
    });

    it('returns empty array for non-existent product ID', () => {
      const related = getRelatedProducts('non-existent');
      expect(related).toHaveLength(0);
    });
  });

  describe('createPaginationMetadata', () => {
    it('creates correct pagination metadata', () => {
      const pagination = createPaginationMetadata(10, 2, 3);
      expect(pagination.total).toBe(10);
      expect(pagination.pageCount).toBe(4);
      expect(pagination.currentPage).toBe(2);
      expect(pagination.perPage).toBe(3);
      expect(pagination.from).toBe(4);
      expect(pagination.to).toBe(6);
      expect(pagination.hasMorePages).toBe(true);
    });

    it('handles last page correctly', () => {
      const pagination = createPaginationMetadata(10, 4, 3);
      expect(pagination.from).toBe(10);
      expect(pagination.to).toBe(10);
      expect(pagination.hasMorePages).toBe(false);
    });
  });
}); 