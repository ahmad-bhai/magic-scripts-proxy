const axios = require('axios');

module.exports = async (req, res) => {
    // CORS Headers taake aap kisi bhi website se isko call kar sakein
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Client se target path lena (e.g., /api/proxy?url=https://api.telegram.org/botXYZ/getMe)
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: "RQA Proxy: Missing 'url' parameter. Example: /api/proxy?url=https://api.telegram.org"
        });
    }

    try {
        // Forwarding the request to the target url via Vercel's unblocked network
        const response = await axios({
            method: req.method,
            url: decodeURIComponent(url),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*'
            },
            data: req.body,
            validateStatus: () => true
        });

        res.status(response.status).send(response.data);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Tunnel routing failed",
            error: error.message
        });
    }
};
