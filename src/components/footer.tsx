import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0F1729] text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Sections Grid */}

        {/* See All Services Button */}

        {/* Social Media Links */}
        <div className="flex gap-6 mb-8">
          <Link
            to="https://www.facebook.com/RegisterKaro1/"
            className="text-[#FF8C1E] hover:text-white transition-colors"
          >
            <Facebook size={24} />
          </Link>
          <Link
            to="https://www.instagram.com/registerkaro_/"
            className="text-[#FF8C1E] hover:text-white transition-colors"
          >
            <Instagram size={24} />
          </Link>
          <Link
            to="https://x.com/registerkaro"
            className="text-[#FF8C1E] hover:text-white transition-colors"
          >
            <Twitter size={24} />
          </Link>
          <Link
            to="https://in.linkedin.com/company/registerkaro"
            className="text-[#FF8C1E] hover:text-white transition-colors"
          >
            <Linkedin size={24} />
          </Link>
          <Link
            to="https://www.youtube.com/@_RegisterKaro"
            className="text-[#FF8C1E] hover:text-white transition-colors"
          >
            <Youtube size={24} />
          </Link>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 mb-12">
          <div>
            <h4 className="text-[#FF8C1E] font-semibold mb-2">
              Elevate Your Business with RegisterKaro
            </h4>
            <p className="text-gray-300 leading-relaxed">
              As a leading technology-driven legal services and advisory firm,
              we empower SMEs and entrepreneurs on their business journey. Our
              expert team covers business registration, legal compliance, tax
              filing, IPR registration, and more. With over 200 professionals,
              we&apos;ve served 50,000+ satisfied customers, ensuring startup
              compliance with our country&apos;s legal and regulatory systems.
            </p>
          </div>

          <div>
            <h4 className="text-[#FF8C1E] font-semibold mb-2">
              Navigating Regulatory Affairs
            </h4>
            <p className="text-gray-300 leading-relaxed">
              In India, regulatory bodies like BIS, CDSCO, RBI, SEBI, and IRDAI
              hold the keys to licenses and registrations for banks, financial
              institutions, and insurance businesses. We simplify this process
              by connecting you with our legal professionals. We understand your
              needs, handle license or registration applications, liaise with
              authorities, and deliver the licenses you require.
            </p>
          </div>

          <div>
            <h4 className="text-[#FF8C1E] font-semibold mb-2">
              Environmental Solutions
            </h4>
            <p className="text-gray-300 leading-relaxed">
              RegisterKaro offers a comprehensive range of services to address
              environmental challenges in business. Our seasoned environmental
              experts, with over a decade of experience, provide comprehensive
              solutions for environmental compliance and advisory, including
              battery waste management, plastic waste management, and e-waste
              management.
            </p>
          </div>

          <div>
            <h4 className="text-[#FF8C1E] font-semibold mb-2">
              Business Registration Expertise
            </h4>
            <p className="text-gray-300 leading-relaxed">
              We are renowned for facilitating business registration, whether
              it&apos;s as a private limited company, one-person company,
              Section 8 company, LLP, public company, or Nidhi company. Our
              consultancy services extend from business setup from scratch to
              ongoing compliance.
            </p>
          </div>

          <div>
            <h4 className="text-[#FF8C1E] font-semibold mb-2">
              Safeguarding Intellectual Property
            </h4>
            <p className="text-gray-300 leading-relaxed">
              Intellectual property protection is vital for modern businesses.
              Our team excels in IP registration services such as trademark
              registration, handling objections, managing assignments, copyright
              registration, and patent registration.
            </p>
          </div>

          <div>
            <h4 className="text-[#FF8C1E] font-semibold mb-2">
              Simplifying Taxation
            </h4>
            <p className="text-gray-300 leading-relaxed">
              RegisterKaro is your all-in-one solution for tax-related needs.
              Our dedicated professionals assist with GST registration,
              professional tax registration, GST return filing, TDS return
              filing, income tax return filing, and secretarial audits. Your tax
              matters are in capable hands with RegisterKaro.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p className="mb-4">
            By continuing this page, you agree to our{" "}
            <Link to="#" className="text-[#FF8C1E] hover:underline">
              Terms & Conditions
            </Link>
            ,{" "}
            <Link to="#" className="text-[#FF8C1E] hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-[#FF8C1E] hover:underline">
              Refund Policy
            </Link>
            .
          </p>
          <p className="mb-4">
            © 2024 - Safe Ledger Private Limited. All rights reserved.
          </p>
          <p className="text-xs leading-relaxed">
            Please note that we are a facilitating platform enabling access to
            reliable professionals. We are not a law firm and do not provide
            legal services ourselves. The information on this website is for the
            purpose of knowledge only and should not be relied upon as legal
            advice or opinion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
