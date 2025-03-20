import { Award, Clock, UserCheck, Shield, Settings } from "lucide-react"

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <Award className="h-10 w-10 text-white" />,
      title: "Expert Guidance",
      description:
        "Our experienced professionals ensure your registration process is smooth, compliant, and efficient.",
    },
    {
      icon: <Clock className="h-10 w-10 text-orange" />,
      title: "Time & Cost Efficiency",
      description:
        "We streamline the process to minimize delays and reduce registration costs, giving you a competitive edge.",
    },
    {
      icon: <UserCheck className="h-10 w-10 text-orange" />,
      title: "Personalized Support",
      description:
        "We offer tailored solutions to meet your business needs from document verification to post-incorporation compliance.",
    },
    {
      icon: <Shield className="h-10 w-10 text-orange" />,
      title: "Comprehensive Compliance",
      description:
        "From documentation to filing, we handle all aspects of statutory compliance, reducing your administrative burden.",
    },
    {
      icon: <Settings className="h-10 w-10 text-orange" />,
      title: "Tailored Solutions",
      description:
        "Our services are customized to meet your specific business needs, ensuring a perfect fit for your unique situation.",
    },
    {
      icon: <Settings className="h-10 w-10 text-orange" />,
      title: "Tailored Solutions",
      description:
        "Our services are customized to meet your specific business needs, ensuring a perfect fit for your unique situation.",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-white via-blue-50/30 to-orange-50/30 relative overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-blue text-center mb-4">
          Why Choose Us For Private Limited Company Registration in Delhi NCR?
        </h2>
        <p className="text-center text-darkgray mb-12 max-w-3xl mx-auto">
          We make the registration process seamless so you can focus on growing your business
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 cursor-pointer">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-custom hover:shadow-custom-hover transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-cream rounded-full">{reason.icon}</div>
                <h3 className="text-xl font-semibold text-blue mb-3">{reason.title}</h3>
                <p className="text-[#474747] leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

