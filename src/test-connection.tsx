import React, { useEffect, useState } from 'react';
import webSocketService from './services/WebSocketService';

/**
 * Test component to verify WebSocket connection to backend.
 * This can be rendered temporarily in App.tsx to test the connection.
 */
export const ConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<string[]>([]);

  // Connect to WebSocket on component mount
  useEffect(() => {
    // Add status handler
    webSocketService.addStatusHandler((status) => {
      setConnectionStatus(status);
      console.log(`WebSocket status: ${status}`);
    });

    // Add message handler
    webSocketService.addMessageHandler((data) => {
      console.log('WebSocket message received:', data);
      if (data.text) {
        // Ensure data.text is a string before adding it to the array
        const messageText: string = data.text;
        setResponses(prev => [...prev, messageText]);
      }
    });

    // Connect to backend
    webSocketService.connect();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  // Send test message
  const sendTestMessage = () => {
    if (message.trim()) {
      webSocketService.sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>WebSocket Connection Test</h2>
      
      {/* Connection status */}
      <div style={{ marginBottom: '20px' }}>
        <p>
          Status: 
          <span 
            style={{ 
              color: 
                connectionStatus === 'connected' ? 'green' : 
                connectionStatus === 'connecting' ? 'orange' : 
                'red',
              fontWeight: 'bold',
              marginLeft: '10px'
            }}
          >
            {connectionStatus}
          </span>
        </p>
      </div>

      {/* Test message form */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a test message"
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button 
          onClick={sendTestMessage}
          disabled={connectionStatus !== 'connected' || !message.trim()}
          style={{ padding: '8px 16px' }}
        >
          Send
        </button>
      </div>

      {/* Responses */}
      <div>
        <h3>Responses:</h3>
        {responses.length === 0 ? (
          <p>No responses yet. Send a message to test the connection.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {responses.map((resp, index) => (
              <li key={index} style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', borderRadius: '4px' }}>
                {resp}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionTest;