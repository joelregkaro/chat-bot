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
  const [isLoading, setIsLoading] = useState(false);

  // Format timestamp for messages
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Track previously seen message IDs to avoid duplicates
  const [lastMessageIds, setLastMessageIds] = useState<string[]>([]);

  // Handle incoming messages from WebSocket
  const handleWebSocketMessage = (data: WebSocketResponse) => {
    const time = formatTime();

    if (data.type === 'message' || data.type === 'follow_up') {
      if (data.text) {
        // Create a local variable with a definite type to fix the TypeScript error
        const messageText: string = data.text;
        
        // Use the message ID from WebSocketService if available, or generate one
        const messageId = data.messageId || `${Date.now()}-${messageText.substring(0, 20)}`;
        
        // Skip welcome/greeting messages if we already have some messages
        const isGreeting = messageText.includes("Hello!") ||
                          messageText.includes("Welcome") ||
                          messageText.includes("How can I help you");
        
        const shouldSkipGreeting = isGreeting && messages.length > 0;
        
        // Only add the message if we haven't seen it recently and it's not a duplicate greeting
        if (!lastMessageIds.includes(messageId) && !shouldSkipGreeting) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: messageText, time }
          ]);
          
          // Keep track of the last few message IDs (limit to 15)
          setLastMessageIds(prev => {
            const updated = [...prev, messageId];
            return updated.slice(-15); // Keep the last 15
          });
        } else {
          console.log("Filtered out duplicate or welcome message:", messageText.substring(0, 30));
        }
      }
      setIsLoading(false);
    } else if (data.type === 'payment_link' && data.link) {
      setPaymentLink(data.link);
      setShowPaymentPopup(true);
    }
  };

  // Handle connection status changes
  const handleConnectionStatus = (status: 'connected' | 'connecting' | 'disconnected' | 'error') => {
    setConnectionStatus(status);
    
    if (status === 'disconnected' || status === 'error') {
      setIsLoading(false);
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    webSocketService.addMessageHandler(handleWebSocketMessage);
    webSocketService.addStatusHandler(handleConnectionStatus);
    webSocketService.connect();

    return () => {
      webSocketService.disconnect();
    };
  }, []);

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