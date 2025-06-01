# eCommerce Store Backend
This is the backend API for an eCommerce platform built with **Node.js**, **Express**, and **MongoDB**. It provides endpoints for managing products and orders, with a repository pattern for modular and maintainable code. The backend supports pagination, filtering, and simulated transactions for order processing.

## Features
- **Product Management**: Fetch all products with search, price filtering, and pagination, or retrieve a single product by ID.
- **Order Processing**: Create orders with simulated transaction outcomes (Approved, Declined, Error).
- **Repository Pattern**: Organized into layers (Database -> Repository -> Service -> Controller) for better modularity.
- **MongoDB Transactions**: Supports session-based operations for atomic updates (e.g., inventory management).
- **Error Handling**: Robust error handling with appropriate HTTP status codes.

## Tech Stack
- **Node.js**: JavaScript runtime for the server.
- **Express**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing products and orders.
- **Mongoose**: ODM for MongoDB to define schemas and interact with the database.

## Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (running locally or via a cloud provider like MongoDB Atlas)

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd server
```

### 2. Install Dependencies
Using npm:
```bash
npm install
```
Or using yarn:
```bash
yarn install
```

### 3. Configure Environment
Create a `.env` file in the `server/` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
MONGO_URI=<update with mongodb connection string with db name>
MAILTRAP_HOST=<enter_mailtrap_host>
MAILTRAP_PORT=<enter_mailtrap_port>
MAILTRAP_USER=<enter_mailtrap_user>
MAILTRAP_PASS=<enter_mailtrap_password>
JWT_SECRET=<enter_jwt_secret>
JWT_REFRESH_SECRET=<enter_refresh_secret>
```

- `PORT`: The port where the server will run (default: 5000).
- `MONGODB_URI`: Your MongoDB connection string. Replace with your MongoDB URI if using a cloud database.

### 4. Run MongoDB
Ensure MongoDB is running:
- Locally: Start MongoDB with `mongod` (default port: 27017).
- Cloud: Ensure your MongoDB Atlas cluster is accessible and the URI is correct.

### 5. Run the Application
Start the server:
```bash
npm start
```
Or with yarn:
```bash
yarn start
```

The API will be available at `http://localhost:5000`.

## Project Structure
```
server/
├── config/  
│   ├── Db.js  
├── middleware/  
│   ├── Auth.js  
│   ├── ErrorHandler.js  
├── models/                 # Mongoose models
│   ├── Product.js
│   └── Order.js
│   └── User.js
├── repositories/           # Database access layer
│   └── ProductRepository.js
│   └── OrderRepository.js
│   └── UserRepository.js
├── services/              # Business logic
│   ├── ProductService.js
│   └── OrderService.js
│   └── EmailService.js
│   └── AuthService.js
├── controllers/           # HTTP request handlers
│   ├── AuthController.js
│   └── OrderController.js
│   └── ProductController.js
├── routes/                # API routes
│   ├── Auth.js
│   └── Order.js
│   └── Product.js
├── index.js               # Entry point
└── package.json           # Dependencies and scripts
```

## API Endpoints

### Products
- **GET /api/products**  
  Fetch all products with optional search, price filtering, and pagination.  
  Query Parameters:
  - `search`: Search by product name (e.g., `?search=shirt`).
  - `minPrice`: Minimum price filter (e.g., `?minPrice=10`).
  - `maxPrice`: Maximum price filter (e.g., `?maxPrice=50`).
  - `page`: Page number (default: 1).
  - `limit`: Number of products per page (default: 9).  
  Response:
  ```json
  {
    "products": [{ "_id": "...", "name": "...", "price": ..., ... }],
    "total": 20,
    "page": 1,
    "totalPages": 3
  }
  ```

- **GET /api/products/:id**  
  Fetch a single product by ID.  
  Response:
  ```json
  { "_id": "...", "name": "...", "price": ..., "variants": [...], ... }
  ```

### Orders
- **POST /api/orders**  
  Create an order with customer and item details.  
  Request Body:
  ```json
  {
    "items": [
      { "productId": "...", "variant": { "color": "...", "size": "..." }, "quantity": 2, ... }
    ],
    "customer": { "name": "...", "email": "...", ... }
  }
  ```
  Response:
  ```json
  { "orderNumber": "...", "status": "Approved" }
  ```

## Usage
1. Start the backend server (`npm start`).
2. Ensure MongoDB is running and the `MONGODB_URI` is correctly configured.
3. Use the frontend application to interact with the API, or test endpoints directly using tools like Postman or cURL.

## Notes
- **Simulated Transactions**: The `orderService` currently uses a `simulateTransaction` method that randomly returns "Approved", "Declined", or "Error". Replace this with a real payment gateway (e.g., Stripe) for production.
- **MongoDB Transactions**: Methods like `updateInventory` support MongoDB sessions for atomic operations. Ensure you're using a MongoDB replica set to enable transactions.
- **Error Handling**: The API returns appropriate status codes (e.g., 404 for "Product not found", 500 for server errors).

## Future Improvements
- Add user authentication and authorization (e.g., JWT).
- Integrate a real payment gateway for order processing.
- Add endpoints for managing product categories.
- Implement caching (e.g., Redis) for frequently accessed products.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License
This project is licensed under the MIT License.
```

---
