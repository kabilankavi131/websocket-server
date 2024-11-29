const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const server = new WebSocket.Server({ host: '0.0.0.0', port: 8080 });

const clients = []; // Array to keep track of connected clients
const usersNames = new Set();

server.on('connection', (ws, req) => {
    console.log('Client connected!');
    clients.push(ws); // Add new client to the list

    ws.on('message', (message) => {
        const userDetails = JSON.parse(message);
        const totalClients = server.clients.size;
        const username = userDetails.username;
        const userMessage = userDetails.message;
        usersNames.add(username);
        const msg = typeof username === 'string' ? username : username.toString();
        console.log('Received from client:', msg);
        // Broadcast the message to all connected clients
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) { // Check if the client is connected
                const response = JSON.stringify({
                    username,
                    message: userMessage,
                    userCount: totalClients,
                    users: [...usersNames]
                });
                client.send(response);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected.');
        // Remove client from the list when they disconnect
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

console.log('WebSocket server running on ws://localhost:8080');