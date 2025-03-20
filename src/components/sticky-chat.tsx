import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, User, Bot, Sparkles, Clock } from "lucide-react";

export default function StickyChat() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string; time: string }[]>([
    { 
      sender: "bot", 
      message: "👋 Hello! I'm your AI assistant. How can I help you with company registration today?", 
      time: "Just now" 
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setChatHistory([
      ...chatHistory,
      { sender: "user", message, time }
    ]);
    setMessage("");

    // Simulate bot response after a delay
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        { 
          sender: "bot", 
          message: "I'll help you with that! For company registration in Delhi NCR, you'll need identity proof, address proof, and business registration documents. Would you like more information on any specific part of the process?", 
          time 
        }
      ]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-floating w-full h-[calc(100vh-8rem)] flex flex-col overflow-hidden border border-gray-100">
      {/* Chat header */}
      <div className="bg-blue text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">CA Amit Aggrawal</h3>
            <div className="flex items-center text-xs text-white/80">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
              Online now
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="space-y-4">
          {chatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[80%] ${chat.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div 
                  className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${
                    chat.sender === "user" ? "bg-orange ml-2" : "bg-blue mr-2"
                  }`}
                >
                  {chat.sender === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <div 
                    className={`p-3 rounded-lg ${
                      chat.sender === "user" 
                        ? "bg-orange text-white rounded-tr-none"
                        : "bg-white text-darkgray border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm">{chat.message}</p>
                  </div>
                  <div 
                    className={`flex items-center text-xs mt-1 text-gray-500 ${
                      chat.sender === "justify-end" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {chat.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Quick action buttons */}
      <div className="p-1.5 border-t border-gray-100 flex overflow-x-auto gap-2 bg-gray-50">
        <button className="px-3 py-1.5 text-xs bg-blue/10 text-blue rounded-full whitespace-nowrap hover:bg-blue/20 transition-colors">
          Registration Process
        </button>
        <button className="px-3 py-1.5 text-xs bg-blue/10 text-blue rounded-full whitespace-nowrap hover:bg-blue/20 transition-colors">
          Documents Required
        </button>
        <button className="px-3 py-1.5 text-xs bg-blue/10 text-blue rounded-full whitespace-nowrap hover:bg-blue/20 transition-colors">
          Pricing Plans
        </button>
        <button className="px-3 py-1.5 text-xs bg-blue/10 text-blue rounded-full whitespace-nowrap hover:bg-blue/20 transition-colors">
          Processing Time
        </button>
      </div>
      
      {/* Chat input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 focus-visible:ring-blue"
          />
          <Button 
            type="submit"
            className="bg-blue hover:bg-blue/90 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {/* <p className="text-xs text-gray-500 mt-2">
          Powered by AI • Responses typically within 5 seconds
        </p> */}
      </form>
    </div>
  );
}