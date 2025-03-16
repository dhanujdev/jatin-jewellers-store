/**
 * Tests for the processData utility
 * 
 * This file tests the functionality for processing product data
 */

import fs from 'fs';
import path from 'path';
import { processData } from '@/data/processData';

// Mock the file system modules
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn().mockResolvedValue(undefined),
    mkdir: jest.fn().mockResolvedValue(undefined)
  },
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({
    categories: [
      { id: 'rings', name: 'Rings' },
      { id: 'necklaces', name: 'Necklaces' }
    ]
  })),
  writeFileSync: jest.fn(),
  readdirSync: jest.fn().mockReturnValue(['product1', 'product2']),
  statSync: jest.fn().mockReturnValue({
    isDirectory: () => true
  })
}));

jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/')),
  dirname: jest.fn().mockImplementation((p) => p.split('/').slice(0, -1).join('/'))
}));

// Mock process.cwd
jest.mock('process', () => ({
  cwd: jest.fn().mockReturnValue('/mock/cwd')
}));

// Mock console methods to prevent noise in test output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  jest.clearAllMocks();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('processData', () => {
  it('should process data successfully', async () => {
    // Call the function
    await processData();
    
    // Check if writeFileSync was called
    expect(fs.writeFileSync).toHaveBeenCalled();
    
    // Check if logs were called
    expect(console.log).toHaveBeenCalled();
  });

  it('should create output directory if it does not exist', async () => {
    // Mock existsSync to return false for the first call (output directory check)
    fs.existsSync.mockReturnValueOnce(false);
    
    // Call the function
    await processData();
    
    // Check if mkdirSync was called
    expect(fs.mkdirSync).toHaveBeenCalled();
  });

  it('should handle errors in the main process', async () => {
    // Mock readFileSync to throw an error
    fs.readFileSync.mockImplementationOnce(() => {
      throw new Error('Mock file read error');
    });
    
    // Call the function - it should not throw but return default categories
    const result = await processData();
    
    // Check if error was logged
    expect(console.error).toHaveBeenCalled();
    
    // Check if default categories were used
    expect(result.categories.categories).toEqual(['rings', 'earrings', 'necklaces']);
  });
}); 