import { Button } from "./ui/button";
import {
  MessageSquare,
  Shield,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";
import RegisterForm from "./RegisterForm";
import { useState, useEffect } from "react";
import { useChat } from "../contexts/ChatContext";

export default function ExpertAssistance() {
  const [isOpen, setIsOpen] = useState(false);
  const { sendMessage } = useChat();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile using useEffect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChatClick = () => {
    // Send message to start registration process
    sendMessage(
      "I want to start the registration process, Please help me with the process"
    );

    // On mobile, find and click the chat button to trigger the popup
    if (isMobile) {
      const chatButton = document.querySelector(
        '[data-testid="chat-button"]'
      ) as HTMLElement;
      if (chatButton) {
        chatButton.click();
      }
    } else {
      // On desktop, scroll to chat section
      const chatElement = document.getElementById("chat-section");
      if (chatElement) {
        chatElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue/10 rounded-full mb-6">
              <span className="text-blue font-medium text-sm">
                Expert Support Available 24/7
              </span>
            </div>
            <h2 className="text-4xl font-bold text-blue mb-4">
              Need Expert Assistance?
            </h2>
            <p className="text-darkgray text-lg leading-relaxed max-w-2xl mx-auto">
              Our team of legal and compliance experts is ready to help you
              navigate complex regulatory requirements and ensure your business
              stays compliant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue" />
              </div>
              <h3 className="text-lg font-semibold text-blue mb-2">
                Legal Expertise
              </h3>
              <p className="text-darkgray/70 text-sm">
                Comprehensive legal guidance for your business
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange" />
              </div>
              <h3 className="text-lg font-semibold text-orange mb-2">
                24/7 Support
              </h3>
              <p className="text-darkgray/70 text-sm">
                Round-the-clock assistance when you need it
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Dedicated Team
              </h3>
              <p className="text-darkgray/70 text-sm">
                Personalized support from our experts
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">
                Guaranteed Quality
              </h3>
              <p className="text-darkgray/70 text-sm">
                100% satisfaction guaranteed service
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue/5 rounded-full translate-y-16 -translate-x-16"></div>

            <div className="relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-blue mb-2">
                    Ready to Get Started?
                  </h3>
                  <p className="text-darkgray">
                    Get expert assistance for your business registration
                  </p>
                </div>
                <Button
                  onClick={handleChatClick}
                  className="bg-orange hover:bg-orange/90 text-white rounded-full px-8 py-6 text-base font-medium shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 min-w-[200px]"
                >
                  <MessageSquare className="h-5 w-5" /> Chat With Us
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-darkgray/70 text-sm">
              Join thousands of satisfied businesses that have trusted our
              expertise
            </p>
          </div>
        </div>
      </div>

      {/* Register Form Modal - Commented out for now
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="relative h-full flex items-end md:items-center justify-center">
            <div className="w-full max-w-xl mx-auto p-4 md:p-6">
              <RegisterForm onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
      */}
    </section>
  );
}
