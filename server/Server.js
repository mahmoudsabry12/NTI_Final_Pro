const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const uploadRoute = require('./Routes/upload'); // المسار الخاص برفع الصور
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/products', require('./Routes/product'));
app.use('/api', uploadRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
