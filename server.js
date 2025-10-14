const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const profileRoute = require('./api/profile');
const courseRoutes = require('./routes/courses'); // 1. IMPORT THE NEW ROUTE FILE
const roadmapRoutes = require('./routes/roadmaps'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoute);
app.use('/api/courses', courseRoutes); // 2. USE THE NEW ROUTE
app.use('/api/roadmaps', roadmapRoutes);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Database Connected Successfully');
    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`);
        process.exit(1);
    }
};

// Start the server after connecting to the database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});