# BE-XPERT Modern E-Commerce Web Application

A modern, responsive e-commerce web application developed as an individual capstone project for the **BE-XPERT Frontend Development** course.

The application uses Next.js, TypeScript, Tailwind CSS, shadcn/ui, and the EscuelaJS API to provide a customer storefront, shopping cart, authentication, simulated checkout, and administrative dashboard.

## Project Overview

The goal of this project is to build a functional, maintainable, and responsive e-commerce application that demonstrates frontend development skills, API integration, authentication, state management, accessibility, and responsive UI design.

**Project type:** Individual Capstone Project  
**Project status:** In Development  
**API:** [EscuelaJS API](https://api.escuelajs.co/docs)

## Features

### Customer Storefront

- Responsive homepage with product discovery.
- Products retrieved from the EscuelaJS API.
- Product search by name.
- Category filtering.
- Price range filtering.
- Sorting by price, name, and creation date where supported by the available data.
- Individual product detail pages.
- Related product recommendations.
- Dynamic category listing and category detail pages.
- Loading, error, empty, and not-found states.

### Shopping Cart

- Add products to the cart.
- Increase and decrease product quantities.
- Remove individual products.
- Clear the entire cart.
- Display item counts, subtotals, and totals.
- Persist cart contents using browser localStorage.
- Prevent duplicate cart rows for the same product.
- Preserve the cart when guests are redirected to authentication.

### Authentication and User Profile

- User registration.
- Password and confirmation validation.
- Email availability checks where supported by the API.
- Login using the EscuelaJS authentication endpoint.
- Appropriate invalid-credential and API error messages.
- Profile information retrieved from the API.
- Logout functionality.
- Redirect guests to login when accessing protected customer routes.

### Simulated Checkout

- Require authentication before checkout.
- Collect customer name, email, phone number, delivery address, and city.
- Validate required fields.
- Display an order summary and total.
- Show a checkout confirmation page.
- Clear the cart after successful simulated checkout.
- Do not claim that real payments, shipping, or backend order creation have occurred.

### Admin Dashboard

- Dashboard overview with statistics calculated from available API data.
- Product listing, search, creation, and editing where supported.
- Category listing, creation, and editing where supported.
- User listing and details where permitted by the API.
- Responsive desktop sidebar and mobile navigation.
- Success, error, loading, and unavailable states.
- Safe handling of shared API records.

**Authorization note:** Administrator permissions must be verified against the actual API capabilities. A frontend-only access flag or password is not secure production authorization. Any development-only access mechanism will be clearly documented.

### UI and Accessibility

- Mobile-first responsive design.
- Light, dark, and system theme support.
- Accessible navigation and form labels.
- Keyboard-friendly controls and visible focus indicators.
- Semantic HTML and appropriate image descriptions.
- Page metadata and dynamic product/category metadata where practical.
- Minimal, consistent, professional visual design.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework and routing |
| TypeScript | Type safety |
| Tailwind CSS | Responsive styling |
| shadcn/ui | Reusable UI components |
| next-themes | Theme management |
| EscuelaJS API | Products, categories, and authentication |
| localStorage | Cart persistence |
| Git and GitHub | Version control and source hosting |
| Vercel | Planned deployment |

## API Integration

**API base URL:** `https://api.escuelajs.co/api/v1`

Official documentation: [https://api.escuelajs.co/docs](https://api.escuelajs.co/docs)

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

Endpoint behavior, request bodies, permissions, and response structures will be verified against the official API documentation during implementation.

The application will use a centralized API service layer, handle failed requests gracefully, and avoid fabricated fallback data.

**Shared API safety:** Existing shared products and categories will not be modified or deleted without explicit authorization. Write-operation testing will use records created specifically for testing wherever safe isolation is possible.

## Application Routes

### Customer Routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/products` | Product listing, search, filtering, sorting |
| `/products/[id]` | Product details |
| `/categories` | Category listing |
| `/categories/[slug]` | Category details and products |
| `/cart` | Shopping cart |
| `/checkout` | Protected simulated checkout |
| `/checkout/success` | Protected order confirmation |
| `/login` | User login |
| `/register` | User registration |
| `/profile` | Protected user profile |

### Admin Routes

| Route | Purpose |
|---|---|
| `/admin` | Dashboard overview |
| `/admin/products` | Product management |
| `/admin/products/new` | Create a product |
| `/admin/products/[id]` | View product details |
| `/admin/products/[id]/edit` | Edit a product |
| `/admin/categories` | Category management |
| `/admin/categories/new` | Create a category |
| `/admin/categories/[id]/edit` | Edit a category |
| `/admin/users` | User management |
| `/admin/users/[id]` | View user details |

## Project Structure

The planned project structure is:

```text
be-xpert-ecommerce/
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── products/
│   │   ├── profile/
│   │   ├── register/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
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
│   │   ├── api.ts
│   │   └── utils.ts
│   └── types/
├── .env.example
├── .gitignore
├── components.json
├── package.json
├── README.md
└── tsconfig.json
```

This is the planned organization; folders and files will be added as their features are implemented.

## Getting Started

### Prerequisites

- Node.js LTS.
- npm.
- Git.
- Visual Studio Code or another code editor.

### Installation

Clone the repository after it has been created:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd be-xpert-ecommerce
npm install
```

Configure the API URL in a local `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1
```

Do not commit `.env.local` or any secrets to GitHub. The example environment file should contain only safe placeholders and public configuration.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Use scripts that are actually defined in `package.json`. If the installed Next.js version uses a different lint command, update this documentation accordingly.

## Testing Checklist

### Storefront

- [ ] Homepage loads real API data.
- [ ] Product search works.
- [ ] Category and price filters work.
- [ ] Sorting works.
- [ ] Product detail and related product pages work.
- [ ] Missing products and images are handled gracefully.

### Shopping Cart and Checkout

- [ ] Products can be added, removed, and updated.
- [ ] Cart totals are correct.
- [ ] Cart persists after refresh.
- [ ] Guest checkout redirects to login.
- [ ] Checkout validates required fields.
- [ ] Successful simulated checkout clears the cart.
- [ ] Guests cannot directly access protected checkout routes.

### Authentication

- [ ] Registration validates and submits correctly.
- [ ] Login handles invalid credentials.
- [ ] Profile data loads for authenticated users.
- [ ] Logout works.
- [ ] Protected profile routes redirect guests appropriately.

### Admin Dashboard

- [ ] Statistics reflect actual API responses.
- [ ] Product and category management work where supported.
- [ ] User information is shown only where permitted.
- [ ] Shared records are protected from unsafe modifications.
- [ ] Admin authorization limitations are documented.

### Quality and Deployment

- [ ] Responsive layout works on mobile, tablet, and desktop.
- [ ] Light, dark, and system themes work.
- [ ] Loading, error, and empty states are implemented.
- [ ] Accessible labels, focus indicators, and navigation are verified.
- [ ] Production build succeeds.
- [ ] README and API documentation are complete.
- [ ] Live deployment is tested.

## Security and Limitations

- The cart is client-side state stored in localStorage.
- Checkout is a simulation, not a payment-processing system.
- A public third-party API does not guarantee production-grade authentication or administrator authorization.
- Client-side route protection is not a replacement for trusted server-side authorization.
- Tokens and passwords must not be displayed or logged.
- API access limitations will be documented honestly.

## Project Deliverables

1. GitHub repository containing the complete source code.
2. Working customer storefront.
3. Functional administrative dashboard within API limitations.
4. Project README and API integration documentation.
5. Public deployment URL when available.
6. Project presentation explaining architecture, functionality, testing, and limitations.

## Project Links

- **GitHub Repository:** To be added.
- **Live Demo:** To be added.
- **API Documentation:** https://api.escuelajs.co/docs

## Author

**Edlawit Tsegaye**  
BE-XPERT Frontend Development — Individual Capstone Project

---

*This README describes the project requirements and planned implementation. Features will be marked complete only after they have been implemented and tested.*
#   e c c o m m e r c e  
 