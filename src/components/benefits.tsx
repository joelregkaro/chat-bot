import { CheckCircle } from "lucide-react"

export default function Benefits() {
  const benefits = [
    {
      title: "Enhanced Credibility",
      description:
        "Establish a professional identity that builds trust with investors, customers, and financial institutions.",
    },
    {
      title: "Limited Liability",
      description: "Protect personal assets by legally separating them from the company's liabilities.",
    },
    {
      title: "Funding & Incentives",
      description:
        "Enjoy easier access to funding, tax benefits, and government incentives that support business expansion.",
    },
    {
      title: "Tax Efficiency",
      description: "Benefit from various tax incentives, deductions, and a clear tax structure.",
    },
    {
      title: "Stronger Market Position",
      description: "Bolster your brand image and credibility in the competitive Delhi NCR market.",
    },
    {
      title: "Ease of Expansion",
      description:
        "A registered company finds it easier to scale operations, enter new markets, and secure business deals.",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-white via-blue-50/30 to-orange-50/30 relative overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-blue text-center mb-12">
          Benefits of Registering as a Private Limited Company in Delhi NCR
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 cursor-pointer">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-custom hover:shadow-custom-hover transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-[#FCA229] mb-2">{benefit.title}</h3>
                  <p className="text-darkgray leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

