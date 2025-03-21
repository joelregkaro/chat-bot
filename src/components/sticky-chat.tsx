import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea"; // Replace Input with Textarea
import { Send, User, Bot, Sparkles, Clock, X, CreditCard, Loader2 } from "lucide-react";
import caImage from "../assets/heroImg.png"
import { useChat } from "../contexts/ChatContext";
import webSocketService from "../services/WebSocketService";

// Declare Razorpay type for TypeScript
interface RazorpayOptions {
  key: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
    escape?: boolean;
    animation?: boolean;
  };
  handler?: (response: any) => void;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: any) => void) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface StickyChatProps {
  onClose?: () => void;
}

export default function StickyChat({ onClose }: StickyChatProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    messages,
    sendMessage: sendChatMessage,
    connectionStatus,
    paymentLink,
    showPaymentPopup,
    closePaymentPopup,
    isLoading,
    hasCompletedPayment,
    markPaymentCompleted
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle payment link click - defined with useCallback for React Hook dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePaymentClick = useCallback(async () => {
    if (paymentLink) {
      // DON'T close the popup immediately - keep it open until payment is initialized
      console.log("🔄 Payment button clicked, processing payment link:", paymentLink);
      
      // DO NOT auto-send chat messages here - user should see them only if they manually clicked
      
      // Attempt to load Razorpay
      const scriptLoaded = await loadRazorpayScript();
      console.log(`📜 Razorpay script loaded: ${scriptLoaded}`);
      
      try {
        if (scriptLoaded) {
          // Initialize Razorpay checkout
          const success = await initializeRazorpay(paymentLink);
          
          // Only close popup after successful initialization
          if (success) {
            console.log("✅ Razorpay initialized successfully, now closing popup");
            closePaymentPopup();
          } else {
            console.error("⚠️ Razorpay initialization unsuccessful, keeping popup open");
          }
        } else {
          // Fallback to iframe if script loading fails
          console.log("⚠️ Falling back to iframe payment method");
          const iframeSuccess = await openPaymentIframe(paymentLink);
          
          // Only close popup on successful iframe creation
          if (iframeSuccess) {
            console.log("✅ Payment iframe loaded successfully, now closing popup");
            closePaymentPopup();
          }
        }
      } catch (error) {
        console.error("❌ Error during payment processing:", error);
        // Don't close the popup on error - let user try again
      }
    } else {
      console.error("❌ No payment link available!");
    }
  }, [paymentLink, closePaymentPopup]);
  
  // NO AUTO-TRIGGER - Let user click the button manually
  // This prevents unwanted automatic messages and popup attempts

  // Focus the textarea after each message is received
  useEffect(() => {
    // Keep focus on textarea after bot responses
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [isLoading, messages]);

  // Handle keyboard events for the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Shift+Enter is pressed, add a newline
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow normal behavior (newline)
      return;
    }
    // If just Enter is pressed (without Shift), send the message
    else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      if (message.trim()) {
        sendChatMessage(message);
        setMessage("");
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send message via chat context
    sendChatMessage(message);
    setMessage("");
    
    // Focus the textarea after sending
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Load Razorpay script as a promise for better error handling
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        console.log("✅ Razorpay script already loaded");
        resolve(true);
        return;
      }

      console.log("📦 Loading Razorpay script...");
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        console.log("✅ Razorpay script loaded successfully");
        resolve(true);
      };
      
      script.onerror = (error) => {
        console.error("❌ Failed to load Razorpay script:", error);
        resolve(false);
      };
      
      document.body.appendChild(script);
    });
  };

  // Initialize Razorpay with payment link - returns a Promise<boolean>
  const initializeRazorpay = async (paymentLink: string): Promise<boolean> => {
    try {
      console.log("🔄 Processing payment link:", paymentLink);
      
      // If payment already completed, don't show new payment form
      if (hasCompletedPayment) {
        console.log('✅ Payment already completed, not showing payment form again');
        return true;
      }

      // Extract order ID from payment link if possible
      let orderId = '';
      try {
        // Try to extract order ID from different URL formats
        const url = new URL(paymentLink);
        
        // Try standard query param first
        orderId = url.searchParams.get('order_id') || '';
        
        // If not found in query params, try to extract from path
        if (!orderId) {
          // Check for payment ID in URL path - various formats
          if (url.pathname.includes('/l/')) {
            // Format: /l/PAYMENT_ID
            const pathParts = url.pathname.split('/l/');
            if (pathParts.length > 1) {
              orderId = pathParts[1];
              console.log(`Extracted order ID from path: ${orderId}`);
            }
          } else if (url.pathname.includes('/order/')) {
            // Format: /order/ORDER_ID
            const orderMatches = url.pathname.match(/\/order\/([a-zA-Z0-9_\-]+)/);
            if (orderMatches && orderMatches[1]) {
              orderId = orderMatches[1];
              console.log(`Extracted order ID from order path: ${orderId}`);
            }
          }
        }
        
        console.log(`Using order ID: ${orderId || 'Not available'}`);
      } catch (error) {
        console.warn("⚠️ Could not parse payment URL:", error);
      }
      
      // Check if Razorpay script is available
      if (typeof window.Razorpay !== 'function') {
        console.error("❌ Razorpay not loaded correctly! Attempting to load it now.");
        
        // Try to load Razorpay dynamically if not available
        try {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
          console.log("✅ Razorpay script loaded dynamically");
        } catch (loadError) {
          console.error("❌ Failed to load Razorpay script:", loadError);
          alert("Unable to load payment system. Please try again later.");
          return false;
        }
      }
      
      // Configure Razorpay options
      let options;
      
      // If we have a valid order ID, use that directly
      if (orderId && orderId.length > 3) {
        console.log("✅ Using Razorpay SDK with order ID:", orderId);
        
        options = {
          key: 'rzp_test_I98HfDwdi2qQ3T', // Test key
          order_id: orderId,
          name: 'RegisterKaro',
          description: 'Company Registration Payment',
          image: 'https://registerkaroonline.com/wp-content/uploads/2023/06/favicon-32x32-1.png',
          prefill: {
            name: '',
            email: '',
            contact: ''
          },
          theme: {
            color: '#007bff'
          },
          modal: {
            ondismiss: function() {
              console.log('⚠️ Payment popup closed by user');
              // Add a message to the chat about cancelled payment
              // Use a more neutral message that doesn't assume intent
              const message = "I notice you've closed the payment window. If you have any questions before proceeding with the payment, I'm here to help. Alternatively, if you'd like to continue with the registration, we can try the payment again.";
              
              sendChatMessage(message);
              
              // Create a function to handle cancellation notification
              const notifyCancellation = () => {
                // Log the WebSocket service is being used
                console.log('Notifying backend about payment cancellation');
                
                try {
                  // Get the current session ID, cookie ID, and device ID
                  const currentSessionId = webSocketService.getSessionId() || '';
                  const currentCookieId = webSocketService.getCookieId() || '';
                  const currentDeviceId = webSocketService.getDeviceId() || '';
                  
                  // Notify backend about cancellation
                  webSocketService.sendToServer({
                    type: 'payment_status',
                    payment_completed: false,
                    payment_status: 'cancelled',
                    status: 'cancelled',
                    session_id: currentSessionId,
                    cookie_id: currentCookieId,
                    device_id: currentDeviceId,
                    timestamp: new Date().toISOString()
                  });
                  
                  console.log('Successfully notified backend about cancellation');
                } catch (error) {
                  console.error('Failed to notify backend about cancellation:', error);
                }
              };
              
              // Call the function to notify cancellation
              notifyCancellation();
            },
            escape: true,
            animation: true
          },
          handler: function(response: any) {
            console.log('💰 Payment successful:', response);
            if (response.razorpay_payment_id) {
              // Mark payment as completed in the system
              markPaymentCompleted();
              
              // Send a simple confirmation message - server will handle detailed confirmation
              // Just inform the user that payment was successful
              sendChatMessage("Your payment has been successfully processed.");
              
              // Clear localStorage paymentCompleted on successful payment
              try {
                localStorage.removeItem('paymentCompleted');
              } catch (e) {
                console.error('Error removing paymentCompleted from localStorage:', e);
              }
            }
          }
        };
      } else {
        // If we don't have an order ID, use a simpler configuration
        // This is a fallback that might still work in some cases
        console.log("⚠️ No valid order ID found, using basic configuration");
        
        options = {
          key: 'rzp_test_I98HfDwdi2qQ3T',
          amount: 500000, // Default to ₹5,000 in paise
          currency: 'INR',
          name: 'RegisterKaro',
          description: 'Company Registration Payment',
          image: 'https://registerkaroonline.com/wp-content/uploads/2023/06/favicon-32x32-1.png',
          prefill: {
            name: '',
            email: '',
            contact: ''
          },
          modal: {
            ondismiss: function() {
              console.log('⚠️ Payment popup closed by user');
            }
          },
          handler: function(response: any) {
            console.log('💰 Payment successful:', response);
            if (response.razorpay_payment_id) {
              markPaymentCompleted();
            }
          }
        };
      }
      
      try {
        // Create and open Razorpay checkout
        console.log('⚙️ Creating Razorpay instance with options:', JSON.stringify(options, null, 2));
        const rzp = new window.Razorpay(options);
        console.log('✅ Razorpay instance created');
        
        // CRITICAL: This opens a popup modal WITHIN the current page
        // It does NOT navigate away from the page
        rzp.open();
        console.log("✅ Razorpay checkout opened as popup");
        return true;
      } catch (razorpayError) {
        console.error("❌ Error creating Razorpay instance:", razorpayError);
        return false;
      }
    } catch (error) {
      console.error("❌ Fatal error in payment processing:", error);
      return false;
    }
  };
  
  // Fallback payment method that uses Razorpay modal popup
  const openPaymentIframe = (paymentLink: string): Promise<boolean> => {
    console.log("⚠️ Using fallback payment method with modal popup");
    
    return new Promise(async (resolve) => {
      try {
        // Create a simpler Razorpay checkout without needing an order ID
        const options = {
          key: 'rzp_test_I98HfDwdi2qQ3T',
          amount: 500000, // Default to ₹5,000 in paise
          currency: 'INR',
          name: 'RegisterKaro',
          description: 'Company Registration Payment',
          image: 'https://registerkaroonline.com/wp-content/uploads/2023/06/favicon-32x32-1.png',
          notes: {
            payment_link: paymentLink // Store original link for reference
          },
          prefill: {
            name: 'User',
            email: '',
            contact: ''
          },
          theme: {
            color: '#007bff'
          },
          modal: {
            ondismiss: function() {
              console.log('⚠️ Fallback payment popup closed by user');
              
              // No need to send a message - the server will handle it
              // Let the server generate the message to avoid duplicates
              
              // Create a function to handle cancellation notification
              const notifyCancellation = () => {
                console.log('Notifying backend about fallback payment cancellation');
                
                try {
                  // Get the current session ID, cookie ID, and device ID
                  const currentSessionId = webSocketService.getSessionId() || '';
                  const currentCookieId = webSocketService.getCookieId() || '';
                  const currentDeviceId = webSocketService.getDeviceId() || '';
                  
                  // Notify backend about cancellation
                  webSocketService.sendToServer({
                    type: 'payment_status',
                    payment_completed: false,
                    payment_status: 'cancelled',
                    status: 'cancelled',
                    session_id: currentSessionId,
                    cookie_id: currentCookieId,
                    device_id: currentDeviceId,
                    timestamp: new Date().toISOString()
                  });
                  
                  console.log('Successfully notified backend about payment cancellation');
                } catch (error) {
                  console.error('Failed to notify backend about payment cancellation:', error);
                  
                  // Only in case of network error, show a local message
                  sendChatMessage("Payment window was closed. Let me know if you'd like to try again.");
                }
              };
              
              // Call the function to notify cancellation
              notifyCancellation();
              
              resolve(false);
            },
            escape: true,
            animation: true
          },
          handler: function(response: any) {
            console.log('💰 Fallback payment successful:', response);
            if (response.razorpay_payment_id) {
              // Mark payment as completed in the system
              markPaymentCompleted();
              
              // Send a simple confirmation message - server will handle detailed confirmation
              sendChatMessage("Your payment has been successfully processed.");
              
              // Clear localStorage paymentCompleted on successful payment
              try {
                localStorage.removeItem('paymentCompleted');
              } catch (e) {
                console.error('Error removing paymentCompleted from localStorage:', e);
              }
              
              resolve(true);
            } else {
              resolve(false);
            }
          }
        };
        
        // Make sure Razorpay is loaded
        if (typeof window.Razorpay !== 'function') {
          console.log('⚠️ Razorpay not available for fallback, attempting to load it now');
          try {
            await new Promise((resolveScript, rejectScript) => {
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.async = true;
              script.onload = resolveScript;
              script.onerror = rejectScript;
              document.head.appendChild(script);
            });
            console.log('✅ Razorpay loaded successfully for fallback');
          } catch (err) {
            console.error('❌ Failed to load Razorpay for fallback:', err);
            alert('Unable to load payment system. Please try again later.');
            resolve(false);
            return;
          }
        }
        
        // Create and open Razorpay instance as a popup
        console.log('🔄 Creating fallback Razorpay instance with popup');
        const rzp = new window.Razorpay(options);
        rzp.open();
        console.log('✅ Opened fallback Razorpay popup');
        
      } catch (error) {
        console.error("❌ Error in fallback payment method:", error);
        alert("Unable to process payment. Please try again later.");
        resolve(false);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-floating w-full h-[calc(100vh-8rem)] flex flex-col overflow-hidden border border-gray-100">
      {/* Chat header */}
      <div className="bg-blue text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className=" rounded-full">
            <img src={caImage} alt="CA Amit Aggrawal" className="h-10 w-10 rounded-full" />
          </div>
          <div>
            <h3 className="font-medium">CA Amit Aggrawal</h3>
            <div className="flex items-center text-xs text-white/80">
              <div className={`h-2 w-2 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-400' : 
                connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              {connectionStatus === 'connected' ? 'Online now' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </div>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Payment popup - shown when payment link is received */}
      {showPaymentPopup && paymentLink && (
        <div className="absolute inset-0 bg-black/30 z-20 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-5 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Complete Payment</h3>
              <button onClick={closePaymentPopup} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-gray-700">
              Click the button below to securely complete your payment for company registration:
            </p>
            <button 
              onClick={handlePaymentClick}
              className="w-full bg-blue text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue/90 transition"
            >
              <CreditCard className="h-5 w-5" />
              <span>Pay Now</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Chat messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div 
                  className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${
                    message.role === "user" ? "bg-orange ml-2" : "bg-blue mr-2"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <img src={caImage} alt="CA Amit Aggrawal" className="h-4 w-4 rounded-full" />
                  )}
                </div>
                <div>
                  <div 
                    className={`p-3 rounded-lg ${
                      message.role === "user" 
                        ? "bg-orange text-white rounded-tr-none"
                        : "bg-white text-darkgray border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="flex items-center text-xs mt-1 text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {message.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 bg-blue mr-2">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="p-3 rounded-lg bg-white text-darkgray border border-gray-200 rounded-tl-none">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Typing...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Quick action buttons */}
      <div className="p-1.5 border-t border-gray-100 flex overflow-x-auto gap-2 bg-gray-50">
        <button
          onClick={() => sendChatMessage("Tell me about the registration process")}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            isLoading || connectionStatus !== 'connected'
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue/10 text-blue hover:bg-blue/20'
          }`}
          disabled={isLoading || connectionStatus !== 'connected'}
        >
          Registration Process
        </button>
        <button
          onClick={() => sendChatMessage("What documents are required?")}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            isLoading || connectionStatus !== 'connected'
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue/10 text-blue hover:bg-blue/20'
          }`}
          disabled={isLoading || connectionStatus !== 'connected'}
        >
          Documents Required
        </button>
        <button
          onClick={() => sendChatMessage("What are your pricing plans?")}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            isLoading || connectionStatus !== 'connected'
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue/10 text-blue hover:bg-blue/20'
          }`}
          disabled={isLoading || connectionStatus !== 'connected'}
        >
          Pricing Plans
        </button>
        <button
          onClick={() => sendChatMessage("How long does the process take?")}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            isLoading || connectionStatus !== 'connected'
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue/10 text-blue hover:bg-blue/20'
          }`}
          disabled={isLoading || connectionStatus !== 'connected'}
        >
          Processing Time
        </button>
      </div>
      
      {/* Chat input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1 focus-visible:ring-blue min-h-[60px] resize-y max-h-[150px]"
            disabled={connectionStatus !== 'connected' || isLoading}
            autoFocus
          />
          <Button
            type="submit"
            className="bg-blue hover:bg-blue/90 text-white self-end h-[60px]"
            disabled={!message.trim() || connectionStatus !== 'connected' || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {connectionStatus === 'connected' ? 
            'Connected to our Expert• Responses typically within 5 seconds' : 
            connectionStatus === 'connecting' ? 
            'Connecting you with our experts...' : 
            'Disconnected - Unable to reach our experts'}
        </p>
      </form>
    </div>
  );
}