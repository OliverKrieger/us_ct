import WebSocket, { Server } from 'ws';
import axios from 'axios';

const PORT = 8080;

const wss = new Server({ port: PORT });
const clients: Set<WebSocket> = new Set();

let intervalId: NodeJS.Timeout | null = null;
let latestData: any = null; // Cache for the latest data

// polling function
const fetchDataAndBroadcast = async () => {
    try {
        const response = await axios.get('http://date.jsontest.com/');
        latestData = response.data;

        clients.forEach((client:WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(latestData));
            }
        });
    } catch (error:any) {
        console.error('Error fetching data:', error);
        clients.forEach((client:WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ error: 'Failed to fetch data' }));
            }
        });
    }
};

// Function to start the polling interval
const startPolling = () => {
    if (!intervalId) { // make sure another interval is not started!
        intervalId = setInterval(fetchDataAndBroadcast, 10000);
        console.log('Polling started');
    }
};

const stopPolling = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null; // invalidate interval
        console.log('Polling stopped');
    }
};

// on new client connections
wss.on('connection', async (ws: WebSocket) => {
    console.log('Client connected');
    clients.add(ws);

    if (!latestData) {
        console.log('No cached data, fetching');
        await fetchDataAndBroadcast();
    } else {
        ws.send(JSON.stringify(latestData));
    }

    // if client connected, start polling
    if (clients.size === 1) {
        startPolling();
    }

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');

        // if no clients left, stop polling
        if (clients.size === 0) {
            stopPolling();
        }
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    stopPolling();
    wss.close(() => {
        console.log('WebSocket server closed');
        process.exit(0);
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
