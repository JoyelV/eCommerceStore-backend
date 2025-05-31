const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/Db');
const errorHandler = require('./middleware/ErrorHandler');

const productRoutes = require('./routes/ProductRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const authRoutes = require('./routes/AuthRoutes');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://e-commerce-store-dusky.vercel.app', 
}));

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Centralized error handling
app.use(errorHandler);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
