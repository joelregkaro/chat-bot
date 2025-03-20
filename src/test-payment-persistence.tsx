import { useEffect, useState } from 'react';
import webSocketService from './services/WebSocketService';

/**
 * Test component to verify payment persistence functionality between frontend and backend.
 * This component tests:
 * 1. If the frontend properly queries the backend for payment status
 * 2. If the backend properly stores and retrieves payment status from the database
 * 3. If localStorage is used as a cache but not the source of truth
 * 4. If payment status syncs between frontend and backend
 * 5. If new browser tabs/sessions properly fetch payment status from the database
 */
export default function TestPaymentPersistence() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [cookieId, setCookieId] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tabId, setTabId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [testPhase, setTestPhase] = useState('initializing');
  const [testLog, setTestLog] = useState<string[]>([]);
  const [isLocalStorageCleared, setIsLocalStorageCleared] = useState(false);

  // Add log entries with timestamps
  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setTestLog(prev => [...prev, `[${time}] ${message}`]);
  };

  // Initialize connection to backend
  useEffect(() => {
    addLog('Initializing test...');
    
    // Clear previous test results
    setPaymentStatus(null);
    setTestPhase('connecting');
    
    // Set up event handlers
    const handleStatus = (status: 'connected' | 'connecting' | 'disconnected' | 'error') => {
      setConnectionStatus(status);
      addLog(`Connection status: ${status}`);
      
      if (status === 'connected') {
        // When connected, move to the session info phase
        setTestPhase('waitingForSessionInfo');
      }
    };
    
    const handleMessage = (data: any) => {
      if (data.type === 'session_info' && data.session_id) {
        setSessionId(data.session_id);
        setTabId(sessionStorage.getItem('registerKaroTabId') || null);
        addLog(`Received session ID: ${data.session_id}`);
        addLog(`Tab ID: ${sessionStorage.getItem('registerKaroTabId')}`);
        
        // After getting session info, check cookie and device info
        setTestPhase('checkingIdentifiers');
      }
      
      if (data.type === 'payment_status') {
        setPaymentStatus(data);
        addLog(`Received payment status from server: ${JSON.stringify(data)}`);
        setTestPhase('receivedPaymentStatus');
      }
    };
    
    // Add handlers and connect
    webSocketService.addStatusHandler(handleStatus);
    webSocketService.addMessageHandler(handleMessage);
    webSocketService.connect();
    
    // Cleanup function
    return () => {
      webSocketService.removeStatusHandler(handleStatus);
      // Message handlers don't need to be removed (prevents duplicates automatically)
      
      // Only disconnect if directed
      if (webSocketService.getConnectionStatus() === 'connected') {
        webSocketService.disconnect();
      }
    };
  }, []);
  
  // Once we have a connection, check identifiers
  useEffect(() => {
    if (testPhase === 'checkingIdentifiers' && sessionId) {
      // Get local data from WebSocket service
      setCookieId(webSocketService.getCookieId());
      setDeviceId(webSocketService.getDeviceId());
      
      // After a short delay, move to payment check phase
      setTimeout(() => {
        addLog('Checking payment status from database...');
        setTestPhase('checkingPaymentStatus');
        webSocketService.checkPaymentStatus();
      }, 1000);
    }
  }, [testPhase, sessionId]);

  // Handle clearing localStorage to test database persistence
  const handleClearLocalStorage = () => {
    try {
      localStorage.removeItem('paymentCompleted');
      setIsLocalStorageCleared(true);
      addLog('localStorage "paymentCompleted" flag has been cleared');
      
      // After clearing, check payment status again from database
      setTestPhase('checkingPaymentStatusAfterClear');
      webSocketService.checkPaymentStatus();
    } catch (e) {
      addLog(`Error clearing localStorage: ${e}`);
    }
  };
  
  // Handle simulating completion of payment
  const handleSimulatePayment = () => {
    addLog('Simulating payment completion...');
    
    // Send payment status to server
    webSocketService.sendToServer({
      type: 'payment_status',
      payment_completed: true,
      payment_status: 'completed',
      status: 'completed',
      session_id: sessionId,
      cookie_id: cookieId,
      device_id: deviceId,
      timestamp: new Date().toISOString()
    });
    
    // Set local flag for UI updates
    setTestPhase('paymentSimulated');
    
    // After a short delay, check payment status again
    setTimeout(() => {
      addLog('Verifying payment status after simulation...');
      setTestPhase('verifyingSimulatedPayment');
      webSocketService.checkPaymentStatus();
    }, 1500);
  };

  const handleCheckPaymentStatus = () => {
    addLog('Manually checking payment status...');
    webSocketService.checkPaymentStatus();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Payment Persistence Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center mb-2">
            <div className={`h-3 w-3 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="capitalize">{connectionStatus}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-medium">Session ID:</p>
              <code className="bg-gray-200 px-2 py-1 rounded">{sessionId || 'Not set'}</code>
            </div>
            <div>
              <p className="font-medium">Tab ID:</p>
              <code className="bg-gray-200 px-2 py-1 rounded">{tabId || 'Not set'}</code>
            </div>
            <div>
              <p className="font-medium">Cookie ID:</p>
              <code className="bg-gray-200 px-2 py-1 rounded">{cookieId || 'Not set'}</code>
            </div>
            <div>
              <p className="font-medium">Device ID:</p>
              <code className="bg-gray-200 px-2 py-1 rounded">{deviceId || 'Not set'}</code>
            </div>
            <div>
              <p className="font-medium">localStorage 'paymentCompleted':</p>
              <code className="bg-gray-200 px-2 py-1 rounded">
                {localStorage.getItem('paymentCompleted') || 'Not set'}
              </code>
            </div>
            <div>
              <p className="font-medium">Test Phase:</p>
              <code className="bg-gray-200 px-2 py-1 rounded">{testPhase}</code>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment Status</h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          {paymentStatus ? (
            <div className="mb-4">
              <p className="font-medium">Status from server:</p>
              <pre className="bg-gray-200 p-3 rounded overflow-auto max-h-40">
                {JSON.stringify(paymentStatus, null, 2)}
              </pre>
            </div>
          ) : (
            <p>No payment status received yet</p>
          )}
          
          <div className="flex space-x-4 mt-4">
            <button 
              onClick={handleCheckPaymentStatus}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={connectionStatus !== 'connected'}
            >
              Check Payment Status
            </button>
            
            <button 
              onClick={handleSimulatePayment}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={connectionStatus !== 'connected' || testPhase === 'paymentSimulated'}
            >
              Simulate Payment Completion
            </button>
            
            <button 
              onClick={handleClearLocalStorage}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={isLocalStorageCleared}
            >
              Clear localStorage Cache
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Test Log</h2>
        <div className="p-4 bg-gray-800 text-green-400 font-mono rounded-lg h-64 overflow-y-auto">
          {testLog.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
        <h3 className="font-bold">Testing Instructions</h3>
        <ol className="list-decimal pl-6 mt-2 space-y-2">
          <li>Verify the connection establishes properly and identifiers are received</li>
          <li>Check if a payment status is automatically fetched from the server/database</li>
          <li>Click "Simulate Payment Completion" to test saving payment status to the database</li>
          <li>Verify the server responds with an updated payment status</li>
          <li>Click "Clear localStorage Cache" to remove the local client-side record</li>
          <li>Click "Check Payment Status" to verify the status is retrieved from the database</li>
          <li>Open this page in a new tab to verify payment status persists across tabs</li>
          <li>To test in a new browser (different device ID), try using an incognito/private window</li>
        </ol>
      </div>
    </div>
  );
}