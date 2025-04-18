import { useState, useRef, useEffect } from "react";
// Mock UI components to avoid import errors
const Button = (props: any) => <button {...props}>{props.children}</button>;
const Input = (props: any) => <input {...props} />;
import { Send, User, Bot, Sparkles, Clock, X, CreditCard, Loader2 } from "lucide-react";
const caImage = "placeholder-image.png";

// Mock ChatContext
const useChat = () => {
  return {
    messages: [] as ChatMessage[],
    sendMessage: (message: string) => console.log("Message sent:", message),
    connectionStatus: 'connected' as 'connected' | 'connecting' | 'disconnected' | 'error',
    paymentLink: "https://example.com/pay",
    showPaymentPopup: true,
    closePaymentPopup: () => console.log("Popup closed"),
    isLoading: false,
    hasCompletedPayment: false,
    markPaymentCompleted: () => console.log("Payment marked as completed")
  };
};

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
    Razorpay: any; // Use 'any' to match the original declaration
  }
}

// Define ChatMessage type to fix implicit 'any' errors
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface StickyChatProps {
  onClose?: () => void;
}

export default function StickyChat({ onClose }: StickyChatProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send message via chat context
    sendChatMessage(message);
    setMessage("");
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

  // Handle payment link click with enhanced Razorpay integration
  const handlePaymentClick = async () => {
    if (paymentLink) {
      // DON'T close the popup immediately - keep it open until payment is initialized
      console.log("🔄 Payment button clicked, processing payment link:", paymentLink);
      
      // Notify the agent that we're proceeding
      sendChatMessage("I'm proceeding to make the payment now.");
      
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
            console.log("⚠️ Razorpay initialization unsuccessful, keeping popup open");
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
  };

  // Initialize Razorpay with the extracted order ID
  const initializeRazorpay = async (paymentLink: string): Promise<boolean> => {
    try {
      console.log("🔄 Opening Razorpay checkout with link:", paymentLink);
      
      // Extract order information from the payment link
      let orderId: string | null = null;
      
      try {
        const url = new URL(paymentLink);
        
        // IMPROVED: Simplified order ID extraction with better debugging
        // Method 1: Standard query param (most reliable)
        orderId = url.searchParams.get('order_id');
        if (orderId) {
          console.log(`✅ Found order_id in query params: ${orderId}`);
        }
        
        // Method 2: Extract from RegisterKaro-specific path format
        else if (url.pathname.includes('/l/RegisterKaro-')) {
          const pathParts = url.pathname.split('/l/RegisterKaro-');
          if (pathParts.length > 1) {
            orderId = pathParts[1];
            console.log(`✅ Extracted order ID from RegisterKaro path: ${orderId}`);
          }
        }
        
        // Method 3: Use any short link path as last resort
        else if (url.pathname.includes('/l/')) {
          const pathParts = url.pathname.split('/l/');
          if (pathParts.length > 1) {
            orderId = pathParts[1];
            console.log(`⚠️ Using path as order ID fallback: ${orderId}`);
          }
        }
        
        // Handle case where direct Razorpay order URL is provided
        else if (url.hostname.includes('razorpay') && url.pathname.includes('/order/')) {
          const orderMatches = url.pathname.match(/\/order\/([a-zA-Z0-9_]+)/);
          if (orderMatches && orderMatches[1]) {
            orderId = orderMatches[1];
            console.log(`✅ Extracted order ID from direct Razorpay URL: ${orderId}`);
          }
        }
        
        if (!orderId) {
          console.error("❌ Failed to extract order_id from payment link:", paymentLink);
          throw new Error("Could not extract order ID");
        }
      } catch (error) {
        console.error("❌ Error parsing payment link:", error);
        return false;
      }
      
      // If payment already completed, don't show new payment form
      if (hasCompletedPayment) {
        console.log('✅ Payment already completed, not showing Razorpay checkout again');
        sendChatMessage("Our records show you've already completed payment. If you need assistance with anything else, please let me know.");
        return true;
      }
      
      // Check if Razorpay has been loaded properly
      if (!window.Razorpay) {
        console.error("❌ Razorpay not available in window object");
        return false;
      }
      
      // Debug info about Razorpay
      console.log(`⚙️ Razorpay object type: ${typeof window.Razorpay}`);
      console.log(`⚙️ Is constructor? ${typeof window.Razorpay === 'function' ? 'Yes' : 'No'}`);
    
      return new Promise((resolve) => {
        try {
          // Get Razorpay key from environment variables with clear logging
          const key = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_I98HfDwdi2qQ3T'; // Fallback for safety
          console.log(`🔑 Using Razorpay key: ${process.env.REACT_APP_RAZORPAY_KEY_ID ? process.env.REACT_APP_RAZORPAY_KEY_ID + ' [From ENV]' : 'rzp_test_I98HfDwdi2qQ3T [Fallback]'}`);
          
          console.log(`🚀 Initializing Razorpay checkout with order ID: ${orderId}`);
          
          // Create a mock event to debug mobile vs desktop detection
          console.log(`📱 Device info: ${window.navigator.userAgent}`);
          console.log(`📊 Window dimensions: ${window.innerWidth}x${window.innerHeight}`);
          
          // Define Razorpay options with improved error handling
          const options = {
            key: key,
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
                console.log('⚠️ Payment popup closed without completing payment');
                sendChatMessage("I see you've closed the payment window. If you need any more information before proceeding with the payment, please let me know.");
                resolve(false);
              },
              escape: true, // Allow closing with ESC key
              animation: true // Enable animations for better UX
            },
            handler: function(response: any) {
              console.log('💰 Payment potentially successful - will verify with backend', response);
              
              // Store payment response data with validation
              if (response.razorpay_payment_id && response.razorpay_order_id) {
                const paymentData = {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature || 'missing'
                };
                console.log('💰 Payment data:', paymentData);
                
                // Save payment info in localStorage for persistence
                try {
                  localStorage.setItem('lastPaymentInfo', JSON.stringify({
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    timestamp: new Date().toISOString()
                  }));
                } catch (e) {
                  console.error("Could not save payment info to localStorage", e);
                }
                
                markPaymentCompleted(); // Mark payment as completed for future reference
                sendChatMessage("Great! I'm verifying your payment. This should just take a moment...");
                resolve(true);
              } else {
                console.error("❌ Payment handler called with invalid response:", response);
                sendChatMessage("I received a payment notification, but some details are missing. Please wait while I verify your payment status.");
                resolve(false);
              }
            }
          };
          
          try {
            // Log complete options object for debugging
            console.log('🔍 Razorpay options:', JSON.stringify(options, null, 2));
            
            // Validate order ID format before creating instance
            if (!orderId || orderId.length < 5) {
              console.error('❌ Invalid order ID format:', orderId);
              throw new Error(`Invalid order ID format: ${orderId}`);
            }
            
            // Create Razorpay instance with defensive programming
            console.log('⚙️ Creating Razorpay instance...');
            
            // Check if window.Razorpay is a constructor function
            if (typeof window.Razorpay !== 'function') {
              console.error('❌ window.Razorpay is not a constructor function:', typeof window.Razorpay);
              throw new Error('Razorpay not loaded properly');
            }
            
            const rzp = new window.Razorpay(options);
            console.log('✅ Razorpay instance created successfully');
            
            // Debug: Ensure rzp is a proper object with expected methods
            if (!rzp || typeof rzp.on !== 'function' || typeof rzp.open !== 'function') {
              console.error('❌ Razorpay instance missing required methods');
              throw new Error('Invalid Razorpay instance');
            }
            
            // Add more detailed handlers
            rzp.on('payment.error', function(error: any) {
              console.error('❌ Payment error:', error);
              sendChatMessage("We encountered an error processing your payment. Let me help you try again or explore alternative payment options.");
              resolve(false);
            });
            
            rzp.on('payment.failed', function(response: any) {
              console.error('❌ Payment failed:', response.error || response);
              sendChatMessage("It looks like there was an issue with the payment. Would you like to try again or use a different payment method?");
              resolve(false);
            });
            
            // Attempt to open with additional logging
            console.log('🚀 Attempting to open Razorpay checkout...');
            rzp.open();
            console.log("✅ Razorpay checkout opened successfully");
            
          } catch (rzpInstanceError) {
            console.error("❌ Error with Razorpay instance:", rzpInstanceError);
            console.error("❌ Detailed error:", rzpInstanceError instanceof Error ? rzpInstanceError.message : 'Unknown error');
            resolve(false);
          }
        } catch (razorpayError) {
          console.error("❌ Razorpay initialization error:", razorpayError);
          resolve(false);
        }
      });
    } catch (error) {
      console.error("❌ Fatal error initializing Razorpay:", error);
      return false;
    }
  };
  
  // Fallback iframe method if direct Razorpay integration fails
  const openPaymentIframe = (paymentLink: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log("⚠️ Using fallback iframe payment method for link:", paymentLink);
      
      try {
        // Check if there's already an iframe - remove it first
        const existingIframe = document.getElementById('razorpay-fallback-iframe');
        if (existingIframe) {
          console.log("🧹 Removing existing payment iframe");
          document.body.removeChild(existingIframe.parentElement as Node);
        }
        
        // Create modal iframe for the Razorpay payment with improved UI
        const paymentDiv = document.createElement('div');
        paymentDiv.setAttribute('id', 'razorpay-fallback-container');
        paymentDiv.style.position = 'fixed';
        paymentDiv.style.top = '0';
        paymentDiv.style.left = '0';
        paymentDiv.style.width = '100%';
        paymentDiv.style.height = '100%';
        paymentDiv.style.backgroundColor = 'rgba(0,0,0,0.8)'; // Darker overlay
        paymentDiv.style.zIndex = '10000';
        paymentDiv.style.display = 'flex';
        paymentDiv.style.alignItems = 'center';
        paymentDiv.style.justifyContent = 'center';
        paymentDiv.style.backdropFilter = 'blur(5px)'; // Blur background for better UI
        
        // Create wrapper div with loading indicator
        const wrapperDiv = document.createElement('div');
        wrapperDiv.setAttribute('id', 'razorpay-fallback-iframe');
        wrapperDiv.style.position = 'relative';
        wrapperDiv.style.width = window.innerWidth < 768 ? '100%' : '90%'; // Full width on mobile
        wrapperDiv.style.height = window.innerWidth < 768 ? '100%' : '90%'; // Full height on mobile
        wrapperDiv.style.maxWidth = '1200px'; // Max width for large screens
        wrapperDiv.style.backgroundColor = 'white';
        wrapperDiv.style.borderRadius = window.innerWidth < 768 ? '0' : '8px'; // No border radius on mobile
        wrapperDiv.style.overflow = 'hidden';
        wrapperDiv.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'; // Better shadow
        
        // Create loading indicator with animation
        const loadingDiv = document.createElement('div');
        loadingDiv.setAttribute('id', 'razorpay-loading-indicator');
        loadingDiv.style.position = 'absolute';
        loadingDiv.style.top = '0';
        loadingDiv.style.left = '0';
        loadingDiv.style.width = '100%';
        loadingDiv.style.height = '100%';
        loadingDiv.style.display = 'flex';
        loadingDiv.style.flexDirection = 'column';
        loadingDiv.style.alignItems = 'center';
        loadingDiv.style.justifyContent = 'center';
        loadingDiv.style.backgroundColor = 'white';
        loadingDiv.style.zIndex = '2';
        
        // Enhanced loading animation HTML
        loadingDiv.innerHTML = `
          <div style="width: 50px; height: 50px; border: 3px solid #f3f3f3; border-top: 3px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          <p style="margin-top: 20px; font-family: Arial, sans-serif; color: #333;">Loading secure payment page...</p>
          <p style="margin-top: 5px; font-size: 12px; color: #777; max-width: 80%; text-align: center;">
            You'll be redirected to Razorpay's secure payment gateway. Your payment information is encrypted and secure.
          </p>
        `;
        
        // Add style for spinning animation
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `;
        document.head.appendChild(styleEl);
        
        // Create improved close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '15px';
        closeButton.style.right = '15px';
        closeButton.style.padding = '8px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '50%';
        closeButton.style.cursor = 'pointer';
        closeButton.style.zIndex = '10001';
        closeButton.style.display = 'flex';
        closeButton.style.alignItems = 'center';
        closeButton.style.justifyContent = 'center';
        closeButton.style.color = '#666';
        closeButton.style.transition = 'background-color 0.2s';
        closeButton.onmouseover = () => { closeButton.style.backgroundColor = '#f0f0f0'; };
        closeButton.onmouseout = () => { closeButton.style.backgroundColor = 'transparent'; };
        closeButton.onclick = () => {
          if (document.body.contains(paymentDiv)) {
            document.body.removeChild(paymentDiv);
          }
          sendChatMessage("I see you've closed the payment window. If you need any more information before proceeding with the payment, please let me know.");
          resolve(false);
        };
        
        // Create iframe with cleaner loading transition
        const iframe = document.createElement('iframe');
        iframe.src = paymentLink;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.position = 'relative';
        iframe.style.zIndex = '1';
        iframe.style.opacity = '0'; // Start hidden until loaded
        iframe.style.transition = 'opacity 0.5s ease-in-out';
        
        // Handle iframe load event with smoother transition
        iframe.onload = () => {
          console.log("✅ Payment iframe loaded successfully");
          
          // Wait a moment then fade in the iframe and fade out the loader
          setTimeout(() => {
            iframe.style.opacity = '1';
            loadingDiv.style.opacity = '0';
            loadingDiv.style.transition = 'opacity 0.5s ease-in-out';
            
            // Remove loading div after fade out
            setTimeout(() => {
              if (wrapperDiv.contains(loadingDiv)) {
                wrapperDiv.removeChild(loadingDiv);
              }
            }, 500);
          }, 500);
          
          // Resolve the promise after iframe is loaded
          resolve(true);
        };
        
        // Enhanced iframe error handling
        iframe.onerror = () => {
          console.error("❌ Failed to load payment iframe");
          if (wrapperDiv.contains(loadingDiv)) {
            loadingDiv.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ff4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <p style="margin-top: 20px; font-family: Arial, sans-serif; color: #333; text-align: center;">Unable to load payment page</p>
              <p style="margin-top: 10px; font-size: 14px; color: #666; max-width: 80%; text-align: center;">
                Please check your internet connection or try again later.
              </p>
              <button id="retry-payment-btn" style="margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Try Again</button>
            `;
            // Add retry button functionality
            setTimeout(() => {
              const retryBtn = document.getElementById('retry-payment-btn');
              if (retryBtn) {
                retryBtn.onclick = () => {
                  iframe.src = paymentLink; // Reload iframe
                  loadingDiv.innerHTML = `
                    <div style="width: 50px; height: 50px; border: 3px solid #f3f3f3; border-top: 3px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    <p style="margin-top: 20px; font-family: Arial, sans-serif; color: #333;">Trying again...</p>
                  `;
                };
              }
            }, 0);
          }
          resolve(false);
        };
        
        // Add elements to DOM in proper order
        wrapperDiv.appendChild(iframe);
        wrapperDiv.appendChild(loadingDiv); // Loading on top of iframe initially
        paymentDiv.appendChild(wrapperDiv);
        paymentDiv.appendChild(closeButton);
        document.body.appendChild(paymentDiv);
        
        // Inform user about the payment iframe with more details
        sendChatMessage("I've opened Razorpay's secure payment window for you. You can complete your payment there and then return to this chat when done.");
        
        // Set up enhanced message listener for payment completion
        const messageHandler = function(event: MessageEvent) {
          // Enhanced detection for payment completion messages from Razorpay iframe
          try {
            // Try to detect payment completion via message data
            if (event.data) {
              // Handle string message type
              if (typeof event.data === 'string') {
                if (event.data.includes('razorpay_payment_id') ||
                    event.data.includes('payment_success') ||
                    event.data.includes('payment_complete')) {
                  console.log("✅ Payment completion detected via iframe message (string)");
                  handleSuccessfulPayment();
                }
              }
              // Handle object message type
              else if (typeof event.data === 'object') {
                if (event.data.status === 'success' ||
                    event.data.razorpay_payment_id ||
                    event.data.event === 'payment.success' ||
                    event.data.event === 'payment.captured') {
                  console.log("✅ Payment completion detected via iframe message (object):", event.data);
                  handleSuccessfulPayment();
                }
              }
            }
          } catch (error) {
            console.error("Error processing iframe message:", error);
          }
        };
        
        // Function to handle successful payment detection
        const handleSuccessfulPayment = () => {
          markPaymentCompleted();
          sendChatMessage("Great! I'm verifying your payment. This should just take a moment...");
          
          // Close iframe after successful payment with smooth transition
          if (document.body.contains(paymentDiv)) {
            paymentDiv.style.opacity = '0';
            paymentDiv.style.transition = 'opacity 0.3s ease-in-out';
            
            setTimeout(() => {
              if (document.body.contains(paymentDiv)) {
                document.body.removeChild(paymentDiv);
              }
              // Remove the event listener to prevent memory leaks
              window.removeEventListener('message', messageHandler);
            }, 300);
          }
          
          resolve(true);
        };
        
        // Add message event listener
        window.addEventListener('message', messageHandler);
      } catch (error) {
        console.error("❌ Error creating payment iframe:", error);
        sendChatMessage("I'm having trouble opening the payment page. Please try again later or contact our support team for assistance.");
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
                    <Bot className="h-4 w-4 text-white" />
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
                    <p className="text-sm">{message.content}</p>
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
          <Input
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 focus-visible:ring-blue"
            disabled={connectionStatus !== 'connected' || isLoading}
          />
          <Button 
            type="submit"
            className="bg-blue hover:bg-blue/90 text-white"
            disabled={!message.trim() || connectionStatus !== 'connected' || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {connectionStatus === 'connected' ? 
            'Connected to AI assistant • Responses typically within 5 seconds' : 
            connectionStatus === 'connecting' ? 
            'Connecting to AI assistant...' : 
            'Disconnected - Unable to reach the assistant'}
        </p>
      </form>
    </div>
  );
}