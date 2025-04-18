import React from "react";

export default function RegistrationProcess() {
  return (
    <section className="py-16 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 relative overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-blue text-center mb-12">
          Step-by-Step Process of Company Registration
        </h2>

        <div className="grid md:grid-cols-2 gap-8 px-4 cursor-pointer">
          <div className="relative">
            <div className="bg-white p-6 rounded-lg shadow-custom hover:shadow-custom-hover transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue h-full">
              <div className="absolute -top-4 left-6 bg-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#2A5C92] mb-3 mt-2">
                Obtain DSC & DIN
              </h3>
              <p className="text-darkgray leading-relaxed">
                Secure Digital Signature Certificates and Director
                Identification Numbers for all directors.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white p-6 rounded-lg shadow-custom hover:shadow-custom-hover transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue h-full">
              <div className="absolute -top-4 left-6 bg-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-blue mb-3 mt-2">
                Name Approval
              </h3>
              <p className="text-darkgray leading-relaxed">
                Propose a unique company name and obtain approval from the
                Ministry of Corporate Affairs with expert assistance from
                professionals like RegisterKaro.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white p-6 rounded-lg shadow-custom hover:shadow-custom-hover transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue h-full">
              <div className="absolute -top-4 left-6 bg-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-blue mb-3 mt-2">
                Prepare Documentation
              </h3>
              <p className="text-darkgray leading-relaxed">
                Draft and finalize your MOA, AOA, and other statutory forms.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white p-6 rounded-lg shadow-custom hover:shadow-custom-hover transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue h-full">
              <div className="absolute -top-4 left-6 bg-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h3 className="text-xl font-semibold text-blue mb-3 mt-2">
                Filing, Verification & Incorporation
              </h3>
              <p className="text-darkgray leading-relaxed">
                Submit all documents for verification, address any queries, and
                receive your Certificate of Incorporation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
