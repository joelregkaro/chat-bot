import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to extract payment link from message
  const extractPaymentLink = (message: string): string | null => {
    // Match markdown links like [Pay here](https://rzp.io/abc123)
    const markdownRegex = /\[([^\]]+)\]\((https:\/\/rzp\.io\/[^\s)]+)\)/;
    // Match plain URLs like https://rzp.io/abc123
    const urlRegex = /https:\/\/rzp\.io\/[^\s)]+/;

    console.log("Attempting to extract payment link from:", message);

    // First try to extract from markdown
    const markdownMatch = message.match(markdownRegex);
    if (markdownMatch) {
      return markdownMatch[2]; // Return the URL part
    }

    // Then try to extract plain URL
    const urlMatch = message.match(urlRegex);
    return urlMatch ? urlMatch[0] : null;
  };

  // Function to format message with clickable links
  const formatMessage = (content: string) => {
    // Process markdown links first - replace them with placeholder to avoid double processing
    const markdownRegex = /\[([^\]]+)\]\((https:\/\/rzp\.io\/[^\s)]+)\)/g;
    let processedContent = content;
    const markdownLinks: Array<{ text: string; url: string }> = [];

    // Extract and collect all markdown links
    processedContent = processedContent.replace(
      markdownRegex,
      (match, text, url) => {
        const placeholder = `__MARKDOWN_LINK_${markdownLinks.length}__`;
        markdownLinks.push({ text, url });
        return placeholder;
      }
    );

    // Now process regular URLs
    const urlRegex = /(https:\/\/rzp\.io\/[^\s)]+)/g;
    const parts = processedContent.split(urlRegex);

    // Replace each part, handling both regular URLs and our placeholders
    return parts.map((part, index) => {
      // Handle regular URLs
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

      // For non-URL parts, check for markdown link placeholders
      if (part.includes("__MARKDOWN_LINK_")) {
        // Create a wrapper span so we can handle multiple placeholders
        const elements: React.ReactNode[] = [];
        let remainingText = part;
        let lastIndex = 0;

        // Process each placeholder
        markdownLinks.forEach((link, i) => {
          const placeholder = `__MARKDOWN_LINK_${i}__`;
          const placeholderIndex = remainingText.indexOf(placeholder);

          if (placeholderIndex !== -1) {
            // Add text before the placeholder
            if (placeholderIndex > 0) {
              elements.push(remainingText.substring(0, placeholderIndex));
            }

            // Add the link
            elements.push(
              <a
                key={`md-${i}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline"
              >
                {link.text}
              </a>
            );

            // Update remaining text
            remainingText = remainingText.substring(
              placeholderIndex + placeholder.length
            );
          }
        });

        // Add any remaining text
        if (remainingText) {
          elements.push(remainingText);
        }

        return <>{elements}</>;
      }

      return part;
    });
  };

  // Handle payment button click
  const handlePaymentClick = () => {
    console.log("Payment button clicked");

    // Find the first message with a payment link
    const paymentMessage = messages.find(
      (msg) =>
        msg.role === "assistant" &&
        (msg.content.includes("https://rzp.io/") ||
          msg.content.includes("rzp.io/"))
    );

    if (!paymentMessage) {
      console.error("No payment message found in the chat");
      sendChatMessage("No payment link found. Please contact support.");
      return;
    }

    const paymentLink = extractPaymentLink(paymentMessage.content);
    if (!paymentLink) {
      console.error("No payment link found in the message");
      sendChatMessage("Invalid payment link. Please contact support.");
      return;
    }

    // Open payment link in new tab
    const newWindow = window.open(paymentLink, "_blank");
    if (newWindow) {
      setPaymentWindow(newWindow);

      // Check for payment completion every 2 seconds
      const checkPaymentInterval = setInterval(() => {
        try {
          // Check if window is closed by user
          if (newWindow.closed) {
            clearInterval(checkPaymentInterval);
            setPaymentWindow(null);
            return;
          }

          // Listen for payment completion message
          window.addEventListener("message", function (event) {
            if (event.data && event.data.type === "payment_completed") {
              clearInterval(checkPaymentInterval);
              newWindow.close();
              setPaymentWindow(null);
              sendChatMessage(
                "Payment completed successfully! We'll proceed with your registration."
              );
            }
          });
        } catch (error) {
          // If we can't access the window (cross-origin), just clear the interval
          clearInterval(checkPaymentInterval);
        }
      }, 2000);

      // Cleanup interval when component unmounts
      return () => clearInterval(checkPaymentInterval);
    } else {
      console.error("Could not open payment window");
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

      // Get Razorpay key from environment variables with clear logging
      const key = process.env.RAZORPAY_KEY_ID;
      if (!key) {
        console.error("❌ Razorpay key not found in environment variables");
        throw new Error("Razorpay key not configured");
      }
      console.log(
        `🔑 Using Razorpay key: ${key} [${
          process.env.NODE_ENV === "production" ? "Production" : "Development"
        }]`
      );

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

      {/* Message input area */}
      <div className="p-3 border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 min-h-[40px] max-h-32 resize-none focus:border-blue focus:ring-1 focus:ring-blue"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-blue hover:bg-blue/90"
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
