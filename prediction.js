const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios

// The URL of your running Python Flask server
const PYTHON_API_URL = 'https://skillbridge-python-api-0082.azurewebsites.net/predict';

router.post('/predict', async (req, res) => {
    // Get data from the request body
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No data provided' });
    }

    try {
        console.log('Forwarding data to Python ML service...');
        
        // Use axios to make a POST request to the Python server
        const pythonResponse = await axios.post(PYTHON_API_URL, data);
        
        console.log('Received response from Python service.');

        // Send the response from the Python server back to the client
        res.json(pythonResponse.data);

    } catch (error) {
        console.error('Error calling Python service:', error.message);
        // Handle potential errors, like the Python server being down
        res.status(500).json({ error: 'Could not get a prediction from the ML service.' });
    }
});


module.exports = router;


