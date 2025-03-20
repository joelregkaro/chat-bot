import { Button } from "./ui/button"
import { Send, CheckCircle2, ArrowRight, Shield, Clock, FileCheck } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-white via-blue-50/30 to-orange-50/30 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative">
        <div className="grid md:grid-cols-2 gap-12 items-center px-4">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue/10 rounded-full">
                <span className="text-blue font-medium text-sm">Trusted by 50,000+ Businesses</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-blue leading-tight">
                Private Limited Company Registration In Delhi NCR
              </h1>
              <h2 className="text-xl md:text-2xl text-orange font-medium">
                Start Your Business Journey Today!
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue rounded-full p-2 flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-darkgray font-medium">2 DIN and DSC For Two Directors</p>
                  <p className="text-sm text-gray-500 mt-1">Digital Signature Certificate Included</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue rounded-full p-2 flex-shrink-0">
                  <FileCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-darkgray font-medium">Drafting Of MoA & AoA</p>
                  <p className="text-sm text-gray-500 mt-1">Professional Document Preparation</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue rounded-full p-2 flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-darkgray font-medium">Registration Fees & Stamp Duty</p>
                  <p className="text-sm text-gray-500 mt-1">All Government Fees Covered</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue rounded-full p-2 flex-shrink-0">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-darkgray font-medium">Company Incorporation Certificate</p>
                  <p className="text-sm text-gray-500 mt-1">Fast Processing Within 7-10 Days</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-orange/20 transform hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-orange font-semibold text-xl">Registration Starts At ₹1,999</h3>
                  <p className="text-darkgray text-sm mt-1">+ Government Fees • No Hidden Charges!</p>
                </div>
                <div className="text-3xl">🎉</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-orange hover:bg-orange/90 text-white rounded-full px-8 py-6 shadow-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105">
                Start Registration <ArrowRight className="h-5 w-5" />
              </Button>
              <Button className="bg-white hover:bg-cream text-orange border-2 border-orange rounded-full px-8 py-6 shadow-lg flex items-center gap-2 transition-all duration-300">
                Chat With AI Assistant <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center">
                      <span className="text-blue text-xl font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue">Document Collection</h4>
                      <p className="text-sm text-gray-500">Gather all required documents</p>
                    </div>
                  </div>
                  <div className="text-orange">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center">
                      <span className="text-orange text-xl font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange">Verification</h4>
                      <p className="text-sm text-gray-500">Document verification process</p>
                    </div>
                  </div>
                  <div className="text-orange">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600">Registration Complete</h4>
                      <p className="text-sm text-gray-500">Get your incorporation certificate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

