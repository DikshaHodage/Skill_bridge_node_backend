const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authRoutes = require('./auth'); // Correct path for auth.js
const profileRoutes = require('./profile'); // Add requires for other route files
const courseRoutes = require('./courses');
const roadmapRoutes = require('./roadmaps');

//dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- PROXY CONFIGURATION (CHANGED SECTION) ---
// This forwards any request to '/api/predict' to our live Python server
// The URL comes from an environment variable for security and flexibility
app.use('/api/predict', createProxyMiddleware({
    target: process.env.PYTHON_API_URL, // CHANGED LINE: Points to the live Python API URL from environment variables
    changeOrigin: true,
    // Add a path rewriter to ensure the path is forwarded correctly
    pathRewrite: {
        [`^/api/predict`]: '/predict',
    },
}));
// -----------------------------------------

// --- SERVE FRONTEND FILES (REMOVED SECTION) ---
// This is no longer needed because your frontend is now hosted on Azure Static Web Apps.
// app.use(express.static(path.join(__dirname, 'public')));
// ------------------------------------------


// --- DATABASE CONNECTION (NO CHANGE) ---
// This part is already perfect for the cloud
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Node.js: MongoDB connected successfully."))
    .catch(err => console.error("Node.js: MongoDB connection error:", err));
// -----------------------------------------



app.use('/api/auth', authRoutes); // Use auth.js for /api/auth/signup, /api/auth/signin
app.use('/api/profile', profileRoutes); // Use profile.js for /api/profile
app.use('/api/courses', courseRoutes); // Use courses.js for /api/courses
app.use('/api/roadmaps', roadmapRoutes);

// --- SERVER START (NO CHANGE) ---
// This part is already perfect for the cloud
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Node.js: Main server running on port ${PORT}`);
});

// force deployment 


