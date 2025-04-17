import { Link } from "react-router-dom";
import { ChevronDown, Phone, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-white shadow-sm h-16">
      <div className="container mx-auto flex items-center justify-between h-full py-4">
        <div className="flex items-center">
          <div className="text-blue font-bold text-xl flex items-center">
            <span className="bg-white text-white p-1 mr-1">
              <div className="flex-shrink-0">
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="flex items-center gap-2"
                >
                  <img
                    src="/favicon.ico"
                    alt="Register Karo"
                    width={42}
                    height={42}
                  />
                  <div className="text-[#1B3654] text-2xl font-bold">
                    Register<span className="text-[#FF8A00]">Karo</span>
                  </div>
                </Link>
              </div>
            </span>
            {/* Register<span className="text-orange">Karo</span> */}
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            onClick={scrollToTop}
            className="text-[#1B3654] hover:text-[#FCA229] font-medium transition-colors"
          >
            Home
          </Link>
          <button
            onClick={(e) => scrollToSection("process", e)}
            className="text-[#1B3654] hover:text-[#FCA229] font-medium transition-colors"
          >
            Process
          </button>
          <button
            onClick={(e) => scrollToSection("benefits", e)}
            className="text-[#1B3654] hover:text-[#FCA229] font-medium transition-colors"
          >
            Benefits
          </button>
          <button
            onClick={(e) => scrollToSection("pricing", e)}
            className="text-[#1B3654] hover:text-[#FCA229] font-medium transition-colors"
          >
            Pricing
          </button>
          {/* <Link href="#" className="text-darkgray hover:text-blue font-medium transition-colors">
            About Us
          </Link> */}
        </nav>
        <div className="flex items-center gap-4">
          {/* <Button className="hidden md:flex bg-orange hover:bg-orange/90 rounded-full text-white items-center shadow-md transition-all duration-300 transform hover:scale-105">
            <Phone className="h-4 w-4 mr-2" /> +918447748183
          </Button> */}
          <button
            className="md:hidden text-[#1B3654] hover:text-[#FCA229] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        } bg-white border-t`}
      >
        <div className="container mx-auto py-4 space-y-4">
          <Link
            to="/"
            className="block text-[#1B3654] hover:text-[#FCA229] font-medium transition-colors py-2"
          >
            Home
          </Link>
          <button
            onClick={(e) => scrollToSection("process", e)}
            className="block text-[#1B3654] hover:text-[#FCA229] font-medium transition-colors py-2 w-full text-left"
          >
            Process
          </button>
          <button
            onClick={(e) => scrollToSection("benefits", e)}
            className="block text-[#1B3654] hover:text-[#FCA229] font-medium transition-colors py-2 w-full text-left"
          >
            Benefits
          </button>
          <button
            onClick={(e) => scrollToSection("pricing", e)}
            className="block text-[#1B3654] hover:text-[#FCA229] font-medium transition-colors py-2 w-full text-left"
          >
            Pricing
          </button>
          <Button className="w-full bg-orange hover:bg-orange/90 rounded-full text-white flex items-center justify-center shadow-md transition-all duration-300 transform hover:scale-105">
            <Phone className="h-4 w-4 mr-2" /> +918447748183
          </Button>
        </div>
      </div>
    </header>
  );
}
