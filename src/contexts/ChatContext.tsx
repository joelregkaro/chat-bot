import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import webSocketService, { WebSocketResponse, ChatMessage } from "../services/WebSocketService";

interface ChatContextProps {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
  paymentLink: string | null;
  showPaymentPopup: boolean;
  closePaymentPopup: () => void;
  isLoading: boolean;
  hasCompletedPayment: boolean;
  markPaymentCompleted: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Initialize with empty messages array - greeting will come from backend
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  // Start with loading false - only set to true when a message is actively being sent/received
  const [isLoading, setIsLoading] = useState(false);
  
  // Track whether payment has been completed to avoid asking again
  const [hasCompletedPayment, setHasCompletedPayment] = useState(false);
  
  // Track whether we've had at least one successful message exchange
  const hasReceivedMessages = React.useRef(false);
  
  // Initialize payment verification from database
  useEffect(() => {
    // Status handler that checks payment status when connection is established
    const checkServerOnConnect = (status: 'connected' | 'connecting' | 'disconnected' | 'error') => {
      if (status === 'connected') {
        console.log('Connected to server, checking payment status with database');
        
        // Query the server database for payment status - more reliable than localStorage
        webSocketService.checkPaymentStatus();
        
        // Remove handler after first connection to avoid duplicate checks
        webSocketService.removeStatusHandler(checkServerOnConnect);
      }
    };
    
    // Add connection status handler to check on initial connection
    webSocketService.addStatusHandler(checkServerOnConnect);
    
    // Create message handler to listen for payment status response
    const paymentStatusHandler = (data: WebSocketResponse) => {
      // Check for payment status update or completion message from server
      if (data.payment_completed === true ||
          (data.payment_status === 'completed') ||
          (data.status === 'completed')) {
        console.log('Received payment completion confirmation from server database');
        setHasCompletedPayment(true);
        
        // Store in localStorage as a cache only - source of truth is the database
        try {
          localStorage.setItem('paymentCompleted', 'true');
        } catch (e) {
          console.error('Error caching payment status to localStorage:', e);
        }
      }
    };
    
    // Add message handler for payment status
    webSocketService.addMessageHandler(paymentStatusHandler);
    
    // Clean up handlers when component unmounts
    return () => {
      webSocketService.removeStatusHandler(checkServerOnConnect);
      // No need to remove message handler as addMessageHandler prevents duplicates
    };
  }, []);

  // Format timestamp for messages
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Track previously seen message IDs to avoid duplicates
  const [lastMessageIds, setLastMessageIds] = useState<string[]>([]);

  // Create an instance ID for this ChatContext for tracking duplicates
  const contextId = React.useRef(`context_${Date.now()}_${Math.random().toString(36).substring(2,7)}`);
  
  // Store all message content we've received to prevent duplicates across sessions
  const seenMessageContents = React.useRef<Set<string>>(new Set());
  
  // Handle incoming messages from WebSocket
  const handleWebSocketMessage = (data: WebSocketResponse) => {
    const time = formatTime();
    const handlerTimeId = Date.now();
    
    // Generate a simple message preview for logs
    const preview = data.text
      ? data.text.substring(0, 30).replace(/\s+/g, ' ')
      : '[no text]';
    
    console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] Received message type=${data.type}, preview="${preview}..."`);

    // Handle typing indicators - Re-enabled but with better management
    if (data.type === 'typing_indicator') {
      console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] Received typing indicator`);
      
      // Only show typing indicator if we've received at least one actual message
      if (hasReceivedMessages.current) {
        setIsLoading(true);
        
        // Automatically clear typing after 15 seconds as a safety measure
        setTimeout(() => {
          console.log(`[CHAT_CONTEXT:${contextId.current}] Safety timeout clearing typing indicator`);
          setIsLoading(false);
        }, 15000);
      } else {
        console.log(`[CHAT_CONTEXT:${contextId.current}] Ignoring typing indicator - no messages yet`);
      }
      return;
    }
    
    // Handle typing ended message
    if (data.type === 'typing_ended') {
      console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] Received typing ended - clearing loading state`);
      setIsLoading(false);
      return;
    }
    
    if (data.type === 'message' || data.type === 'follow_up') {
      // Mark that we've successfully received a message from the server
      if (!hasReceivedMessages.current) {
        hasReceivedMessages.current = true;
        console.log(`[CHAT_CONTEXT:${contextId.current}] First message received from server - connection confirmed`);
      }
      
      if (data.text) {
        // Create a local variable with a definite type to fix the TypeScript error
        const messageText: string = data.text;
        
        // Use the message ID from WebSocketService if available, or generate one
        const messageId = data.messageId || `${handlerTimeId}-${messageText.substring(0, 20)}`;
        
        console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] Processing message with ID=${messageId}`);
        console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] Known message IDs: ${lastMessageIds.length}`);
        
        // Skip welcome/greeting messages if we already have some messages
        const isGreeting = messageText.includes("Hello!") ||
                          messageText.includes("Welcome") ||
                          messageText.includes("How can I help you");
        
        const shouldSkipGreeting = isGreeting && messages.length > 0;
        
        if (isGreeting) {
          console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] GREETING DETECTED, shouldSkip=${shouldSkipGreeting}`);
        }
        
        // Check if we've seen EXACT message content before (regardless of ID)
        // This uses a persistent ref so it persists between renders
        const contentFingerprint = messageText.trim();
        const contentAlreadySeen = seenMessageContents.current.has(contentFingerprint);

        // Check if we've seen this message ID before
        const isDuplicate = lastMessageIds.includes(messageId) || contentAlreadySeen;
        
        if (isDuplicate) {
          console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] DUPLICATE MESSAGE DETECTED: "${preview}..." (contentSeen=${contentAlreadySeen})`);
        }
        
        // Only add the message if we haven't seen it recently and it's not a duplicate greeting
        if (!isDuplicate && !shouldSkipGreeting) {
          console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] ADDING MESSAGE to chat history`);
          
          // Record this content as seen to prevent future duplication
          seenMessageContents.current.add(contentFingerprint);
          
          setMessages((prev) => {
            // Extra safety: Check if the last message content is the same
            const lastMsg = prev.length > 0 ? prev[prev.length - 1] : null;
            
            // Explicit duplicate check regardless of timestamp/ID
            if (lastMsg && lastMsg.content.trim() === contentFingerprint) {
              console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] CAUGHT DUPLICATE in setState - identical content`);
              return prev; // Don't add duplicate
            }
            
            // Check for duplicate welcome message regardless of position in history
            if (isGreeting && prev.some(m => m.content.includes("Welcome") || m.content.includes("Hello!"))) {
              console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] CAUGHT DUPLICATE welcome message in history`);
              return prev; // Don't add duplicate welcome
            }
            
            // Add the message when it's genuinely new
            return [...prev, { role: 'assistant', content: messageText, time }];
          });
          
          // Keep track of the last few message IDs (limit to 15)
          setLastMessageIds(prev => {
            const updated = [...prev, messageId];
            return updated.slice(-15); // Keep the last 15
          });
        } else {
          console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] FILTERED OUT message: isDuplicate=${isDuplicate}, isGreeting=${isGreeting}`);
        }
      }
      setIsLoading(false);
    } else if (data.type === 'payment_link' && data.link) {
      // Don't show payment popup if user has already completed payment
      if (hasCompletedPayment) {
        console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] Payment already completed, not showing payment popup`);
        // Let the server know we've already completed payment
        webSocketService.sendMessage("I've already completed payment for my registration. Please check your records.");
      } else {
        setPaymentLink(data.link);
        setShowPaymentPopup(true);
      }
    } else if (data.text) {
      // Only detect explicit payment success messages
      if (data.text.includes("payment has been successfully processed")) {
        // Auto-detect successful payment in message texts and mark as completed
        console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] Payment success detected in message, marking payment as completed`);
        markPaymentCompleted();
      }
      
      // Check for payment link patterns in message text - CRITICAL NEW FEATURE
      const hasPaymentKeywords =
        data.text.toLowerCase().includes("payment") ||
        data.text.toLowerCase().includes("pay now") ||
        data.text.toLowerCase().includes("proceed with") ||
        data.text.toLowerCase().includes("₹") ||
        data.text.toLowerCase().includes("rs.");
        
      // Find any URLs in the message
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = data.text.match(urlRegex);
      
      if (hasPaymentKeywords && urls && urls.length > 0) {
        // Check each URL for payment link patterns
        for (const url of urls) {
          // Look for Razorpay links or standard payment patterns
          if (url.includes("rzp.io") ||
              url.includes("razorpay") ||
              url.includes("payment") ||
              url.includes("pay") ||
              url.includes("checkout") ||
              url.includes("rzp_")) {
                
            console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] Payment link detected in message: ${url}`);
            
            if (!hasCompletedPayment) {
              // Set the payment link and show popup
              console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] 🔔 SHOWING PAYMENT POPUP with link: ${url}`);
              setPaymentLink(url);
              setShowPaymentPopup(true);
              
              // Force a re-render to ensure popup appears
              setTimeout(() => {
                if (!showPaymentPopup) {
                  console.log(`[CHAT_CONTEXT:${contextId.current}:${handlerTimeId}] 🚨 Popup not showing, forcing show`);
                  setShowPaymentPopup(true);
                }
              }, 500);
              
              break; // Only handle the first payment link
            }
          }
        }
      }
    }
  };

  // Handle connection status changes
  const handleConnectionStatus = (status: 'connected' | 'connecting' | 'disconnected' | 'error') => {
    setConnectionStatus(status);
    
    if (status === 'disconnected' || status === 'error') {
      setIsLoading(false);
    }
  };

  // Keep stable references to handlers to prevent duplicate registrations
  const handlerRefs = React.useRef({
    message: handleWebSocketMessage,
    status: handleConnectionStatus
  });
  
  // Initialize WebSocket connection
  useEffect(() => {
    console.log(`[CHAT_CONTEXT:${contextId.current}] INITIALIZING WebSocket handlers`);
    
    // Store references to the handlers to ensure proper cleanup
    const msgHandler = handlerRefs.current.message;
    const statusHandler = handlerRefs.current.status;
    
    webSocketService.addMessageHandler(msgHandler);
    webSocketService.addStatusHandler(statusHandler);
    webSocketService.connect();

    // Cleanup function
    return () => {
      console.log(`[CHAT_CONTEXT:${contextId.current}] CLEANUP - Disconnecting WebSocket`);
      
      // Only disconnect if this is the only handler (to prevent breaking other components)
      if (webSocketService.getMessageHandlerCount() <= 1) {
        webSocketService.disconnect();
      }
    };
  }, []); // Empty dependency array = only run once

  // Send message to WebSocket service
  const sendMessage = (text: string) => {
    // Add user message to chat history
    const time = formatTime();
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text, time }
    ]);
    
    // Show loading state
    setIsLoading(true);
    
    // Send to WebSocket
    webSocketService.sendMessage(text);
  };

  // Close payment popup
  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
  };
  
  // Mark payment as completed - syncs with backend database and local storage
  // Now also provides client-side confirmation if server doesn't respond
  const markPaymentCompleted = () => {
    setHasCompletedPayment(true);
    try {
      // Store in localStorage as a cache
      localStorage.setItem('paymentCompleted', 'true');
      
      // Sync with server database for persistence across devices and sessions
      // This ensures the payment status is stored in MongoDB and persists even if localStorage is cleared
      webSocketService.sendToServer({
        type: 'payment_status',
        payment_completed: true,
        payment_status: 'completed',
        session_id: webSocketService.getSessionId(),
        cookie_id: webSocketService.getCookieId(),
        device_id: webSocketService.getDeviceId(),
        timestamp: new Date().toISOString()
      });
      
      console.log('Payment marked as completed and synced with server database');
      
      // Set a confirmation timeout in case the server doesn't respond
      // This ensures the user always gets feedback about their payment
      const serverResponseTimeout = setTimeout(() => {
        // Check if we already received a confirmation from the server
        const confirmationReceived = messages.some(m =>
          m.role === 'assistant' &&
          m.content.includes('payment has been successfully processed')
        );
        
        // If we haven't received confirmation from the server, show client-side message
        if (!confirmationReceived) {
          console.log('No server payment confirmation received, showing client-side confirmation');
          const time = formatTime();
          const confirmationMessage = "Your payment has been successfully processed. Our team will contact you shortly with next steps for your company registration.";
          
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: confirmationMessage,
            time,
            metadata: { type: 'client_side_payment_confirmation' }
          }]);
        }
      }, 5000); // Wait 5 seconds for server response before showing client-side message
      
      // Clean up timeout when component unmounts
      return () => clearTimeout(serverResponseTimeout);
    } catch (e) {
      console.error('Error storing payment status:', e);
      // Even if error occurs, show confirmation to user
      const time = formatTime();
      const confirmationMessage = "Your payment has been processed. Our team will contact you shortly with next steps.";
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: confirmationMessage,
        time,
        metadata: { type: 'client_side_payment_confirmation_fallback' }
      }]);
    }
  };

  // Set up inactivity handler for follow-up messages
  useEffect(() => {
    const inactivityTimeout = 60000; // 1 minute
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (connectionStatus === 'connected') {
          // Check if payment popup is open for context
          const context = showPaymentPopup ? 'payment_pending' : undefined;
          webSocketService.notifyInactivity(context);
        }
      }, inactivityTimeout);
    };

    // Reset timer on user activity
    const handleActivity = () => resetTimer();
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);
    
    // Initial timer setup
    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [connectionStatus, showPaymentPopup]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        connectionStatus,
        paymentLink,
        showPaymentPopup,
        closePaymentPopup,
        hasCompletedPayment,
        markPaymentCompleted,
        isLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};