export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  subCategory?: string;
  imageUrl: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  metadata?: Record<string, any>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subCategories?: SubCategory[];
  productCount: number;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategoryId: string;
}

export interface ProductUpdateInput extends Partial<Omit<Product, 'id'>> {
  id: string;
}

export interface CategoryUpdateInput extends Partial<Omit<Category, 'id'>> {
  id: string;
}

export interface SubCategoryUpdateInput extends Partial<Omit<SubCategory, 'id'>> {
  id: string;
} 