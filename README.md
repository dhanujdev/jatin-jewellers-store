# Jatin Jewellers Store

## Recent Enhancements (April 2024)

### On-Demand Revalidation System (New)
- **Improved Cache Management**:
  - Implemented on-demand revalidation for admin product operations
  - Replaced time-based revalidation with targeted path revalidation
  - Created secure revalidation API endpoint with admin authentication
  - Added revalidation hooks to product create, update, and delete operations
- **Performance Benefits**:
  - Faster initial page loads with static generation
  - Immediate content updates after admin edits
  - Reduced unnecessary page regeneration
  - Optimized build times with selective revalidation
- **Developer Experience**:
  - Simplified cache management with consistent revalidation pattern
  - Improved debugging with detailed revalidation logs
  - Enhanced error handling for failed revalidation attempts
  - Secure token-based external revalidation support

### Product System Improvements
- **File-Based Product Management**:
  - Migrated from JSON data to file-based product structure
  - Products now stored in `/public/products/{category}/{id}/` directories
  - Each product has its own `data.json` and `image.jpg` files
  - Improved organization and easier product management
- **Server-Side Optimizations**:
  - Direct file system access for server components
  - Eliminated ECONNREFUSED errors by bypassing internal API calls
  - Improved error handling with proper logging
  - Better category validation with 404 handling for invalid categories
- **Enhanced Product Display**:
  - Updated category section to show all available categories
  - Improved featured products to include items from all categories
  - Fixed product page rendering with proper type handling
  - Better image path handling for product displays

### Admin Interface Enhancements
- **Admin Access Button**:
  - Added admin button in the header for quick access
  - Responsive design with icon-only view on mobile
  - Consistent styling with the rest of the interface
- **Admin Navigation**:
  - Added admin link to mobile menu
  - Improved admin dashboard layout
  - Better separation between admin and customer interfaces

### Admin Dashboard (New)
- **Secure Admin Interface**: 
  - Token-based authentication for admin access (`jatinjewellersadmin`)
  - Protected admin routes with middleware
  - Dedicated admin layout with dynamic navigation
  - Separate layout for admin pages (no header/footer)
- **Dashboard Overview**:
  - Clean, modern dashboard UI
  - Quick access to all admin features
  - Status indicators for available and upcoming features
  - Responsive grid layout for feature cards
- **Feature Management**: 
  - Products Management (Active)
  - Categories Management (Active)
  - Media Library (Coming Soon)
  - Content Pages (Coming Soon)
  - Analytics (Coming Soon)
  - User Management (Coming Soon)
  - Settings (Coming Soon)
- **Enhanced Security**:
  - Strict cookie-based authentication
  - Protected route middleware
  - Secure token validation
  - CSRF protection with SameSite cookies
  - Production-ready security configurations

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
- **On-Demand Revalidation**: Smart cache management with instant updates after admin edits while maintaining fast static page delivery
- **Admin Dashboard**: 
  - Secure token-based authentication
  - Modern dashboard UI with feature cards
  - Products and categories management with visual thumbnails
  - Enhanced product editing with side-by-side layout
  - Full-size image preview with accessible modal
  - Protected admin routes with middleware
  - Upcoming features: Media Library, Content Pages, Analytics, User Management, Settings
- **File-Based Product System**:
  - Organized product structure with individual product directories
  - Separate data and image files for each product
  - Improved product management and organization
- **Accessibility Features**:
  - ARIA-compliant components
  - Screen reader support
  - Keyboard navigation
  - Visual indicators for interactive elements

## 📱 Mobile View Enhancements (v1.1.0)

The latest release includes significant improvements to the mobile experience:

- **Improved Mobile Navigation**: Enhanced drawer menu with categorized sections and better visual hierarchy
- **Mobile Search Bar**: Dedicated search functionality optimized for mobile devices
- **Swipeable Product Carousels**: Touch-friendly product browsing with horizontal swipe gestures
- **Collapsible Footer**: Space-efficient accordion sections for footer content on mobile
- **Enhanced Visual Elements**: Better text visibility, optimized spacing, and improved touch targets
- **Responsive Typography**: Adjusted font sizes and spacing for better readability on small screens
- **Performance Optimizations**: Improved loading and rendering for mobile devices

## 🚀 New Features (v1.8.0)

The latest release includes significant improvements to the admin dashboard and product management:

- **Enhanced Admin Dashboard**:
  - Added product thumbnails to the admin products table
  - Improved product editing experience with side-by-side layout
  - Implemented full-size image preview with accessible modal
  - Better visual feedback for interactive elements
- **Accessibility Improvements**:
  - Added ARIA-compliant components throughout the application
  - Enhanced screen reader support with proper labeling
  - Improved keyboard navigation for all interactive elements
  - Added visually hidden elements for better accessibility
- **UI Refinements**:
  - Consistent styling across admin and customer interfaces
  - Better visual hierarchy in product management
  - Enhanced card components with improved spacing and typography
  - Responsive layouts that adapt to different screen sizes

## Previous Release (v1.7.0)

This release included significant improvements to product management and admin features:

- **File-Based Product System**: 
  - Migrated from JSON data to file-based product structure
  - Each product has its own directory with data and image files
  - Improved organization and easier product management
- **Enhanced Admin Interface**:
  - Added admin button in the header for quick access
  - Improved admin dashboard with feature cards
  - Better navigation between admin and customer interfaces
- **Server-Side Optimizations**:
  - Direct file system access for server components
  - Eliminated connection errors by bypassing internal API calls
  - Improved error handling and logging
- **Product Display Improvements**:
  - Updated category section to show all available categories
  - Improved featured products to include items from all categories
  - Fixed product page rendering with proper type handling

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.0**: React framework for server-rendered applications
- **React 18.3.1**: JavaScript library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI components
  - Dialog, VisuallyHidden, and other accessibility primitives
  - ARIA-compliant interactive components
- **Embla Carousel**: Lightweight carousel component
- **Lucide React**: Beautiful & consistent icon set
- **Shadcn/UI**: High-quality UI components built on Radix UI

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

The application uses a file-based system to store product information:

- **Total Products**: 2,555 products across 5 categories
- **Categories**:
  - Bangles (331 products)
  - Earrings (562 products)
  - Necklaces (1,571 products)
  - Rings (49 products)
  - Waistbands (42 products)

Data structure:
- `/public/products/{category}/{id}/data.json`: Contains product metadata
- `/public/products/{category}/{id}/image.jpg`: Product image

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

### Accessing Admin Dashboard

1. Navigate to `/admin` or `/admin/login`
2. Enter the admin token: `jatinjewellersadmin`
3. You'll be redirected to the admin dashboard
4. Access various features through the sidebar navigation:
   - Products Management
   - Categories Management
   - More features coming soon

Note: For security reasons, please change the admin token in production.

## 📋 Project Structure

```
jatin-jewellers-store/
├── public/            # Static assets (images, fonts, etc.)
│   ├── products/      # Product data and images
│   │   ├── bangles/   # Bangles category
│   │   │   ├── bangles-001/  # Individual product
│   │   │   │   ├── data.json # Product metadata
│   │   │   │   └── image.jpg # Product image
│   │   ├── earrings/  # Earrings category
│   │   ├── necklaces/ # Necklaces category
│   │   ├── rings/     # Rings category
│   │   └── waistbands/ # Waistbands category
├── src/
│   ├── app/           # Next.js app router pages
│   │   ├── page.tsx   # Home page
│   │   ├── (admin)/   # Admin routes with custom layout
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx      # Admin dashboard
│   │   │   │   ├── login/        # Admin login
│   │   │   │   ├── products/     # Products management
│   │   │   │   └── categories/   # Categories management
│   │   ├── product/   # Product pages
│   │   ├── category/  # Category pages
│   │   ├── search/    # Search functionality
│   │   ├── api/       # API routes
│   │   │   ├── image/ # Image caching API
│   │   │   └── admin/ # Admin API routes
│   │   └── layout.tsx # Root layout
│   ├── components/    # React components
│   │   ├── home/      # Homepage-specific components
│   │   ├── layout/    # Layout components (Header, Footer)
│   │   └── ui/        # Reusable UI components
│   ├── data/          # JSON data files
│   ├── lib/           # Utility functions
│   │   ├── redis.ts   # Redis client and caching utilities
│   │   ├── imageLoader.ts # Custom image loader with caching
│   │   ├── products.ts # Product data utilities with pagination
│   │   └── services/  # Service layer
│   │       └── admin-service.ts # Admin functionality
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

## 🔐 Admin Access

The admin dashboard is accessible at `/admin` and requires authentication:

1. **Login**: Visit `/admin/login` and enter the admin token
2. **Protected Routes**: 
   - `/admin/products`: Manage product listings
   - `/admin/categories`: Manage categories (coming soon)
3. **Authentication**: 
   - Token-based authentication
   - 7-day cookie persistence
   - Secure middleware protection

### Admin Features
- View and manage products
- Monitor product counts by category
- Secure, separate admin layout
- Protected routes with authentication
- More features coming soon

## Recent Enhancements (May 2024)

### Admin Dashboard Improvements
- **Enhanced Product Management**:
  - Added product thumbnails in the admin products table for better visual identification
  - Improved edit product page with side-by-side layout showing product image and edit form
  - Implemented image modal for full-size product image viewing with accessibility support
  - Better visual feedback with hover effects on clickable elements
