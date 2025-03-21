import React, { useState, useEffect } from 'react';
import webSocketService from './services/WebSocketService';
import { useChat } from './contexts/ChatContext';

// Create a simple Button component instead of importing
const Button = ({
  onClick,
  className = "",
  children,
  disabled = false
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`rounded px-2 py-1 text-sm ${className}`}
    disabled={disabled}
  >
    {children}
  </button>
);

/**
 * Test component to trigger payment detection manually
 * 
 * This component can be imported into your app temporarily to test
 * the payment popup functionality without relying on the AI to generate
 * a payment link.
 */
const PaymentTriggerTest: React.FC = () => {
  const { 
    paymentLink, 
    showPaymentPopup, 
    closePaymentPopup,
    hasCompletedPayment
  } = useChat();
  
  const [testState, setTestState] = useState('idle');
  
  // Function to manually trigger a payment link message
  const triggerPaymentLinkMessage = () => {
    setTestState('sending');
    
    try {
      // Direct call to all message handlers as if it came from WebSocket
      // This simulates a payment_link message from the server
      webSocketService['messageHandlers'].forEach(handler => {
        handler({
          type: 'payment_link',
          link: 'https://rzp.io/l/test-payment-1234',
          text: 'Please proceed with the payment using this link: https://rzp.io/l/test-payment-1234'
        });
      });
      
      setTestState('sent');
      
      // After 2 seconds, reset state
      setTimeout(() => {
        setTestState('idle');
      }, 2000);
    } catch (error) {
      console.error('Error triggering payment:', error);
      setTestState('error');
    }
  };
  
  // Function to manually trigger a text message containing a payment link
  const triggerTextWithPaymentLink = () => {
    setTestState('sending');
    
    try {
      // Direct call to all message handlers with a message containing payment link
      webSocketService['messageHandlers'].forEach(handler => {
        handler({
          type: 'message',
          text: 'Great, James! You can proceed with the payment of ₹4,500 for the One Person Company registration using the link below: https://rzp.io/l/RegisterKaro-1234 Please complete the payment within 15 minutes to secure your registration slot. Let me know once done, and we\'ll move on to the next steps!',
          messageId: `manual_${Date.now()}`
        });
      });
      
      setTestState('sent');
      
      // After 2 seconds, reset state
      setTimeout(() => {
        setTestState('idle');
      }, 2000);
    } catch (error) {
      console.error('Error triggering payment message:', error);
      setTestState('error');
    }
  };
  
  return (
    <div className="fixed top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-lg font-bold mb-2">Payment Popup Test</h2>
      
      <div className="space-y-2">
        <p className="text-sm">Current state:</p>
        <ul className="text-xs space-y-1">
          <li>Payment link: {paymentLink ? `✅ ${paymentLink.substring(0, 20)}...` : '❌ Not set'}</li>
          <li>Show popup: {showPaymentPopup ? '✅ Visible' : '❌ Hidden'}</li>
          <li>Payment completed: {hasCompletedPayment ? '✅ Yes' : '❌ No'}</li>
          <li>Test state: {testState}</li>
        </ul>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={triggerPaymentLinkMessage} 
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2"
          disabled={testState === 'sending'}
        >
          Test payment_link
        </Button>
        
        <Button 
          onClick={triggerTextWithPaymentLink} 
          className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2"
          disabled={testState === 'sending'}
        >
          Test message with link
        </Button>
        
        {showPaymentPopup && (
          <Button 
            onClick={closePaymentPopup} 
            className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2"
          >
            Force close popup
          </Button>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        This tester bypasses WebSocket and directly triggers handlers
      </p>
    </div>
  );
};

export default PaymentTriggerTest;