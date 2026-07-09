const socksv5 = require('socksv5');

// Proxy Configuration
const PORT = process.env.PORT || 443; // Port 443 (HTTPS) use karein taake Pakistan mein block na ho
const USERNAME = "rqa_admin";         // Aapka custom username
const PASSWORD = "RQA_Secure_Pass_2026"; // Aapka custom password

/**
 * Universal SOCKS5 Proxy Server
 * Yeh server direct Telegram app ke network payloads ko route karega.
 */
const server = socksv5.createServer((info, accept, deny) => {
    // Handling direct connection architecture
    accept();
});

// User Authentication Layer Integration
server.useAuth(socksv5.auth.UserPassword((user, pass, cb) => {
    if (user === USERNAME && pass === PASSWORD) {
        return cb(true); // Access granted
    }
    console.log(`Unauthorized connection attempt blocked from: ${user}`);
    cb(false); // Access denied
}));

server.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(` ROYAL QUOTEX ACADEMY - Lifetime Proxy System    `);
    console.log(`==================================================`);
    console.log(`SOCKS5 Proxy Server is online and running on port: ${PORT}`);
    console.log(`Authentication Enabled: Username: ${USERNAME}`);
    console.log(`==================================================`);
});

server.on('error', (err) => {
    console.error('Proxy Server Runtime Error:', err.message);
});
