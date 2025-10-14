const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

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


// --- YOUR EXISTING AUTH API ROUTES (NO CHANGE) ---
app.post('/api/auth/signup', async (req, res) => {
    // ... your existing signup logic ...
    console.log("Signup route hit with data:", req.body);
    res.json({ message: "Signup route placeholder" });
});

app.post('/api/auth/signin', async (req, res) => {
    // ... your existing signin logic ...
    console.log("Signin route hit with data:", req.body);
    res.json({ message: "Signin route placeholder" });
});
// ---------------------------------


// --- SERVER START (NO CHANGE) ---
// This part is already perfect for the cloud
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Node.js: Main server running on port ${PORT}`);
});
