const fs = require('fs');
const path = require('path');

// Paths
const datasetPath = path.join(process.cwd(), '..', 'final_dataset');
const outputPath = path.join(process.cwd(), 'src', 'data');

// Ensure output directories exist
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Read category index
const categoryIndex = JSON.parse(fs.readFileSync(path.join(datasetPath, 'category_index.json'), 'utf8'));
const categories = categoryIndex.categories;

// Process each category
const allProducts = [];
const productsByCategory = {};

categories.forEach(category => {
  const categoryPath = path.join(datasetPath, 'products', category);
  const categoryProducts = [];
  
  // Skip if category directory doesn't exist
  if (!fs.existsSync(categoryPath)) {
    console.log(`Category directory not found: ${categoryPath}`);
    return;
  }
  
  // Get all product directories in this category
  const productDirs = fs.readdirSync(categoryPath);
  
  productDirs.forEach(productDir => {
    const productPath = path.join(categoryPath, productDir);
    
    // Skip if not a directory
    if (!fs.statSync(productPath).isDirectory()) {
      return;
    }
    
    // Read product data
    const dataFilePath = path.join(productPath, 'data.json');
    if (!fs.existsSync(dataFilePath)) {
      console.log(`Data file not found: ${dataFilePath}`);
      return;
    }
    
    try {
      const productData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      
      // Add image paths
      productData.imagePath = `/products/${category}/${productDir}/image.jpg`;
      productData.thumbnailPath = `/products/${category}/${productDir}/thumbnail.jpg`;
      
      // Add to category products
      categoryProducts.push(productData);
      
      // Add to all products
      allProducts.push(productData);
    } catch (error) {
      console.error(`Error processing ${dataFilePath}:`, error);
    }
  });
  
  // Save category products to file
  productsByCategory[category] = categoryProducts;
  fs.writeFileSync(
    path.join(outputPath, `${category}.json`), 
    JSON.stringify(categoryProducts, null, 2)
  );
  console.log(`Processed ${categoryProducts.length} products for ${category}`);
});

// Save all products to file
fs.writeFileSync(
  path.join(outputPath, 'all-products.json'), 
  JSON.stringify(allProducts, null, 2)
);

// Save products by category index
fs.writeFileSync(
  path.join(outputPath, 'products-by-category.json'), 
  JSON.stringify(productsByCategory, null, 2)
);

// Save category metadata
fs.writeFileSync(
  path.join(outputPath, 'categories.json'), 
  JSON.stringify(categoryIndex, null, 2)
);

console.log(`Processed ${allProducts.length} products in total`);
console.log('Data processing complete!'); 