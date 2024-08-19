import React, { useState, useEffect, useRef } from 'react';
import Tab from "./components/Tab";
import './assets/styles.css';

interface TabData {
    status: string;
    region: string;
    roles: string[];
    results: {
        services: {
            database: boolean;
            redis: boolean;
        },
        stats:{
            servers_count: number;
            online: number,
            session: number
        }
    };
    strict: boolean;
    server_issue: string | null;
}


const App: React.FC = () => {
    const socketRef = useRef<WebSocket | null>(null);
    
    const [tabs, setTabs] = useState<TabData[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const socketUrl = process.env.REACT_APP_WS_URL || `wss://${window.location.host}`;

    useEffect(() => {
        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socketRef.current.onmessage = (event: MessageEvent) => {
            try {
                const receivedData: TabData[] = JSON.parse(event.data);
                setTabs(receivedData);
                console.log("Data received from the Server: ", receivedData)
                
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
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

    const handleTabClick = (id: string) => {
        setActiveTab(id);
    };
    
    const activeContent = tabs.find(tab => tab.region === activeTab);

    return (
        <div>
            <div className="tabs">
                {tabs.map(tab => (
                    <Tab
                        key={tab.region}
                        tab={tab}
                        isActive={tab.region === activeTab}
                        onClick={handleTabClick}
                    />
                ))}
            </div>
            {activeContent ? 
                <div className="tab-content">
                    <p>Status: {activeContent?.status}</p>
                    <p>Region: {activeContent?.region}</p>
                    <p>Roles: {activeContent?.roles}</p>
                    {activeContent?.strict ? <p>Strict: {activeContent?.strict}</p> : null}
                    {activeContent?.server_issue ? <p>Server Issue: {activeContent?.server_issue}</p> : null}
                </div> 
            : <div></div>}
        </div>
    );
};

export default App;
