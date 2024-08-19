import WebSocket, { Server } from 'ws';
import axios from 'axios';
import { IncomingMessage } from 'http';

interface ServerWebSocket extends WebSocket {
    isAlive: boolean;
    clientURL: string;
}

const PORT = 8080;

const wss = new Server({ port: PORT });
const clients: Set<ServerWebSocket> = new Set();

let intervalId: NodeJS.Timeout | null = null;
let latestData: any = null; // Cache for the latest data

// Define the endpoints to fetch data from
const endpoints = [
    'http://date.jsontest.com/',
    'http://validate.jsontest.com/?json=%5BJSON-code-to-validate%5D',
    'http://md5.jsontest.com/?text=%5Btext'
];

async function fetchData(){
    try {
        const requests = endpoints.map(endpoint => axios.get(endpoint));
        const responses = await Promise.all(requests);
        
        // Bundle the JSON data together
        const bundledData = responses.map(response => response.data);
        
        return bundledData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'Failed to fetch data' };
    }
}

// polling function
const fetchDataAndBroadcast = async () => {
    try {
        // const response = await axios.get('http://date.jsontest.com/');
        // latestData = response.data;
        latestData = await fetchData();

        clients.forEach((client:ServerWebSocket) => {
            // if the client is no longer alive, delete it from the list
            if (!client.isAlive) {
                console.log(client.clientURL, 'did not respond to heartbeat, terminating connection...');
                clients.delete(client);
                if (clients.size === 0) {
                    stopPolling();
                }
                return
            }

            // set client alive status false until heard from
            client.isAlive = false;

            // update client data
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(latestData));
            }
        });
    } catch (error:any) {
        console.error('Error fetching data:', error);
        clients.forEach((client:ServerWebSocket) => {
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
wss.on('connection', async (ws: ServerWebSocket, req:IncomingMessage) => {
    ws.clientURL = req.headers.origin ?? "unknown";
    console.log('Client connected:', ws.clientURL);

    clients.add(ws);
    ws.isAlive = true; // Initially mark the client as alive

    // Listen for responses from clients
    ws.on('message', async (message: string) => {
        if(message == "alive"){ // if message is alive
            console.log(ws.clientURL, " is alive")
            ws.isAlive = true;
        }
    });

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
        console.log('Client disconnected:', ws.clientURL);

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
