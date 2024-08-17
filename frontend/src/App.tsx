import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost/ws/');

        socketRef.current.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socketRef.current.onmessage = (event: MessageEvent) => {
            setResponse(event.data);
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socketRef.current.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const handleSendRequest = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(url);
        }
    };

    return (
        <div>
            <h1>React Client</h1>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
            />
            <button onClick={handleSendRequest}>Send Request</button>
            <h2>Response:</h2>
            <pre>{response}</pre>
        </div>
    );
};

export default App;
