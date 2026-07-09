const crypto = require('crypto');
const net = require('net');

// Configuration
const PORT = 443; // Port 443 use karein taake lagay ke aam website ka traffic hai
const PASSWORD = "Royal_Quotex_Academy_Secret_2026"; // Aapka password
const METHOD = "aes-256-gcm"; // Dunya ka sab se secure aur fast encryption method

const KEY = crypto.scryptSync(PASSWORD, 'shadowsocks', 32);

/**
 * Custom High-Speed Proxy Server for Telegram Application
 */
const server = net.createServer((clientSocket) => {
    let isHeaderParsed = false;
    let cipher, decipher;

    clientSocket.on('data', (data) => {
        try {
            if (!isHeaderParsed) {
                // Initial Handshake and Decryption Setup
                const salt = data.slice(0, 32);
                const decipherKey = crypto.hkdfSync('sha1', KEY, salt, 'ss-subkey', 32);
                decipher = crypto.createDecipheriv(METHOD, decipherKey, Buffer.alloc(12));
                
                isHeaderParsed = true;
                
                // Target Server (Telegram Server) Connection Establishment
                const remoteSocket = net.connect(443, '149.154.167.50', () => {
                    clientSocket.pipe(remoteSocket);
                    remoteSocket.pipe(clientSocket);
                });

                remoteSocket.on('error', () => clientSocket.destroy());
            }
        } catch (err) {
            clientSocket.destroy();
        }
    });

    clientSocket.on('error', () => {});
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(` RQA LIFETIME APP PROXY IS ONLINE ON PORT: ${PORT} `);
    console.log(`====================================================`);
});
