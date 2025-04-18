import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea"; // Replace Input with Textarea
import {
  Send,
  User,
  Bot,
  Sparkles,
  Clock,
  X,
  CreditCard,
  Loader2,
} from "lucide-react";
import caImage from "../assets/heroImg.png";
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
    markPaymentCompleted,
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle payment link click - defined with useCallback for React Hook dependencies
  const handlePaymentClick = useCallback(async () => {
    if (paymentLink) {
      console.log(
        "🔄 Payment button clicked, processing payment link:",
        paymentLink
      );

      // Create iframe container
      const iframeContainer = document.createElement("div");
      iframeContainer.style.position = "fixed";
      iframeContainer.style.top = "0";
      iframeContainer.style.left = "0";
      iframeContainer.style.width = "100%";
      iframeContainer.style.height = "100%";
      iframeContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      iframeContainer.style.zIndex = "1000";
      iframeContainer.style.display = "flex";
      iframeContainer.style.alignItems = "center";
      iframeContainer.style.justifyContent = "center";

      // Create iframe
      const iframe = document.createElement("iframe");
      iframe.src = paymentLink;
      iframe.style.width = "90%";
      iframe.style.height = "90%";
      iframe.style.maxWidth = "800px";
      iframe.style.maxHeight = "600px";
      iframe.style.border = "none";
      iframe.style.borderRadius = "8px";
      iframe.style.backgroundColor = "white";

      // Create close button
      const closeButton = document.createElement("button");
      closeButton.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      closeButton.style.position = "absolute";
      closeButton.style.top = "20px";
      closeButton.style.right = "20px";
      closeButton.style.padding = "8px";
      closeButton.style.backgroundColor = "white";
      closeButton.style.border = "none";
      closeButton.style.borderRadius = "50%";
      closeButton.style.cursor = "pointer";
      closeButton.style.zIndex = "1001";
      closeButton.onclick = () => {
        document.body.removeChild(iframeContainer);
      };

      // Add elements to DOM
      iframeContainer.appendChild(iframe);
      iframeContainer.appendChild(closeButton);
      document.body.appendChild(iframeContainer);

      // Listen for payment completion message from iframe
      const handleMessage = (event: MessageEvent) => {
        if (
          event.data &&
          typeof event.data === "object" &&
          event.data.payment_status === "completed"
        ) {
          markPaymentCompleted();
          sendChatMessage("Your payment has been successfully processed.");
          document.body.removeChild(iframeContainer);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);
    }
  }, [paymentLink, markPaymentCompleted, sendChatMessage]);

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
    if (e.key === "Enter" && e.shiftKey) {
      // Allow normal behavior (newline)
      return;
    }
    // If just Enter is pressed (without Shift), send the message
    else if (e.key === "Enter" && !e.shiftKey) {
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

  return (
    <div className="bg-white rounded-2xl shadow-floating w-full h-[calc(100vh-8rem)] flex flex-col overflow-hidden border border-gray-100">
      {/* Chat header */}
      <div className="bg-blue text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-full">
            <img
              src={caImage}
              alt="CA Amit Aggrawal"
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div>
            <h3 className="font-medium">CA Amit Aggrawal</h3>
            <div className="flex items-center text-xs text-white/80">
              <div
                className={`h-2 w-2 rounded-full mr-2 ${
                  connectionStatus === "connected"
                    ? "bg-green-400"
                    : connectionStatus === "connecting"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
              ></div>
              {connectionStatus === "connected"
                ? "Online now"
                : connectionStatus === "connecting"
                ? "Connecting..."
                : "Offline"}
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

      {/* Chat messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
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
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex items-center text-xs mt-1 text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {message.time}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Payment message - shown when payment link is received */}
          {showPaymentPopup && paymentLink && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 bg-blue mr-2">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="p-3 rounded-lg bg-white text-darkgray border border-gray-200 rounded-tl-none">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-lg font-medium">Complete Payment</h3>
                      <p className="text-gray-700">
                        Click the button below to securely complete your payment
                        for company registration:
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
                </div>
              </div>
            </div>
          )}

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
          onClick={() =>
            sendChatMessage("Tell me about the registration process")
          }
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            isLoading || connectionStatus !== "connected"
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue/10 text-blue hover:bg-blue/20"
          }`}
          disabled={isLoading || connectionStatus !== "connected"}
        >
          Registration Process
        </button>
        <button
          onClick={() => sendChatMessage("What documents are required?")}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            isLoading || connectionStatus !== "connected"
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue/10 text-blue hover:bg-blue/20"
          }`}
          disabled={isLoading || connectionStatus !== "connected"}
        >
          Documents Required
        </button>
        <button
          onClick={() => sendChatMessage("What are your pricing plans?")}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            isLoading || connectionStatus !== "connected"
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue/10 text-blue hover:bg-blue/20"
          }`}
          disabled={isLoading || connectionStatus !== "connected"}
        >
          Pricing Plans
        </button>
        <button
          onClick={() => sendChatMessage("How long does the process take?")}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            isLoading || connectionStatus !== "connected"
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue/10 text-blue hover:bg-blue/20"
          }`}
          disabled={isLoading || connectionStatus !== "connected"}
        >
          Processing Time
        </button>
      </div>

      {/* Chat input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-gray-100 bg-white"
      >
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1 focus-visible:ring-blue min-h-[60px] resize-y max-h-[150px]"
            disabled={connectionStatus !== "connected" || isLoading}
            autoFocus
          />
          <Button
            type="submit"
            className="bg-blue hover:bg-blue/90 text-white self-end h-[60px]"
            disabled={
              !message.trim() || connectionStatus !== "connected" || isLoading
            }
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {connectionStatus === "connected"
            ? "Connected to AI assistant • Responses typically within 5 seconds"
            : connectionStatus === "connecting"
            ? "Connecting to AI assistant..."
            : "Disconnected - Unable to reach the assistant"}
        </p>
      </form>
    </div>
  );
}
