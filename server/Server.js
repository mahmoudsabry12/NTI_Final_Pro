const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./modules/Product/product.routes');
const uploadRoute = require('./Routes/upload');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();

app.use(express.static('uploads'));


app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./Routes/auth'));
app.use('/api/products', productRoutes);
app.use('/api', uploadRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
