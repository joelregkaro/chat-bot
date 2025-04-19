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

// Add interface for registration data
interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  package: string;
}

// Add interface for webhook response
interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
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
  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [isSendingData, setIsSendingData] = useState(false);
  const [paymentIframe, setPaymentIframe] = useState<HTMLIFrameElement | null>(
    null
  );
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to extract payment link from message
  const extractPaymentLink = (message: string): string | null => {
    const urlRegex = /https:\/\/rzp\.io\/l\/[^\s)]+/;
    const match = message.match(urlRegex);
    return match ? match[0] : null;
  };

  // Function to format message with clickable links
  const formatMessage = (content: string) => {
    const urlRegex = /(https:\/\/rzp\.io\/l\/[^\s)]+)/g;
    return content.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Handle payment button click
  const handlePaymentClick = () => {
    // Find the first message with a payment link
    const paymentMessage = messages.find(
      (msg) =>
        msg.role === "assistant" && msg.content.includes("https://rzp.io/l/")
    );

    if (paymentMessage) {
      const paymentLink = extractPaymentLink(paymentMessage.content);
      if (paymentLink) {
        setShowPaymentIframe(true);
        // Create iframe after state update
        setTimeout(() => {
          // Create modal container
          const modalContainer = document.createElement("div");
          modalContainer.style.position = "fixed";
          modalContainer.style.top = "0";
          modalContainer.style.left = "0";
          modalContainer.style.width = "100%";
          modalContainer.style.height = "100%";
          modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
          modalContainer.style.display = "flex";
          modalContainer.style.alignItems = "center";
          modalContainer.style.justifyContent = "center";
          modalContainer.style.zIndex = "1000";

          // Create iframe wrapper
          const iframeWrapper = document.createElement("div");
          iframeWrapper.style.position = "relative";
          iframeWrapper.style.width = "90%";
          iframeWrapper.style.maxWidth = "800px";
          iframeWrapper.style.height = "80vh";
          iframeWrapper.style.backgroundColor = "white";
          iframeWrapper.style.borderRadius = "8px";
          iframeWrapper.style.overflow = "hidden";
          iframeWrapper.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

          // Create iframe
          const iframe = document.createElement("iframe");
          iframe.src = paymentLink;
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.border = "none";

          // Add close button
          const closeButton = document.createElement("button");
          closeButton.innerHTML =
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
          closeButton.style.position = "absolute";
          closeButton.style.top = "12px";
          closeButton.style.right = "12px";
          closeButton.style.padding = "8px";
          closeButton.style.backgroundColor = "white";
          closeButton.style.border = "none";
          closeButton.style.borderRadius = "50%";
          closeButton.style.cursor = "pointer";
          closeButton.style.zIndex = "1001";
          closeButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          closeButton.onclick = () => {
            document.body.removeChild(modalContainer);
            setShowPaymentIframe(false);
          };

          // Add message listener for payment completion
          window.addEventListener("message", function (event) {
            if (event.data && event.data.type === "payment_completed") {
              document.body.removeChild(modalContainer);
              setShowPaymentIframe(false);
              sendChatMessage(
                "Payment completed successfully! We'll proceed with your registration."
              );
            }
          });

          iframeWrapper.appendChild(iframe);
          iframeWrapper.appendChild(closeButton);
          modalContainer.appendChild(iframeWrapper);
          document.body.appendChild(modalContainer);
          setPaymentIframe(iframe);
        }, 0);
      } else {
        console.error("No payment link found in the first message");
      }
    } else {
      console.error("No payment message found in the chat");
    }
  };

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

  // Add function to validate registration data
  const validateRegistrationData = (data: RegistrationData): boolean => {
    if (!data.name || data.name.trim().length < 2) {
      setWebhookError("Please provide a valid name");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      setWebhookError("Please provide a valid email address");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!data.phone || !phoneRegex.test(data.phone.replace(/\D/g, ""))) {
      setWebhookError("Please provide a valid 10-digit phone number");
      return false;
    }

    if (!data.serviceType) {
      setWebhookError("Please specify the service type");
      return false;
    }

    if (!data.package) {
      setWebhookError("Please specify the package");
      return false;
    }

    return true;
  };

  // Enhanced function to send data to webhook with retry logic
  const sendToWebhook = async (
    data: RegistrationData,
    retryCount = 0
  ): Promise<WebhookResponse> => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    try {
      setIsSendingData(true);
      setWebhookError(null);

      // Validate data before sending
      if (!validateRegistrationData(data)) {
        return {
          success: false,
          error: webhookError || "Invalid registration data",
        };
      }

      const response = await fetch(
        "https://flow.zoho.in/60012180367/flow/webhook/incoming?zapikey=1001.fa7a8e3f7c71979544a6f99cd3b5367e.764173d0054f4da1767f12ce415fa088&isdebug=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone.replace(/\D/g, ""), // Remove non-digit characters
            service_type: data.serviceType.trim(),
            package: data.package.trim(),
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Registration data sent to webhook successfully:", result);
      return { success: true, message: "Data sent successfully" };
    } catch (error) {
      console.error("❌ Error sending data to webhook:", error);

      if (retryCount < maxRetries) {
        console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return sendToWebhook(data, retryCount + 1);
      }

      setWebhookError(
        "Failed to send registration data. Please try again later."
      );
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    } finally {
      setIsSendingData(false);
    }
  };

  // Enhanced message processing with better data extraction
  const extractRegistrationData = (
    message: string
  ): RegistrationData | null => {
    try {
      // More robust regex patterns for data extraction
      const nameMatch = message.match(
        /(?:name|full name|your name)[:：]?\s*([^\n,]+)/i
      );
      const emailMatch = message.match(
        /(?:email|email address)[:：]?\s*([^\n,]+)/i
      );
      const phoneMatch = message.match(
        /(?:phone|mobile|contact number)[:：]?\s*([^\n,]+)/i
      );
      const serviceMatch = message.match(
        /(?:service|service type)[:：]?\s*([^\n,]+)/i
      );
      const packageMatch = message.match(/(?:package|plan)[:：]?\s*([^\n,]+)/i);

      const data: RegistrationData = {
        name: nameMatch ? nameMatch[1].trim() : "",
        email: emailMatch ? emailMatch[1].trim() : "",
        phone: phoneMatch ? phoneMatch[1].trim() : "",
        serviceType: serviceMatch ? serviceMatch[1].trim() : "",
        package: packageMatch ? packageMatch[1].trim() : "",
      };

      // Check if we have all required fields
      if (
        data.name &&
        data.email &&
        data.phone &&
        data.serviceType &&
        data.package
      ) {
        return data;
      }

      return null;
    } catch (error) {
      console.error("Error extracting registration data:", error);
      return null;
    }
  };

  // Modify handleSendMessage to use enhanced data extraction
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || connectionStatus !== "connected" || isLoading)
      return;

    const userMessage = message.trim();
    setMessage("");
    sendChatMessage(userMessage);

    // Check if message contains registration details
    if (
      userMessage.toLowerCase().includes("register") ||
      userMessage.toLowerCase().includes("sign up") ||
      userMessage.toLowerCase().includes("interested")
    ) {
      const registrationData = extractRegistrationData(userMessage);

      if (registrationData) {
        setRegistrationData(registrationData);
        const result = await sendToWebhook(registrationData);

        if (result.success) {
          sendChatMessage(
            "Thank you for providing your details. We'll get back to you shortly!"
          );
        } else {
          sendChatMessage(
            "I apologize, but we couldn't process your registration details. Please try again or contact our support team."
          );
        }
      }
    }
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
                    <img
                      src={caImage}
                      alt="CA Amit Aggrawal"
                      className="h-6 w-6 rounded-full"
                    />
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
                      {formatMessage(message.content)}
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

          {/* Payment button - shown when payment link is received */}
          {showPaymentPopup && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 bg-blue mr-2">
                  <img
                    src={caImage}
                    alt="CA Amit Aggrawal"
                    className="h-6 w-6 rounded-full"
                  />
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
                  <img
                    src={caImage}
                    alt="CA Amit Aggrawal"
                    className="h-6 w-6 rounded-full"
                  />
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
