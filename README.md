# NovaCart — Full-Stack E-Commerce Website

A responsive Amazon-style e-commerce project inspired by the **layout patterns** in the supplied reference images (clean cards, large hero banners, category navigation, product grids, cart drawer and admin controls) without directly copying any reference design.

## Included features

### Customer
- Modern responsive HTML/CSS/JavaScript UI
- 9 categories
- **15 products per category = 135 seeded products**
- Product image, title, description, rating, reviews, price, old price, discount and stock
- Search by product title/description
- Category navigation and filters
- Price range filtering
- Sorting: featured, newest, discount, rating, low-to-high, high-to-low
- Pagination
- Shopping cart with quantity controls
- Register and login
- JWT authentication
- Checkout form
- Order placement through REST API
- Customer order history
- Mobile/tablet/desktop responsive design

### Admin
- Admin login
- Dashboard statistics
- Product CRUD
- User list
- Order list
- Order status updates
- Product stock/price/category/image management

### Backend
- Node.js + Express REST API
- SQLite database using `better-sqlite3`
- Password hashing with `bcryptjs`
- JWT authentication
- CORS enabled
- Database automatically created in `data/ecommerce.db`
- Seed script creates 9 categories, 135 products and a demo admin

## Project structure

```text
ecommerce-amazon-style/
├── data/
│   └── ecommerce.db             # created automatically after first start
├── public/
│   ├── index.html               # storefront
│   ├── auth.html                # login/register
│   ├── admin.html               # admin dashboard
│   ├── styles.css               # complete responsive styling
│   ├── app.js                   # storefront/cart/checkout logic
│   ├── auth.js                  # authentication logic
│   └── admin.js                 # admin dashboard logic
├── db.js
├── seed.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Requirements

- Node.js 18+ recommended
- npm

## Run locally

Open a terminal in this project folder:

```bash
npm install
npm start
```

`npm start` automatically seeds the database the first time and starts the Express server.

Open:

```text
http://localhost:3000
```

## Demo admin account

```text
Email:    admin@store.local
Password: Admin@123
```

After login, the admin account opens the dashboard automatically.

## REST API

### Public
```text
GET    /api/health
GET    /api/categories
GET    /api/products
GET    /api/products/:id
POST   /api/auth/register
POST   /api/auth/login
```

### Customer (JWT)
```text
GET    /api/me
POST   /api/orders
GET    /api/orders
```

### Admin (JWT + admin role)
```text
GET    /api/admin/stats
GET    /api/admin/users
GET    /api/admin/orders
PUT    /api/admin/orders/:id
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
```

## Database

SQLite tables:

- `categories`
- `users`
- `products`
- `orders`
- `order_items`

The product catalog contains 135 seeded products (15 in each of 9 categories).

## Image note

The seeded catalog uses public Unsplash image URLs so the ZIP remains lightweight. You can replace the `image` field from the Admin Product form with your own local/CDN image URL.

## Production notes

For real deployment:
1. Set a strong `JWT_SECRET` environment variable.
2. Use HTTPS.
3. Add a real payment gateway.
4. Add server-side rate limiting and stronger validation.
5. Move images to object storage/CDN.
6. Use a managed database for high traffic.

## UI direction

The UI is an original implementation using the supplied references only for general visual direction: spacious product cards, soft backgrounds, category tiles, large promotional hero areas, compact navigation and responsive layouts.
