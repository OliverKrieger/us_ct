import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
    const [response, setResponse] = useState<string>('');
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost/ws/');

        socketRef.current.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socketRef.current.onmessage = (event: MessageEvent) => {
            setResponse(event.data);
            handleSendRequest("alive");
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

    const handleSendRequest = (msg:string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(msg);
        }
    };

    return (
        <div>
            <h1>React Client</h1>
            <h2>Response:</h2>
            <pre>{response}</pre>
        </div>
    );
};

export default App;
