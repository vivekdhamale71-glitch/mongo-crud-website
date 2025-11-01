# mongo-crud-website — Product Store (CRUD + Purchase)

This is a small Node.js + Express + MongoDB example that implements a simple product store. It provides:

- CRUD for products (create, read, update, delete)
- Create orders (purchase) which decrement product stock
- A tiny vanilla JS frontend to manage products and place purchases

Quick start (Windows PowerShell):

1. Install Node.js (16+ recommended).
2. Copy `.env.example` to `.env` and set `MONGO_URI`.

```powershell
cd "C:/Users/Vivek/sneha website/mongo-crud-website"
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

API endpoints:

- `GET /api/products` — list products
- `POST /api/products` — create product
- `GET /api/products/:id` — get product
- `PUT /api/products/:id` — update product
- `DELETE /api/products/:id` — delete product
- `POST /api/orders` — create order (body: productId, quantity, customerName, customerEmail)
- `GET /api/orders` — list orders

Notes:
- Orders reduce product stock; purchasing more than available stock returns an error.
- Use `.env` to configure `MONGO_URI` and `PORT`.
