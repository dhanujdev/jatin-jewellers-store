# Jatin Jewellers Store

## Recent Enhancements (March 2024)

### Performance and Stability Improvements
- **Enhanced Pagination**: 
  - Added "First" and "Last" page navigation buttons with improved accessibility
  - Implemented page number truncation for better UX with large page counts
  - Added item range display showing current items and total count
  - Improved handling of edge cases (single page, no items)
  - Enhanced URL generation with custom base path support
  - Fixed invalid page number handling to default to page 1
  - Improved page number validation and range checks
- **Next.js 15.2.0 Compatibility**: 
  - Updated async component handling for Next.js 15.2.0 compatibility
  - Properly awaiting dynamic parameters in server components
  - Enhanced error handling for dynamic routes
  - Optimized CSS with critters for better performance
  - Improved scroll restoration
- **Test Suite Improvements**: 
  - Updated test files to match the latest component implementations
  - Added comprehensive test coverage for pagination edge cases
  - Improved mock data for realistic pagination testing
  - Enhanced test assertions for better error detection
  - Achieved 84% statement coverage, 73% branch coverage
  - 211 passing tests across 30 test suites
- **Build Process**: 
  - Resolved build errors related to client-side navigation
  - Fixed hydration warnings in layout components
  - Improved handling of search parameters
  - Optimized static page generation (2,564 pages)
  - Reduced bundle sizes (First Load JS: 117 kB)
- **Code Quality**: 
  - Enhanced type safety across components
  - Improved error handling and validation
  - Better handling of edge cases in data processing
  - Updated component props for better type inference
  - Implemented proper TypeScript types

### Test Coverage Summary
- **Overall Coverage**:
  - Statements: 84%
  - Branches: 73%
  - Functions: 80%
  - Lines: 85%
- **Well-Tested Areas**:
  - App Components (95%+)
  - Home Components (97%+)
  - Layout Components (95%+)
  - Product Pages (97%+)
- **Areas for Improvement**:
  - UI Components (83%)
  - Search Functionality (68%)
  - Redis Implementation (70%)

### Next Steps
- Continue optimizing performance for large product catalogs
- Implement additional accessibility improvements
- Enhance mobile responsiveness for complex UI components
- Further improve error handling and user feedback
- Increase test coverage for UI components and search functionality
- Enhance Redis implementation testing

A modern e-commerce platform for Jatin Jewellers, showcasing a wide range of jewelry products including bangles, earrings, necklaces, rings, and waistbands.

![Jatin Jewellers Store](https://example.com/jatin-jewellers-preview.png)

## 🌟 Features

- **Responsive Design**: Fully responsive UI that works seamlessly across desktop, tablet, and mobile devices
- **Product Catalog**: Browse through 2,900+ jewelry products across 5 categories
- **Product Search**: Search functionality to find products quickly
- **Category Filtering**: Filter products by category
- **Product Details**: Detailed product pages with high-quality images and specifications
- **Featured Products**: Showcase of featured products on the homepage
- **Store Locations**: Information about physical store locations
- **SEO Optimized**: Built with SEO best practices in mind
- **Enhanced Mobile Experience**: Optimized mobile navigation, swipeable carousels, and touch-friendly interfaces
- **Pagination**: Browse products with easy-to-use pagination controls
- **Redis Caching**: Fast image loading with Redis-based caching system
- **Advanced Pagination**: Intuitive navigation with First, Previous, Next, and Last page controls, along with page numbers and product count display

## 📱 Mobile View Enhancements (v1.1.0)

The latest release includes significant improvements to the mobile experience:

- **Improved Mobile Navigation**: Enhanced drawer menu with categorized sections and better visual hierarchy
- **Mobile Search Bar**: Dedicated search functionality optimized for mobile devices
- **Swipeable Product Carousels**: Touch-friendly product browsing with horizontal swipe gestures
- **Collapsible Footer**: Space-efficient accordion sections for footer content on mobile
- **Enhanced Visual Elements**: Better text visibility, optimized spacing, and improved touch targets
- **Responsive Typography**: Adjusted font sizes and spacing for better readability on small screens
- **Performance Optimizations**: Improved loading and rendering for mobile devices

## 🚀 New Features (v1.6.1)

The latest release includes significant improvements to navigation and user experience:

- **Enhanced Pagination**: 
  - First and Last page navigation buttons for quick jumps
  - Improved visual feedback for current page
  - Product count display showing items per page
  - Optimized for both desktop and mobile views
- **Redis Image Caching**: Faster image loading with Redis-based caching system
- **Improved Search**: Enhanced search functionality with pagination support
- **Performance Optimizations**: Reduced page load times and improved overall responsiveness

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.0**: React framework for server-rendered applications
- **React 18.3.1**: JavaScript library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI components
- **Embla Carousel**: Lightweight carousel component
- **Lucide React**: Beautiful & consistent icon set

### Backend & Infrastructure
- **Redis**: In-memory data store for caching
- **Docker**: Containerization for development environment
- **Docker Compose**: Multi-container Docker applications

### Build Tools
- **Turbopack**: Incremental bundler and build system
- **ESLint**: JavaScript linter
- **Prettier**: Code formatter
- **PostCSS**: CSS transformation tool

### Deployment
- **Netlify**: Hosting and continuous deployment
- **Static Site Generation (SSG)**: Pre-rendered static pages for optimal performance

## 📊 Data Structure

The application uses JSON data files to store product information:

- **Total Products**: 2,901 products across 5 categories
- **Categories**:
  - Bangles (394 products)
  - Earrings (689 products)
  - Necklaces (1,722 products)
  - Rings (53 products)
  - Waistbands (43 products)

Data files:
- `all-products.json`: Contains all product data
- `products-by-category.json`: Products organized by category
- `categories.json`: Category metadata
- Individual category files (e.g., `bangles.json`, `earrings.json`, etc.)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- npm, yarn, pnpm, or bun package manager
- Docker and Docker Compose (for Redis)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jatin-jewellers-store.git
cd jatin-jewellers-store
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start Redis using Docker Compose:
```bash
docker-compose up -d
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
jatin-jewellers-store/
├── public/            # Static assets (images, fonts, etc.)
├── src/
│   ├── app/           # Next.js app router pages
│   │   ├── page.tsx   # Home page
│   │   ├── product/   # Product pages
│   │   ├── category/  # Category pages
│   │   ├── search/    # Search functionality
│   │   ├── api/       # API routes
│   │   │   └── image/ # Image caching API
│   │   └── layout.tsx # Root layout
│   ├── components/    # React components
│   │   ├── home/      # Homepage-specific components
│   │   ├── layout/    # Layout components (Header, Footer)
│   │   └── ui/        # Reusable UI components
│   ├── data/          # JSON data files
│   ├── lib/           # Utility functions
│   │   ├── redis.ts   # Redis client and caching utilities
│   │   ├── imageLoader.ts # Custom image loader with caching
│   │   └── products.ts # Product data utilities with pagination
│   └── types/         # TypeScript type definitions
├── docker-compose.yml # Docker Compose configuration for Redis
├── .env.local         # Environment variables
├── tailwind.config.ts # Tailwind CSS configuration
├── next.config.js     # Next.js configuration
└── package.json       # Project dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Run development server with Turbopack
- `npm run build` - Build for production
- `npm run export` - Export as static site
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run fmt` - Format code with Prettier

## 🚢 Deployment

The project is configured for deployment on Netlify:

1. The `netlify.toml` file contains the build configuration
2. The site is built using `bun run build`
3. The build output is in the `build` directory
4. The site is deployed as a static site (SSG)

### Redis Configuration for Production

For production deployment, you'll need to:
1. Set up a Redis instance (e.g., Redis Cloud, AWS ElastiCache)
2. Configure the `REDIS_URL` environment variable in your deployment platform

## 🧩 Components

### Layout Components
- **Header**: Navigation, search, and category links
- **Footer**: Links, contact information, and social media

### Home Page Components
- **HeroSection**: Main banner with featured content
- **CategorySection**: Display of product categories
- **FeaturedProducts**: Showcase of featured products
- **StoreLocations**: Physical store information

### UI Components
- **Pagination**: Component for navigating through paginated content

## 🎨 Styling

The project uses Tailwind CSS for styling with custom configuration:
- Custom color palette
- Responsive design utilities
- Animation utilities via tailwindcss-animate
- Component variants with class-variance-authority

## 🔄 Data Processing

The `processData.js` script is used to process and organize the product data into the appropriate JSON files.

## 📱 Responsive Design

The site is fully responsive with breakpoints for:
- Mobile devices (< 640px)
- Tablets (640px - 1023px)
- Desktop screens (1024px - 1279px)
- Large desktop screens (≥ 1280px)

Custom hooks for responsive design:
- `useIsMounted`: Handle client-side rendering safely

## 📋 Release History

- **v1.6.1**: Enhanced pagination with First/Last page navigation and improved UX
- **v1.6.0**: Added pagination and Redis caching for improved performance
- **v1.1.2**: Fix: Remove unused hooks and imports for cleaner code
- **v1.1.1**: Fix: Add 'use client' directives for Next.js components using client-side functionality
- **v1.1.0**: Mobile view enhancements and responsive design improvements
- **v1.0.0**: Initial release with core functionality

## 🔒 License

[MIT License](LICENSE)

## 👥 Contributors

- [Your Name](https://github.com/yourusername)

## 📞 Contact

For any inquiries, please reach out to [contact@jatinjewellers.com](mailto:contact@jatinjewellers.com)
