import { Check } from "lucide-react"
import { Button } from "./ui/button"
import { useChat } from "../contexts/ChatContext"

export default function Pricing() {
  // Use the chat context to send messages to the chat
  const { sendMessage } = useChat();
  
  // Function to handle plan selection
  const handleSelectPlan = (plan: any) => {
    // Send message with plan details to the chat
    sendMessage(`I'm interested in the ${plan.name} plan for ${plan.price}. Please help me get started with this package.`);
    
    // Scroll to the chat section
    const chatElement = document.getElementById('chat-section');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const plans = [
    {
      name: "Basic",
      price: "₹1,999",
      description: "Perfect for startups and small businesses",
      features: [
        "2 DIN and DSC for Two Directors",
        "Drafting of MoA & AoA",
        "Registration Fees & Stamp Duty",
        "Company Incorporation Certificate",
        "PAN and TAN",
      ],
      highlight: false,
      buttonText: "Get Started",
    },
    {
      name: "Standard",
      price: "₹9,999",
      description: "Most popular for growing businesses",
      features: [
        "Everything in Basic",
        "GST Registration",
        "Current Account Opening Assistance",
        "Compliance Calendar",
        "1 Year Annual Compliance",
        "Digital Signature Certificate",
      ],
      highlight: true,
      buttonText: "Choose Plan",
    },
    {
      name: "Premium",
      price: "₹12,999",
      description: "Complete solution for established businesses",
      features: [
        "Everything in Standard",
        "Trademark Registration",
        "MSME Registration",
        "Legal Document Review",
        "Dedicated Relationship Manager",
        "Business Advisory Services",
      ],
      highlight: false,
      buttonText: "Contact Us",
    },
  ]

  return (
    <section id="pricing" className="py-16 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 relative overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Transparent Pricing Plans</h2>
        <p className="text-center text-darkgray mb-12 max-w-3xl mx-auto">
          Choose the perfect plan for your business needs with no hidden charges
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 shadow-custom ${
                plan.highlight
                  ? "border-2 border-orange relative transform -translate-y-4 card-hover"
                  : "border border-gray-100 card-hover"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-orange" : "text-blue"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-darkgray">{plan.price}</span>
                  <span className="text-darkgray ml-2">+ Govt Fee</span>
                </div>
                <p className="text-darkgray/70 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check
                      className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-orange" : "text-blue"}`}
                    />
                    <span className="text-darkgray">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto text-center">
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-6 ${
                    plan.highlight ? "bg-orange hover:bg-orange/90" : "bg-blue hover:bg-blue/90"
                  } rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-darkgray/70 max-w-2xl mx-auto">
            All plans include expert assistance, document preparation, and filing with the Registrar of Companies.
            Government fees are additional and vary based on your company's authorized capital.
          </p>
        </div>
      </div>
    </section>
  )
}

