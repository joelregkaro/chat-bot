import React, { useEffect, useState } from 'react';
import WebSocketService from './services/WebSocketService';

/**
 * Test component for verifying WebSocket connection
 * and tab isolation functionality
 */
export default function TestConnection() {
  const [status, setStatus] = useState('Initializing...');
  const [sessionId, setSessionId] = useState('');
  const [tabId, setTabId] = useState('');
  const [cookieId, setCookieId] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get the tab ID from sessionStorage (guaranteed unique per tab)
    const tabId = sessionStorage.getItem('registerKaroTabId') || 'unknown';
    setTabId(tabId);

    // Get cookie from localStorage (shared across tabs)
    try {
      const cookieData = localStorage.getItem('registerKaroCookieId');
      if (cookieData) {
        const data = JSON.parse(cookieData);
        if (data && data.id) {
          setCookieId(data.id);
          const expiresIn = data.expires
            ? Math.floor((data.expires - Date.now()) / (24 * 60 * 60 * 1000))
            : 'unknown';
          setStatus(prev => prev + `\nFound cookie ID: ${data.id} (expires in ${expiresIn} days)`);
        }
      } else {
        setStatus(prev => prev + '\nNo existing cookie found - new user session will be created');
      }
    } catch (e) {
      console.error('Error parsing cookie:', e);
      setStatus(prev => prev + '\nError reading cookie: ' + (e as Error).message);
    }

    // Setup WebSocketService event listeners
    const messageHandler = (msg: any) => {
      console.log('Message from server:', msg);
      if (msg.type === 'session_info' && msg.session_id) {
        setSessionId(msg.session_id);
        setStatus(prev => prev + `\nReceived session ID: ${msg.session_id}`);
      }
      
      if (msg.type === 'message' && msg.text) {
        setReceivedMessages(prev => [...prev, `Bot: ${msg.text.substring(0, 100)}...`]);
      }
    };

    const statusHandler = (status: string) => {
      setIsConnected(status === 'connected');
      setStatus(prev => prev + `\nConnection status: ${status}`);
    };

    // Add handlers using the correct WebSocketService methods
    WebSocketService.addMessageHandler(messageHandler);
    WebSocketService.addStatusHandler(statusHandler);

    // Connect to WebSocket
    const currentStatus = WebSocketService.getConnectionStatus();
    if (currentStatus !== 'connected') {
      WebSocketService.connect();
      setStatus(prev => prev + '\nInitiating WebSocket connection...');
    } else {
      setIsConnected(true);
      setStatus(prev => prev + '\nWebSocket already connected');
    }

    // Update current connection status
    setIsConnected(currentStatus === 'connected');

    // Cleanup on component unmount
    return () => {
      // If this is the last component using the WebSocket, we could disconnect
      // but for testing purposes we'll keep the connection open
      console.log('Test connection component unmounting');
    };
  }, []);

  const handleSendTestMessage = () => {
    if (testMessage.trim() && isConnected) {
      WebSocketService.sendMessage(testMessage);
      setReceivedMessages(prev => [...prev, `You: ${testMessage}`]);
      setTestMessage('');
      setStatus(prev => prev + `\nSent test message: "${testMessage}"`);
    }
  };

  const handleClearCookie = () => {
    localStorage.removeItem('registerKaroCookieId');
    setCookieId('');
    setStatus(prev => prev + '\nCleared cookie - refresh to create a new session');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>RegisterKaro Connection Tester</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', background: '#f9f9f9' }}>
        <h2>Tab & Session Information</h2>
        <p><strong>Tab ID:</strong> {tabId}</p>
        <p><strong>Cookie ID:</strong> {cookieId || 'None (new user)'}</p>
        <p><strong>Session ID:</strong> {sessionId || 'Not yet received'}</p>
        <p><strong>Connection Status:</strong> {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Test Communication</h2>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter a test message"
            style={{ flex: 1, padding: '8px', marginRight: '10px' }}
            disabled={!isConnected}
          />
          <button 
            onClick={handleSendTestMessage}
            disabled={!isConnected || !testMessage.trim()}
            style={{ padding: '8px 16px' }}
          >
            Send
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Message Log</h2>
        <div style={{ border: '1px solid #ddd', padding: '10px', height: '200px', overflowY: 'auto' }}>
          {receivedMessages.length === 0 ? (
            <p style={{ color: '#888' }}>No messages yet. Send a test message to start.</p>
          ) : (
            receivedMessages.map((msg, i) => <p key={i}>{msg}</p>)
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Tab Isolation Test</h2>
        <p>
          Open this page in multiple tabs to test tab isolation. Each tab should have:
        </p>
        <ul>
          <li>The same Cookie ID (shared identity)</li>
          <li>Different Tab IDs (tab isolation)</li>
          <li>Separate conversation contexts</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Debug Controls</h2>
        <button onClick={handleClearCookie} style={{ padding: '8px 16px', marginRight: '10px' }}>
          Clear Cookie
        </button>
        <button onClick={() => window.location.reload()} style={{ padding: '8px 16px' }}>
          Refresh Page
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', background: '#f9f9f9' }}>
        <h2>Status Log</h2>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{status}</pre>
      </div>
    </div>
  );
}