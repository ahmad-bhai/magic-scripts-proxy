const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Global CORS setting taake kisi bhi domain se API hit ho sake
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Universal Proxy Route Handler
 * Yeh handler client side se aane wali bot requests ko transparently handle karega.
 */
app.all('/api/server', async (req, res) => {
    // Client se query parameters mein target endpoint lena (e.g., ?endpoint=bot123:abc/getMe)
    const { endpoint } = req.query;

    if (!endpoint) {
        return res.status(400).json({
            success: false,
            message: "Missing 'endpoint' parameter. Example: /api/server?endpoint=botYOUR_TOKEN/getMe"
        });
    }

    const targetUrl = `https://api.telegram.org/${endpoint}`;

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                ...req.headers,
                'host': 'api.telegram.org' // Telegram security framework ko match karne keliye
            },
            data: req.body,
            validateStatus: () => true // Bypasses internal axios errors for safe status passthrough
        });

        // Set dynamic headers back to client browser
        Object.keys(response.headers).forEach(key => {
            if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
                res.setHeader(key, response.headers[key]);
            }
        });

        res.status(response.status).send(response.data);

    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: "Proxy failed routing to Telegram infrastructure." 
        });
    }
});

// Vercel serverless platform ke liye application export
module.exports = app;
