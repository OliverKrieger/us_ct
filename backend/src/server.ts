import WebSocket, { Server } from 'ws';
import axios from 'axios';

const PORT = 8080;

const wss = new Server({ port: PORT });

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', async (message: string) => {
        console.log('Received:', message);

        try {
            const url = message;
            const response = await axios.get(url);
            ws.send(JSON.stringify(response.data));
        } catch (error:any) {
            console.error('Error fetching data:', error.message);
            ws.send(JSON.stringify({ error: 'Failed to fetch data' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
