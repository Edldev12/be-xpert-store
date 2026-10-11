# BE-XPERT Store 🛍️

A modern, responsive e-commerce web application built with Next.js and React. BE-XPERT Store lets users browse products, explore categories, view product details, manage a shopping cart, register, log in, and access their profile.

## 🚀 Features

### 🛒 Product Catalog
- Browse products fetched from the EscuelaJS API.
- View product cards and detailed product information.
- Explore product categories and category-specific pages.
- Responsive product layouts.
- Loading, error, and empty states for a better user experience.

### 🛍️ Shopping Cart
- View items added to the cart.
- Update product quantities and remove items.
- Calculate the cart total.
- Continue to checkout from the cart.

### 🔐 Authentication
- Register a new account.
- Log in using an email address and password.
- Store authentication tokens in browser session storage.
- Redirect users back to their requested page after login.
- Require login before continuing to checkout.
- Log out of the current session.

### 👤 User Profile
- Retrieve authenticated user profile information.
- Display a profile avatar.
- Edit the avatar URL using the profile interface.
- Protect profile access with a login redirect.

**Note:** Avatar changes are currently stored locally in the browser and are not synchronized with the server.

### 🎨 User Interface
- Responsive design for desktop and mobile devices.
- Light and dark theme toggle.
- Desktop navigation.
- Fixed bottom navigation on mobile devices.
- Consistent styling and accessible form feedback.

## 🧰 Tech Stack

- **Framework:** Next.js
- **Frontend:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API:** [EscuelaJS API](https://api.escuelajs.co/api/v1)
- **Authentication:** API-based login and browser session storage
- **Version Control:** Git and GitHub

## 🌐 API

This project uses the public EscuelaJS API for product data, categories, and authentication.

Base URL:

`https://api.escuelajs.co/api/v1`

Endpoints used by the application include:

| Endpoint | Purpose |
|---|---|
| `/products` | Retrieve products |
| `/categories` | Retrieve product categories |
| `/products/:id` | Retrieve product details |
| `/auth/login` | Authenticate a user |
| `/auth/profile` | Retrieve authenticated profile information |
| `/users/` | Register a user |

API availability and supported operations depend on the external service.

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Open the project folder

```bash
cd be-xpert-ecommerce
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1
```

The application uses this value as the API base URL and falls back to the default EscuelaJS API URL if it is not set.

Never put private API keys, secrets, or sensitive credentials in variables prefixed with `NEXT_PUBLIC_`.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

## 📁 Main Application Areas

The project uses the Next.js App Router. Its main application areas include:

- `/` — Home page
- `/products` — Product catalog
- `/products/[id]` — Product details
- `/categories` — Product categories
- `/cart` — Shopping cart
- `/checkout` — Checkout
- `/login` — User login
- `/register` — User registration
- `/profile` — User profile

Exact routes depend on the current files in the project.

## 🔒 Authentication and Checkout

The login page sends credentials to the API and stores the returned access token in `sessionStorage`.

When a logged-out user attempts to access checkout, the application can redirect them to:

`/login?next=/checkout`

After successful login, the user is redirected back to checkout. Users can also navigate to registration while preserving the checkout destination.

**Security note:** Browser-side redirects improve the user experience but do not secure an API by themselves. Protected server-side operations must validate authentication and authorization independently.

## 🗺️ Project Goals

BE-XPERT Store is a learning and capstone project focused on building a complete e-commerce frontend and practicing:

- React components and state management
- Next.js App Router
- API integration
- Authentication flows
- Protected routes and redirects
- Responsive UI design
- Cart and checkout workflows
- Git and GitHub collaboration

## 🔮 Future Improvements

Potential next steps include:

- Product search, filtering, and sorting.
- Improved product discovery and pagination.
- Persistent cart synchronization for authenticated users.
- Server-side authorization for protected operations.
- Server-synchronized profile and avatar updates.
- Order creation, order history, and payment integration.
- Automated tests and accessibility improvements.

## 👩‍💻 Author

**Edlawit Tsegaye**

Software Engineering Student | Full Stack Developer

- GitHub: [@Edldev12](https://github.com/Edldev12)

## 📄 License

This project is intended for educational and portfolio purposes. Add a license file if you choose to distribute the project under a specific open-source license.
