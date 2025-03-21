import React, { useState, useEffect } from 'react';
import { useChat } from './contexts/ChatContext';

/**
 * A test component to demonstrate auto-triggering payments
 * 
 * This component modifies the ChatContext's payment handling to automatically
 * open Razorpay when a payment link is detected.
 */
const TestPaymentAuto: React.FC = () => {
  const [status, setStatus] = useState('Waiting for payment link...');
  const [log, setLog] = useState<string[]>([]);
  
  const {
    paymentLink,
    showPaymentPopup,
    closePaymentPopup,
    hasCompletedPayment
  } = useChat();
  
  // Log new entries with timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };
  
  // Auto-load Razorpay script when component mounts
  useEffect(() => {
    if (!window.Razorpay) {
      addLog('Loading Razorpay script...');
      setStatus('Loading Razorpay script...');
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        addLog('✅ Razorpay script loaded successfully');
        setStatus('Razorpay ready - waiting for payment link');
      };
      
      script.onerror = () => {
        addLog('❌ Failed to load Razorpay script');
        setStatus('ERROR: Failed to load payment processor');
      };
      
      document.body.appendChild(script);
      
      return () => {
        // Clean up script when component unmounts
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);
  
  // Auto-open payment when link is received
  useEffect(() => {
    if (paymentLink && showPaymentPopup) {
      addLog(`🔔 Payment link detected: ${paymentLink}`);
      setStatus('Opening payment...');
      
      // Extract order ID from payment link
      let orderId: string | null = null;
      
      try {
        const url = new URL(paymentLink);
        
        // Method 1: Standard query param
        orderId = url.searchParams.get('order_id');
        
        // Method 2: Extract from path format
        if (!orderId && url.pathname.includes('/l/')) {
          const pathParts = url.pathname.split('/l/');
          if (pathParts.length > 1) {
            orderId = pathParts[1];
            addLog(`🔍 Extracted order ID from path: ${orderId}`);
          }
        }
        
        // Fallback: Generate random order ID
        if (!orderId) {
          orderId = 'order_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
          addLog(`⚠️ Using generated order ID: ${orderId}`);
        }
        
        // Open Razorpay
        const openRazorpay = setTimeout(() => {
          if (window.Razorpay) {
            try {
              addLog('🚀 Initializing Razorpay checkout...');
              
              const key = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_I98HfDwdi2qQ3T';
              
              const options = {
                key: key,
                order_id: orderId,
                name: 'RegisterKaro',
                description: 'Company Registration Payment',
                image: 'https://registerkaroonline.com/wp-content/uploads/2023/06/favicon-32x32-1.png',
                prefill: { name: '', email: '', contact: '' },
                theme: { color: '#007bff' },
                modal: {
                  ondismiss: function() {
                    addLog('⚠️ Payment popup closed by user');
                    setStatus('Payment canceled by user');
                    closePaymentPopup();
                  },
                  escape: true,
                  animation: true
                },
                handler: function(response: any) {
                  addLog(`💰 Payment successful - ID: ${response.razorpay_payment_id}`);
                  setStatus('Payment successful!');
                  closePaymentPopup();
                }
              };
              
              const rzp = new window.Razorpay(options);
              
              // Add detailed handlers
              rzp.on('payment.error', function(error: any) {
                addLog(`❌ Payment error: ${error?.error?.description || 'Unknown error'}`);
                setStatus('Payment failed');
              });
              
              rzp.open();
              addLog('✅ Razorpay checkout opened');
              
            } catch (error) {
              addLog(`❌ Error opening Razorpay: ${error}`);
              setStatus('Error opening payment');
            }
          } else {
            addLog('❌ Razorpay not loaded properly');
            setStatus('ERROR: Payment processor not available');
          }
        }, 1000); // Small delay to ensure UI updates first
        
        return () => clearTimeout(openRazorpay);
        
      } catch (error) {
        addLog(`❌ Error processing payment link: ${error}`);
        setStatus('ERROR: Invalid payment link');
      }
    }
  }, [paymentLink, showPaymentPopup, closePaymentPopup]);
  
  return (
    <div className="fixed top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-md w-full">
      <h2 className="text-lg font-bold mb-2">Payment Auto-Trigger Test</h2>
      
      <div className="mb-4">
        <div className={`text-sm font-semibold ${
          status.includes('ERROR') ? 'text-red-500' : 
          status.includes('success') ? 'text-green-500' : 'text-blue-500'
        }`}>
          Status: {status}
        </div>
        
        <div className="text-xs mt-1 space-y-1">
          <div>Payment link: {paymentLink ? `✅ ${paymentLink.substring(0, 20)}...` : '❌ Not set'}</div>
          <div>Show popup: {showPaymentPopup ? '✅ Yes' : '❌ No'}</div>
          <div>Payment completed: {hasCompletedPayment ? '✅ Yes' : '❌ No'}</div>
        </div>
      </div>
      
      <div className="border border-gray-200 bg-gray-50 p-2 rounded text-xs h-32 overflow-y-auto">
        {log.length === 0 ? (
          <div className="text-gray-400 italic">Waiting for events...</div>
        ) : (
          log.map((entry, index) => (
            <div key={index} className="mb-1">{entry}</div>
          ))
        )}
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        This component will automatically open the Razorpay checkout when a payment link is detected.
      </div>
    </div>
  );
};

export default TestPaymentAuto;