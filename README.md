# BE-XPERT Modern E-Commerce Web Application

A modern, responsive e-commerce web application developed as an individual capstone project for the **BE-XPERT Frontend Development** course.

The application uses Next.js, TypeScript, Tailwind CSS, shadcn/ui, and the EscuelaJS API to provide a customer storefront, shopping cart, authentication, simulated checkout, and an administrative dashboard.

## Project Overview

**Project Type:** Individual Capstone Project  
**Project Status:** In Development  
**API:** [EscuelaJS API Documentation](https://api.escuelajs.co/docs)

The goal is to build a functional, maintainable, and responsive e-commerce application demonstrating frontend development, API integration, authentication, state management, accessibility, and responsive design.

## Features

### Customer Storefront
- Responsive homepage with real API products and categories.
- Product search by name.
- Category and price filtering.
- Sorting by price, name, and creation date where supported.
- Product detail pages with descriptions, images, and related products.
- Dynamic category listing and category detail pages.
- Loading, error, empty, and not-found states.

### Shopping Cart
- Add and remove products.
- Increase and decrease quantities.
- Prevent duplicate cart rows for the same product.
- Calculate item counts, subtotals, and totals.
- Persist cart contents using localStorage.
- Preserve the cart when guests are redirected to login.

### Authentication and Profile
- User registration and validation.
- Email availability checks where supported.
- Login using the EscuelaJS API.
- Invalid-credential and API error handling.
- Authenticated user profile.
- Logout and protected customer routes.

### Simulated Checkout
- Require login before checkout.
- Collect name, email, phone number, delivery address, and city.
- Validate required fields and display an order summary.
- Show an order confirmation after simulated checkout.
- Clear the cart after successful checkout.

**Important:** Checkout is simulated. No real payment, shipping, or backend order processing is claimed.

### Admin Dashboard
- Overview statistics based on available API data.
- Product listing, creation, and editing where supported.
- Category listing, creation, and editing where supported.
- User information where API permissions allow.
- Responsive dashboard navigation.
- Loading, success, error, and unavailable states.

**Authorization limitation:** Administrator access must be evaluated against the API's actual capabilities. A frontend-only password or localStorage flag is not secure production authorization.

### UI and Accessibility
- Mobile-first responsive design.
- Light, dark, and system themes.
- Accessible form labels and keyboard navigation.
- Visible focus indicators and semantic HTML.
- Meaningful image alt text.
- SEO metadata and a consistent, professional interface.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework and routing |
| TypeScript | Type safety |
| Tailwind CSS | Responsive styling |
| shadcn/ui | Reusable UI components |
| next-themes | Theme management |
| EscuelaJS API | Products, categories, and authentication |
| localStorage | Shopping cart persistence |
| Git and GitHub | Version control |
| Vercel | Planned deployment |

## API Integration

**Base URL:** `https://api.escuelajs.co/api/v1`

**Documentation:** https://api.escuelajs.co/docs

### Products
- `GET /products`
- `GET /products/{id}`
- `GET /products/slug/{slug}`
- `GET /products/{id}/related`
- `POST /products`
- `PUT /products/{id}`

### Categories
- `GET /categories`
- `GET /categories/{id}`
- `GET /categories/slug/{slug}`
- `GET /categories/{id}/products`
- `POST /categories`
- `PUT /categories/{id}`

### Authentication and Users
- `POST /users`
- `POST /users/is-available`
- `POST /auth/login`
- `GET /auth/profile`
- `POST /auth/refresh-token`
- `GET /users`
- `GET /users/{id}`

Request bodies, response structures, and permissions will be verified against the official documentation.

The application will use a centralized API service and handle failures without replacing missing data with fabricated products.

**Shared API safety:** Existing shared products and categories will not be modified or deleted without explicit authorization. Write operations will be tested using isolated test records wherever possible.

## Application Routes

### Customer Routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/products` | Product discovery |
| `/products/[id]` | Product details |
| `/categories` | Category listing |
| `/categories/[slug]` | Category products |
| `/cart` | Shopping cart |
| `/checkout` | Protected simulated checkout |
| `/checkout/success` | Order confirmation |
| `/login` | Login |
| `/register` | Registration |
| `/profile` | User profile |

### Admin Routes

| Route | Purpose |
|---|---|
| `/admin` | Dashboard overview |
| `/admin/products` | Product management |
| `/admin/products/new` | Create product |
| `/admin/products/[id]` | Product details |
| `/admin/products/[id]/edit` | Edit product |
| `/admin/categories` | Category management |
| `/admin/categories/new` | Create category |
| `/admin/categories/[id]/edit` | Edit category |
| `/admin/users` | User management |
| `/admin/users/[id]` | User details |

## Project Structure

The following is the planned structure. Files and folders will be added as features are implemented.

```text
be-xpert-ecommerce/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── layout/
│   │   ├── products/
│   │   └── ui/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## Getting Started

### Prerequisites
- Node.js LTS
- npm
- Git
- Visual Studio Code or another code editor

### Installation

After cloning the GitHub repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd be-xpert-ecommerce
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1
```

Do not commit `.env.local` or private credentials to GitHub.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Available Scripts

```bash
npm run dev
npm run build
npm run start
```

Use `npm run lint` if that script is configured in `package.json`.

## Testing Checklist

### Storefront
- [ ] Homepage loads real API data.
- [ ] Product search, filters, and sorting work.
- [ ] Product details and related products load.
- [ ] Missing products and images are handled.

### Cart and Checkout
- [ ] Add, remove, and quantity controls work.
- [ ] Cart totals are correct.
- [ ] Cart persists after refresh.
- [ ] Guest checkout redirects to login.
- [ ] Checkout validates required fields.
- [ ] Successful simulated checkout clears the cart.
- [ ] Protected routes reject unauthenticated guests.

### Authentication
- [ ] Registration validates and submits.
- [ ] Login handles invalid credentials.
- [ ] Profile data loads correctly.
- [ ] Logout works.
- [ ] Protected profile routes redirect guests.

### Admin Dashboard
- [ ] Statistics use actual API data.
- [ ] Product and category management work where supported.
- [ ] User information respects API permissions.
- [ ] Shared records are protected from unsafe modifications.
- [ ] Authorization limitations are documented.

### Quality and Deployment
- [ ] Mobile, tablet, and desktop layouts work.
- [ ] Light, dark, and system themes work.
- [ ] Loading, error, and empty states are implemented.
- [ ] Accessibility is checked.
- [ ] Production build succeeds.
- [ ] Documentation is complete.
- [ ] Deployment is tested.

## Security and Limitations

- The shopping cart is stored client-side in localStorage.
- Checkout is simulated rather than a real payment transaction.
- The public API does not automatically provide production-grade administrator authorization.
- Client-side route protection alone is insufficient for production.
- Passwords and tokens must not be exposed in the interface or logs.
- API limitations will be documented honestly.

## Deliverables

1. GitHub repository with complete source code.
2. Working customer storefront.
3. Admin dashboard within API capabilities.
4. Project README and API documentation.
5. Public deployment URL when available.
6. Project presentation.

## Project Links

- **GitHub Repository:** To be added.
- **Live Demo:** To be added.
- **API Documentation:** https://api.escuelajs.co/docs

## Author

**Edlawit Tsegaye**  
BE-XPERT Frontend Development — Individual Capstone Project

---

*This README describes the requirements and planned implementation. Features will be marked complete only after implementation and testing.*
