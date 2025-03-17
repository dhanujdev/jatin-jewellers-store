import fs from 'fs/promises';
import path from 'path';
import { Product, Category, SubCategory, ProductUpdateInput, CategoryUpdateInput, SubCategoryUpdateInput } from '@/types/product';

const DATA_DIR = path.join(process.cwd(), 'src/data');

export class AdminService {
  private static instance: AdminService;

  private constructor() {}

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async getAllProducts(): Promise<Product[]> {
    const data = await fs.readFile(path.join(DATA_DIR, 'all-products.json'), 'utf-8');
    return JSON.parse(data);
  }

  async getCategories(): Promise<Category[]> {
    const data = await fs.readFile(path.join(DATA_DIR, 'categories.json'), 'utf-8');
    const rawData = JSON.parse(data);
    
    // Transform the data into the expected Category format
    return rawData.categories.map((categoryId: string) => ({
      id: categoryId,
      name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
      slug: categoryId,
      description: `Collection of beautiful ${categoryId}`,
      productCount: rawData.category_counts[categoryId] || 0,
      subCategories: []
    }));
  }

  async updateProduct(input: ProductUpdateInput): Promise<Product> {
    const products = await this.getAllProducts();
    const index = products.findIndex(p => p.id === input.id);
    
    if (index === -1) {
      throw new Error(`Product with id ${input.id} not found`);
    }

    const updatedProduct = {
      ...products[index],
      ...input,
    };

    products[index] = updatedProduct;
    await this.saveProducts(products);

    // Update category-specific file
    const categoryProducts = await this.getProductsByCategory(updatedProduct.category);
    const categoryIndex = categoryProducts.findIndex(p => p.id === input.id);
    
    if (categoryIndex !== -1) {
      categoryProducts[categoryIndex] = updatedProduct;
      await this.saveProductsByCategory(updatedProduct.category, categoryProducts);
    }

    return updatedProduct;
  }

  async updateCategory(input: CategoryUpdateInput): Promise<Category> {
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === input.id);
    
    if (index === -1) {
      throw new Error(`Category with id ${input.id} not found`);
    }

    const updatedCategory = {
      ...categories[index],
      ...input,
    };

    categories[index] = updatedCategory;
    await this.saveCategories(categories);

    return updatedCategory;
  }

  async addSubCategory(categoryId: string, input: Omit<SubCategory, 'id' | 'parentCategoryId'>): Promise<SubCategory> {
    const categories = await this.getCategories();
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }

    const newSubCategory: SubCategory = {
      ...input,
      id: this.generateId(),
      parentCategoryId: categoryId,
    };

    if (!category.subCategories) {
      category.subCategories = [];
    }

    category.subCategories.push(newSubCategory);
    await this.saveCategories(categories);

    return newSubCategory;
  }

  private async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const data = await fs.readFile(path.join(DATA_DIR, `${category.toLowerCase()}.json`), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async saveProducts(products: Product[]): Promise<void> {
    await fs.writeFile(
      path.join(DATA_DIR, 'all-products.json'),
      JSON.stringify(products, null, 2)
    );
  }

  private async saveProductsByCategory(category: string, products: Product[]): Promise<void> {
    await fs.writeFile(
      path.join(DATA_DIR, `${category.toLowerCase()}.json`),
      JSON.stringify(products, null, 2)
    );
  }

  private async saveCategories(categories: Category[]): Promise<void> {
    // Transform Category[] back to the original format
    const transformedData = {
      categories: categories.map(c => c.slug),
      total_products: categories.reduce((sum, c) => sum + c.productCount, 0),
      category_counts: categories.reduce((acc, c) => ({
        ...acc,
        [c.slug]: c.productCount
      }), {})
    };

    await fs.writeFile(
      path.join(DATA_DIR, 'categories.json'),
      JSON.stringify(transformedData, null, 2)
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
} 