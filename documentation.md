# Flex Living Developer Assessment - Documentation
## Project Overview
The Flex Living Developer Assessment project is a **Reviews Dashboard** that simulates a property management platform for vacation rentals. It demonstrates the ability to build a modern web application that handles review data normalization, provides management dashboards for property performance analysis, and displays customer-facing review pages.
The application mocks integration with the Hostaway API (a property management system) to parse and normalize guest reviews, allowing managers to assess property performance and make data-driven decisions about their rental portfolio.
## Tech Stack Used
### Core Framework & Build Tool
- **React 18.3.1** with **TypeScript 5.2.2** - Modern React with full type safety
- **Vite 5.2.0** - Lightning-fast build tool and development server optimized for modern web development

### Data Management & API Layer
- **@tanstack/react-query 5.89.0** - Powerful data fetching, caching, and synchronization library
    - **Why chosen**: Provides excellent caching mechanisms, optimistic updates, and background refetching
    - **Benefits**: Eliminates the need for manual loading states, provides automatic retry logic, and ensures data consistency across components

- **json-server 0.17.4** - Mock REST API server
    - **Why chosen**: Enables rapid prototyping without backend development
    - **Usage**: Serves mock review data and supports CRUD operations for testing UI functionality

### Routing & Navigation
- **@tanstack/react-router 1.131.44** - Type-safe routing solution
    - **Why chosen**: Provides full TypeScript support with route parameters and search params
    - **Benefits**: Compile-time route validation and excellent developer experience

### UI Components & Design System
- - Modern component library built on Radix UI primitives
    - **Components used**: Tables, Dialogs, Buttons, Select dropdowns, Checkboxes, Cards, and more
    - **Why chosen**: Provides consistent, accessible components with excellent TypeScript support
    - **Benefits**: Pre-built components reduce development time while maintaining design consistency

**shadcn/ui**
- **Tailwind CSS 3.4.4** - Utility-first CSS framework
    - **Why chosen**: Rapid styling with consistent design tokens
    - **Benefits**: Small bundle size, excellent developer experience, and easy customization

### Data Validation & Type Safety
- **Zod 4.1.8** - Runtime schema validation
    - **Why chosen**: Ensures API responses match expected TypeScript types at runtime
    - **Benefits**: Prevents runtime errors from malformed API data and provides automatic type inference

### Table Management
- **@tanstack/react-table 8.21.3** - Headless table library
    - **Why chosen**: Provides powerful sorting, filtering, and selection capabilities
    - **Benefits**: Handles complex table logic while remaining framework-agnostic

## Architecture Decisions: CSR vs SSR
### Client-Side Rendering (CSR) Choice
The project uses **Client-Side Rendering** for the admin dashboard, which is appropriate because:
- **SEO not required**: Admin dashboards are behind authentication and don't need search engine visibility
- **Rich interactivity**: Real-time data updates, complex filtering, and interactive tables benefit from client-side state management
- **Data freshness**: TanStack Query's caching and background refetching ensures managers always see current review data

### SSR for Customer-Facing Pages
For a production client-facing property listing site, **Server-Side Rendering** would be essential, however given this is a mock project, SSR is not required:
- **SEO optimization**: Property listings need to be discoverable by search engines
- **Social media sharing**: Meta tags for property images and descriptions require server-side generation
- **Performance**: Initial page load would be faster with pre-rendered content
- **Core Web Vitals**: Better LCP (Largest Contentful Paint) scores for better search rankings, which we would evaluate using Lighthouse

## Key Design & Logic Decisions
### Dashboard Interface Design
#### Toggle Filters in Sidebar
- **Decision**: Implemented collapsible property filters in the left sidebar
- **Reasoning**: Provides quick access to performance-based filtering (Good/Average/Bad ratings) and trend analysis (Trending Up/Down/Stable) without cluttering the main interface
- **UX Benefit**: Managers can quickly identify underperforming properties or spot trends across their portfolio

#### "All Properties" Deselect Behavior
- **Decision**: Clicking an already-selected property returns to "All Properties" view
- **Reasoning**: Provides intuitive navigation - users can easily toggle between property-specific and portfolio-wide views
- **Implementation**: Uses conditional logic to toggle selection state, improving workflow efficiency

#### Property Linking for Customer Service
- **Decision**: Property names in the dashboard table are clickable links to the customer-facing property page
- **Reasoning**: Enables quick context switching for customer service scenarios
- **Use Case**: When a manager sees a negative review, they can immediately view the property as a customer would see it, helping them understand the customer's perspective and respond appropriately

### Customer-Facing Property Pages
#### Mock Property Listing Implementation
- **Decision**: Created realistic property listing pages with mock data generation
- **Reasoning**: Demonstrates understanding of customer-facing UX requirements
- **Features**:
    - Simplistic property image generation
    - Hardcoded pricing 
    - Mock ratings and amenity data based on property names
    - Review display with avatar generation and relative timestamps

#### Review Display Logic
- **Decision**: Only shows reviews with `status: 'success'` on public pages
- **Reasoning**: Maintains quality control - only approved/processed reviews are visible to potential customers
- **Manager Control**: Dashboard allows managers to see all reviews regardless of status for internal analysis

## API Behaviors & Mock Data Strategy
### json-server Configuration
- **Base URL**: `http://localhost:3001`
- **Routes Configuration**: Uses to map to `routes.json``/api/reviews/hostaway``/reviews`
- **Database**: contains mock review data with realistic property names, guest feedback, and rating categories `db.json`

### Environment Variables
- **Security**: file is gitignored to prevent credential exposure `.env`
- **Onboarding**: provides template with necessary variables:
    - API server location `VITE_API_BASE_URL`
    - Mock credentials for API integration `VITE_HOSTAWAY_ACCOUNT_ID``VITE_HOSTAWAY_API_KEY`

`.env.example`

### API Endpoints
- **GET** - Fetches all reviews with normalization `/api/reviews/hostaway`
- **PATCH** - Updates review status or approval state `/api/reviews/hostaway/:id`
- **Data Validation**: All API responses are validated against Zod schemas before use

## Google Maps Alternative: OpenStreetMap Integration
### Why OpenStreetMap Instead of Google Maps
- **Decision**: Used OpenStreetMap for property location mapping
- **Reasoning**: Google Places API integration faced several constraints:
    - **No Real Place IDs**: Mock properties don't have actual Google Place IDs
    - **API Key Requirements**: Would need Google Cloud account with billing enabled
    - **CORS Limitations**: Google Places API requires backend proxy for browser calls
    - **Time & Capacity Considerations**: While a Google Maps integration could reasonably be implemented within 2–3 hours of focused development, prioritization and delivery constraints meant that effort was better spent ensuring core functionality was demo-ready. Given the project timeline and human capacity, OpenStreetMap provided a pragmatic, low-friction alternative that fulfilled the requirement of demonstrating mapping functionality.

### OpenStreetMap Benefits for Mock Development
- **No API Key Required**: Eliminates development friction
- **CORS-friendly**: Direct browser integration possible
- **Realistic Experience**: Provides actual map functionality for demonstration
- **Production Consideration**: Easy to switch to Google Maps API when integrating with real property data

## Data Schema & Normalization
### Review Data Structure
The application implements a robust review schema using Zod validation:
``` typescript
- id: number (unique identifier)
- type: string (review source/type)  
- status: 'pending' | 'success' | 'rejected' (processing status)
- publicReview: string (review content)
- submittedAt: Date (submission timestamp)
- guestName: string (reviewer name)
- listingName: string (property identifier)
- rating: number | null (overall rating 0-10)
- reviewCategory: Array of category-specific ratings (cleanliness, communication, etc.)
```
### Performance Analytics
The dashboard calculates key performance indicators:
- **Average Overall Ratings**: Aggregated across all review categories
- **Trend Analysis**: Compares recent performance to historical averages
- **Category Breakdown**: Specific ratings for cleanliness, communication, and other aspects
- **Review Volume**: Total review counts per property for statistical significance

This architecture demonstrates production-ready patterns for handling complex data relationships, user interactions, and real-world business requirements in a property management context.
