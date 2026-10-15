# BE-XPERT Store — Modern E-Commerce Web Application

A responsive, full-stack-style e-commerce web application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and the EscuelaJS API. The project includes a customer storefront, shopping cart, authentication pages, checkout flow, profile management, and an administrative dashboard for managing store resources.

## Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Application Routes](#application-routes)
- [API Integration](#api-integration)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication and Authorization](#authentication-and-authorization)
- [Data Handling and Error States](#data-handling-and-error-states)
- [Responsive Design](#responsive-design)
- [Security Considerations](#security-considerations)
- [Testing and Build](#testing-and-build)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [Author](#author)
- [License](#license)

## Project Overview

**BE-XPERT Store** is an individual e-commerce capstone project developed to demonstrate modern web application development using the Next.js App Router.

The application provides a customer-facing shopping experience and an administrative interface. Customers can browse products, explore categories, manage a shopping cart, register, log in, view their profile, and proceed through the checkout flow. Administrators have access to management pages for products, categories, orders, customers, and dashboard information.

The application integrates with the EscuelaJS API for product catalog data and authentication. Supabase server-side configuration is also used by parts of the application.

**Project type:** Individual capstone project  
**Developer:** Edlawit Tsegaye  
**Framework:** Next.js with App Router  
**Primary language:** TypeScript

## Objectives

The main objectives of this project are to:

- Build a responsive e-commerce application using modern web technologies.
- Integrate a frontend application with an external REST API.
- Implement product browsing, search, category navigation, and product details.
- Provide shopping cart and checkout functionality.
- Implement registration, login, and profile management.
- Build an administrative dashboard with product, category, order, and customer management interfaces.
- Separate API logic from UI components.
- Handle loading states, empty results, errors, and missing records.
- Apply responsive design principles and support light and dark themes.
- Document authentication, API limitations, and security considerations.

## Features

### 1. Customer Storefront

- Responsive home page.
- Product catalog and product detail pages.
- Category listing and category-specific pages.
- Product search, filtering, and sorting where implemented.
- Product information, descriptions, prices, and images.
- Related product functionality where supported by the API.
- Loading, error, and empty states for supported data requests.

### 2. Shopping Cart

- Add products to the cart.
- Update quantities and remove products.
- Calculate cart totals.
- Preserve cart contents using browser local storage.
- Review selected items before checkout.

Cart persistence is browser-side functionality and does not constitute server-side order storage.

### 3. Authentication and Profile

- User registration.
- User login through the EscuelaJS authentication API.
- Profile page.
- Session token handling in browser session storage.
- Redirect to login when an unauthenticated customer attempts to access protected checkout functionality.
- Return to the intended destination after login where supported.
- Role-dependent navigation for the admin interface where implemented.

### 4. Checkout

- Checkout page.
- Cart and checkout validation.
- Login protection for checkout.
- Checkout success page.
- Order confirmation flow.

The checkout flow is demonstrative. Do not assume that it processes real payments or creates a permanently stored, production-grade order unless that behavior is explicitly implemented and verified.

### 5. Admin Dashboard

The administrative interface provides a centralized area for managing store resources.

Implemented admin route areas include:

- Dashboard overview.
- Product management.
- Category management.
- Order management.
- Customer management.
- Analytics.
- Administrative navigation and return-to-store navigation.

The dashboard is intended to use actual API responses for its statistics. If an API does not provide reliable access to a particular statistic, the interface should communicate that limitation rather than display fabricated data.

### 6. Product Management

Administrators can use the product management interface to work with the product catalog.

Features include:

- View products.
- Search and browse available products where implemented.
- Open product details.
- Create products.
- Edit product information where supported.
- Work with product titles, prices, descriptions, categories, and image URLs.
- Display appropriate validation, success, and error feedback.

### 7. Category Management

The category management interface provides pages for:

- Viewing categories.
- Creating categories.
- Editing category information.
- Accessing category-specific management routes.
- Handling API errors and unavailable records.

Write operations should be performed carefully because the EscuelaJS API is shared by multiple users.

### 8. Customer and Order Management

The admin interface includes customer and order management areas.

The available information and operations depend on the backend endpoints, permissions, and data sources configured for the application.

Sensitive information, including passwords and authentication tokens, must not be displayed in administrative tables or user detail pages.

### 9. Theme and Navigation

- Light theme.
- Dark theme.
- System theme selection.
- Responsive storefront header.
- Mobile bottom navigation.
- Desktop navigation.
- Theme selection menu.
- Active-page navigation styling.

### 10. User Interface

- Mobile-first responsive layouts.
- Consistent spacing and typography.
- Reusable components.
- Responsive product layouts.
- Administrative tables and lists.
- Accessible navigation labels and form controls.
- Light and dark theme support.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and App Router |
| React | Component-based user interface |
| TypeScript | Type safety |
| Tailwind CSS | Responsive styling |
| shadcn/ui | Reusable interface components |
| next-themes | Theme management |
| Lucide React | Icons |
| EscuelaJS API | Product catalog and authentication integration |
| Supabase | Server-side database integration where configured |
| Git and GitHub | Version control and source hosting |
| Vercel | Deployment platform |

## Application Routes

### Storefront Routes

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/products` | Product catalog |
| `/products/[id]` | Product details |
| `/categories` | Category listing |
| `/categories/[slug]` | Category details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/checkout/success` | Checkout confirmation |
| `/login` | User login |
| `/register` | User registration |
| `/profile` | User profile |
| `/my-orders` | Customer orders page |

### Admin Routes

| Route | Purpose |
|---|---|
| `/admin` | Dashboard overview |
| `/admin/analytics` | Analytics dashboard |
| `/admin/products` | Product management |
| `/admin/products/new` | Create a product |
| `/admin/products/[id]/edit` | Edit a product |
| `/admin/categories` | Category management |
| `/admin/categories/new` | Create a category |
| `/admin/categories/[id]/edit` | Edit a category |
| `/admin/orders` | Order management |
| `/admin/orders/[id]` | Individual order API resource, where implemented |
| `/admin/customers` | Customer management |
| `/admin/settings` | Admin settings |

Dynamic routes use values such as product IDs, category slugs, and order IDs. Available data may change, so the application should handle missing records gracefully.

## API Integration

The application uses the EscuelaJS API as its primary external catalog and authentication service.

**Base URL:**

`https://api.escuelajs.co/api/v1`

The API base URL can be configured through `NEXT_PUBLIC_API_URL`.

### Product Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/products` | Retrieve products |
| GET | `/products/{id}` | Retrieve a product |
| GET | `/products/slug/{slug}` | Retrieve a product by slug |
| GET | `/products/{id}/related` | Retrieve related products |

### Category Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/categories` | Retrieve categories |
| GET | `/categories/{id}` | Retrieve a category |
| GET | `/categories/slug/{slug}` | Retrieve a category by slug |
| GET | `/categories/{id}/products` | Retrieve products in a category |

### Authentication and User Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/users` | Register a user |
| POST | `/users/is-available` | Check supported availability fields |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/profile` | Retrieve the authenticated profile |
| POST | `/auth/refresh-token` | Refresh authentication where supported |
| GET | `/users` | Retrieve users if permitted |
| GET | `/users/{id}` | Retrieve a user if permitted |

Actual endpoint access, request formats, response structures, and permissions must be verified against the official documentation.

**Official API documentation:** https://api.escuelajs.co/docs

### API Design Principles

- Centralize API requests in reusable service functions.
- Keep API logic separate from presentation components.
- Handle unsuccessful HTTP responses.
- Handle network errors and invalid response data.
- Display loading and empty states.
- Handle missing or unavailable records.
- Avoid unnecessary repeated requests.
- Do not replace failed requests with fabricated products or categories.
- Do not assume that a specific product or category ID will always exist.

## Project Structure

The project uses the Next.js App Router and a `src` directory.

```text
be-xpert-ecommerce/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   ├── categories/
│   │   │   ├── customers/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── settings/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── my-orders/
│   │   │   └── orders/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── my-orders/
│   │   ├── products/
│   │   ├── profile/
│   │   ├── register/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── ui/
│   │   ├── site-header.tsx
│   │   └── theme-toggle.tsx
│   └── lib/
│       ├── api.ts
│       └── supabase-server.ts
├── .env.local
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

This is a high-level guide to the architecture, not an exhaustive listing of every file. Some folders may contain additional components, route handlers, or service modules.

## Getting Started

### Prerequisites

Install the following tools:

- Node.js (use a version supported by the project's Next.js dependencies).
- npm.
- Git.
- A GitHub account for repository hosting.
- API access to the services configured by the application.

### 1. Clone the Repository

```bash
git clone https://github.com/Edldev12/eccommerce.git
cd eccommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root and configure the required variables. See [Environment Variables](#environment-variables).

Never commit `.env.local` or secret keys to GitHub.

### 4. Start the Development Server

```bash
npm run dev
```

Open the URL shown in the terminal, normally:

http://localhost:3000

### 5. Create a Production Build

```bash
npm run build
```

### 6. Run the Production Server

After a successful build:

```bash
npm run start
```

## Environment Variables

The application uses the following configuration names in relevant parts of the codebase.

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

SUPABASE_SECRET_KEY=your_supabase_secret_key
```

### Variable Reference

| Variable | Purpose | Exposure |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | EscuelaJS API base URL | Public |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Public |
| `SUPABASE_SECRET_KEY` | Server-side Supabase privileged access | Secret; server only |

Use the actual values from your service dashboards. Do not place secret keys in client-side code.

The `NEXT_PUBLIC_` prefix makes a variable available to browser-side code when referenced by the application. Never prefix privileged secret keys with `NEXT_PUBLIC_`.

If your current code requires additional variables, add them based on the actual source code and deployment configuration.

## Authentication and Authorization

The login flow integrates with the EscuelaJS authentication API. The application stores the access token and, when returned, the refresh token in browser session storage.

The application uses these storage keys:

- `be-xpert-access-token`
- `be-xpert-refresh-token`

Session storage is browser-specific and is not directly accessible from server components or API route handlers.

### Important Security Limitations

The external EscuelaJS API must not be assumed to provide a trustworthy administrator role system unless that capability has been verified.

- Hiding admin links is not authorization.
- A client-side password is not secure production authentication.
- A local-storage or session-storage flag must not be trusted by itself to authorize privileged API operations.
- Server-side protected operations must verify authorization using a trusted mechanism.
- Privileged Supabase credentials must remain server-side.

Any development-only administrator access mechanism should be clearly identified as development-only and must not be represented as production-grade security.

## Data Handling and Error States

The application should account for common API conditions.

| Situation | Expected behavior |
|---|---|
| Loading | Display an appropriate loading indicator |
| Empty result | Display a useful empty state |
| Network failure | Display an error and an appropriate retry option |
| Missing product or category | Display a not-found state |
| Invalid form input | Display validation feedback |
| Failed login | Display a clear authentication error |
| Expired or invalid token | Handle the authentication failure gracefully |
| Missing image | Use a safe image fallback |
| Restricted API resource | Communicate that the resource is unavailable |
| Unavailable statistic | Show an unavailable state rather than inventing a value |

## Responsive Design

The application follows a mobile-first approach.

Responsive design considerations include:

- Mobile-friendly navigation.
- A desktop admin sidebar and responsive navigation on smaller screens.
- Responsive product grids.
- Tables or lists that adapt to smaller screens.
- Readable typography and consistent spacing.
- Light and dark themes.
- Accessible buttons and form controls.
- Prevention of unwanted horizontal scrolling.

The interface should be tested at mobile, tablet, laptop, and desktop widths.

## Security Considerations

The application follows these important security principles:

1. Keep privileged environment variables server-side.
2. Avoid exposing access tokens, refresh tokens, passwords, or secret keys in the UI.
3. Validate form input before submitting requests.
4. Handle failed authentication and unauthorized responses.
5. Verify permissions before performing privileged operations.
6. Avoid destructive operations against shared public API records.
7. Do not treat client-side route hiding as a security boundary.
8. Do not claim that simulated checkout processes real payments.
9. Use HTTPS for production deployments.
10. Review environment variables and deployment settings before publishing.

The EscuelaJS API is shared by other developers and students. Testing must avoid modifying or deleting existing shared products or categories without explicit authorization. Use records created specifically for testing when write operations need to be verified.

## Testing and Build

Before submitting or deploying the application, verify the following:

- [ ] Dependencies install successfully.
- [ ] The production build completes without errors.
- [ ] Product and category requests return actual API data.
- [ ] Product details handle unavailable IDs.
- [ ] Search and category navigation work as expected.
- [ ] Cart operations and totals behave correctly.
- [ ] Registration and login handle success and failure.
- [ ] Checkout redirects unauthenticated users appropriately.
- [ ] Admin routes and navigation work at different screen sizes.
- [ ] Admin statistics use actual data or show an unavailable state.
- [ ] Forms display validation, success, and error messages.
- [ ] Restricted API resources are handled gracefully.
- [ ] Mobile navigation does not introduce horizontal scrolling.
- [ ] Light and dark themes work correctly.
- [ ] No secrets are committed to the repository.

Useful commands:

```bash
npm run lint
npm run build
```

Use the scripts defined in `package.json`. If a script is not configured, inspect the package configuration rather than assuming it exists.

## Deployment

The application can be deployed to a platform that supports Next.js, such as Vercel.

General deployment steps:

1. Push the latest project changes to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables in the deployment settings.
4. Ensure the build command and framework settings match the project.
5. Deploy the application.
6. Check the deployment logs if the build fails.
7. Test the deployed storefront, admin pages, authentication, and API requests.
8. Verify that production environment variables are configured correctly.

**Live demo:** Add the verified production URL here after confirming the deployment works.

**Source code:** https://github.com/Edldev12/eccommerce

## Known Limitations

- The application depends on an external API whose available records, permissions, and behavior may change.
- Access to users and other administrative resources depends on API permissions.
- Browser-stored cart data is not equivalent to a server-side shopping cart.
- Checkout functionality should be treated as demonstrative unless real payment processing is explicitly integrated.
- Administrator permissions require a trusted authorization mechanism; the external API must not be assumed to provide one.
- Any customer or analytics data not connected to a real data source must be identified honestly rather than presented as live data.
- Profile image changes that are only stored in browser state or storage will not automatically update a persistent server-side profile.

## Future Improvements

Possible future improvements include:

- Implementing trusted server-side role-based authorization.
- Integrating a persistent order-management system.
- Adding a verified payment gateway.
- Improving automated tests for forms, routes, and API handlers.
- Adding stronger monitoring and error reporting.
- Improving accessibility and keyboard navigation.
- Adding pagination and performance improvements where appropriate.

These items are future improvements, not claims that the features are already implemented.

## Author

**Edlawit Tsegaye**  
Software Engineering Student | Full Stack Developer

- GitHub: https://github.com/Edldev12
- Project repository: https://github.com/Edldev12/eccommerce

## License

This project was developed for educational and capstone purposes. Add a `LICENSE` file to the repository if you intend to distribute it under a specific open-source license.
