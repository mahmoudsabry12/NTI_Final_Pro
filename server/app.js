const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const productRoutes = require('./modules/Product/product.routes');
const authRoutes = require('./modules/User/auth.routes');
const uploadRoutes = require('./modules/Upload/upload.routes');


dotenv.config();
connectDB();

const app = express();

app.use(express.static('uploads'));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', uploadRoutes);

module.exports = app;
