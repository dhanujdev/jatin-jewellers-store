const fs = require('fs');
const path = require('path');
const { processData } = require('../../data/processData');

// Mock the fs module
jest.mock('fs');

// Mock the path module
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  resolve: jest.fn((...args) => args.join('/'))
}));

// Mock console.log and console.error to prevent noise in test output
// Uncomment these lines if you want to suppress console output
// jest.spyOn(console, 'log').mockImplementation(() => {});
// jest.spyOn(console, 'error').mockImplementation(() => {});

describe('processData.js', () => {
  // Mock dependencies
  let mockFs;
  let mockPath;
  let mockCwd;
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock fs methods
    mockFs = {
      existsSync: jest.fn(),
      mkdirSync: jest.fn(),
      readFileSync: jest.fn(),
      writeFileSync: jest.fn(),
      readdirSync: jest.fn(),
      statSync: jest.fn()
    };
    
    // Mock path methods
    mockPath = {
      join: jest.fn((...args) => args.join('/'))
    };
    
    // Mock cwd function
    mockCwd = jest.fn().mockReturnValue('/mock/project/root');
    
    // Setup default mock behaviors
    mockFs.existsSync.mockImplementation((path) => {
      if (path === '/mock/project/root/src/data') {
        return false; // First check in the script
      }
      return true; // All other checks
    });
    
    mockFs.readFileSync.mockImplementation((filePath, encoding) => {
      if (filePath.includes('category_index.json')) {
        return JSON.stringify({
          categories: ['rings', 'earrings', 'necklaces']
        });
      }
      
      // Mock product data files
      if (filePath.includes('data.json')) {
        const category = filePath.includes('rings') ? 'rings' : 
                         filePath.includes('earrings') ? 'earrings' : 'necklaces';
        const productId = filePath.includes('product-1') ? 'product-1' : 
                          filePath.includes('product-2') ? 'product-2' : 'product-3';
        
        return JSON.stringify({
          id: productId,
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} ${productId}`,
          description: `Beautiful ${category} product`,
          price: category === 'rings' ? 25000 : category === 'earrings' ? 15000 : 35000,
          category: category
        });
      }
      
      return '{}';
    });
    
    mockFs.readdirSync.mockImplementation((path) => {
      if (path.includes('rings')) {
        return ['product-1', 'product-2'];
      }
      if (path.includes('earrings')) {
        return ['product-1'];
      }
      if (path.includes('necklaces')) {
        return ['product-1', 'product-2', 'product-3'];
      }
      return [];
    });
    
    mockFs.statSync.mockImplementation((path) => ({
      isDirectory: () => !path.includes('not-a-directory')
    }));
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console mocks
    console.log.mockRestore();
    console.error.mockRestore();
  });
  
  it('creates output directory if it does not exist', async () => {
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if mkdirSync was called with the correct arguments
    expect(mockFs.mkdirSync).toHaveBeenCalledWith('/mock/project/root/src/data', { recursive: true });
  });
  
  it('reads the category index file', async () => {
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if readFileSync was called with the correct arguments
    expect(mockFs.readFileSync).toHaveBeenCalledWith(
      '/mock/project/root/../final_dataset/category_index.json',
      'utf8'
    );
  });
  
  it('processes each category', async () => {
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if readdirSync was called for each category
    expect(mockFs.readdirSync).toHaveBeenCalledWith('/mock/project/root/../final_dataset/products/rings');
    expect(mockFs.readdirSync).toHaveBeenCalledWith('/mock/project/root/../final_dataset/products/earrings');
    expect(mockFs.readdirSync).toHaveBeenCalledWith('/mock/project/root/../final_dataset/products/necklaces');
  });
  
  it('reads product data for each product', async () => {
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if readFileSync was called for each product's data.json
    expect(mockFs.readFileSync).toHaveBeenCalledWith(
      '/mock/project/root/../final_dataset/products/rings/product-1/data.json',
      'utf8'
    );
    expect(mockFs.readFileSync).toHaveBeenCalledWith(
      '/mock/project/root/../final_dataset/products/rings/product-2/data.json',
      'utf8'
    );
    expect(mockFs.readFileSync).toHaveBeenCalledWith(
      '/mock/project/root/../final_dataset/products/earrings/product-1/data.json',
      'utf8'
    );
  });
  
  it('adds image paths to product data', async () => {
    const result = await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if image paths were added to the product data
    expect(result.productsByCategory.rings).toBeDefined();
    expect(result.productsByCategory.rings[0].imagePath).toBe('/products/rings/product-1/image.jpg');
    expect(result.productsByCategory.rings[0].thumbnailPath).toBe('/products/rings/product-1/thumbnail.jpg');
  });
  
  it('writes category-specific product files', async () => {
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if writeFileSync was called for each category
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      '/mock/project/root/src/data/rings.json',
      expect.any(String)
    );
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      '/mock/project/root/src/data/earrings.json',
      expect.any(String)
    );
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      '/mock/project/root/src/data/necklaces.json',
      expect.any(String)
    );
  });
  
  it('writes all-products.json file', async () => {
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if writeFileSync was called for all-products.json
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      '/mock/project/root/src/data/all-products.json',
      expect.any(String)
    );
  });
  
  it('writes products-by-category.json file', async () => {
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if writeFileSync was called for products-by-category.json
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      '/mock/project/root/src/data/products-by-category.json',
      expect.any(String)
    );
  });
  
  it('writes categories.json file', async () => {
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if writeFileSync was called for categories.json
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      '/mock/project/root/src/data/categories.json',
      expect.any(String)
    );
  });
  
  it('handles errors when processing product data', async () => {
    // Mock readFileSync to throw an error for data.json files
    mockFs.readFileSync.mockImplementation((filePath, encoding) => {
      if (filePath.includes('data.json')) {
        throw new Error('Mock error');
      }
      if (filePath.includes('category_index.json')) {
        return JSON.stringify({
          categories: ['rings', 'earrings', 'necklaces']
        });
      }
      return '{}';
    });
    
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if console.error was called
    expect(console.error).toHaveBeenCalled();
  });
  
  it('skips non-directory entries in category folders', async () => {
    // Set up readdirSync to include a non-directory entry
    mockFs.readdirSync.mockImplementation((path) => {
      if (path.includes('rings')) {
        return ['product-1', 'not-a-directory'];
      }
      if (path.includes('earrings')) {
        return ['product-1'];
      }
      if (path.includes('necklaces')) {
        return ['product-1', 'product-2', 'product-3'];
      }
      return [];
    });
    
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check that readFileSync was still called for the directory
    expect(mockFs.readFileSync).toHaveBeenCalledWith(
      '/mock/project/root/../final_dataset/products/rings/product-1/data.json',
      'utf8'
    );
  });
  
  it('handles missing data files', async () => {
    // Set up existsSync to return false for data files
    mockFs.existsSync.mockImplementation((path) => {
      if (path === '/mock/project/root/src/data') {
        return false;
      }
      if (path.includes('data.json')) {
        return false;
      }
      return true;
    });
    
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if console.log was called with the expected message
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Data file not found'));
  });
  
  it('handles missing category directories', async () => {
    // Set up existsSync to return false for category directories
    mockFs.existsSync.mockImplementation((path) => {
      if (path === '/mock/project/root/src/data') {
        return false;
      }
      if (path.includes('/products/')) {
        return false;
      }
      return true;
    });
    
    await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if console.log was called with the expected message
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Category directory not found'));
  });
  
  it('handles errors when reading category index file', async () => {
    // Mock readFileSync to throw an error for category_index.json
    mockFs.readFileSync.mockImplementation((filePath, encoding) => {
      if (filePath.includes('category_index.json')) {
        throw new Error('Mock error');
      }
      return '{}';
    });
    
    const result = await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if default categories were used
    expect(result.categories.categories).toEqual(['rings', 'earrings', 'necklaces']);
    expect(console.error).toHaveBeenCalled();
  });
  
  it('handles errors when parsing category index JSON', async () => {
    // Mock readFileSync to return invalid JSON for category_index.json
    mockFs.readFileSync.mockImplementation((filePath, encoding) => {
      if (filePath.includes('category_index.json')) {
        return 'invalid json';
      }
      return '{}';
    });
    
    const result = await processData({ fs: mockFs, path: mockPath, cwd: mockCwd });
    
    // Check if default categories were used
    expect(result.categories.categories).toEqual(['rings', 'earrings', 'necklaces']);
    expect(console.error).toHaveBeenCalled();
  });
}); 