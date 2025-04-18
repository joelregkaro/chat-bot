import { Button } from "./ui/button"
import { Send, CheckCircle2, ArrowRight, Shield, Clock, FileCheck, Check } from "lucide-react"
import heroImage from "../assets/heroImg.png"
import hero from "../assets/hero.svg"
export default function Hero() {
  return (
    <div className="hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-2 text-sm text-white/90">
          Trusted By 50000+ Business
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center pt-4 relative min-h-[600px]">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-white leading-tight">
              Private Limited Company Registration In Delhi NCR
            </h1>
            
            <h2 className="text-2xl font-semibold text-[#FFE3C3]">
              Start Your Business Journey Today!
            </h2>

            <div className="space-y-2">
              {[
                '2 DIN And DSC For Two Directors',
                'Drafting Of MoA & AoA',
                'Registration Fees & Stamp Duty',
                'Company Incorporation Certificate',
                'Company PAN and TAN'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="text-white" size={24} />
                  <span className="text-white text-md">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4 max-w-lg relative z-10">
              <div className="text-white">
                <div className="text-xl font-semibold text-[#FBFAF9]">Registration Starts At ₹1,999 + Govt Fee</div>
                <div className="text-[#EBECED] underline-style inline-block">No Hidden Charges!</div>
              </div>
              
              <button className="bg-gradient-to-br from-custom-blue to-custom-indigo text-[#FFFFFF] px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
                Start Registration
              </button>
            </div>
          </div>

          <div className="hidden lg:block absolute right-0 bottom-0 w-[60%]">
            <img 
              src={heroImage}
              alt="Business Professional"
              className="w-full h-auto rounded-lg opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

