import React from 'react';

export default function DocumentsRequired() {
  return (
    <section className="py-16 bg-custom-gradient-page relative overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-blue text-center mb-4">
          Documents Required For Private Limited Company Registration in Delhi NCR
        </h2>
        <p className="text-center text-darkgray mb-12 max-w-3xl mx-auto">
          Ensure you have all the necessary documents ready for a smooth registration process
        </p>

        <div className="grid md:grid-cols-2 gap-8 px-4">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7h3l-4-4-4 4h3v12h2V7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#FCA229]">Identity Proof</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-darkgray group-hover:text-blue transition-colors duration-300">PAN Card of all Directors & Shareholders</p>
              </li>
              <li className="flex items-start group">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-darkgray group-hover:text-blue transition-colors duration-300">Aadhaar Card or Passport</p>
              </li>
              <li className="flex items-start group">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-darkgray group-hover:text-blue transition-colors duration-300">Passport size photo of Directors & Shareholders</p>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12  rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#FCA229]">Address Proof</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-darkgray group-hover:text-blue transition-colors duration-300">Registered office address proof (Electricity Bill, Rent Agreement)</p>
              </li>
              <li className="flex items-start group">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-darkgray group-hover:text-blue transition-colors duration-300">Latest bank statement</p>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#FCA229]">Business Registration Documents</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-darkgray group-hover:text-blue transition-colors duration-300">Memorandum of Association (MOA) & Articles of Association (AOA)</p>
              </li>
              <li className="flex items-start group">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-darkgray group-hover:text-blue transition-colors duration-300">Proof of Capital Contribution</p>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#FCA229]">Regulatory and Compliance Documents</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-darkgray group-hover:text-blue transition-colors duration-300">Digital Signature Certificates (DSC) for all Directors</p>
              </li>
              <li className="flex items-start group">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-darkgray group-hover:text-blue transition-colors duration-300">Director Identification Number (DIN) for all Directors</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}