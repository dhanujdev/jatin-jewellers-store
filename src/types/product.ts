export interface Product {
  id: string;
  title: string;
  category: string;
  original_type: string;
  materials: string[];
  features: string;
  colors: string[];
  occasions: string[];
  description: string;
  tags: string[];
  original_id: string;
  collection: string;
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