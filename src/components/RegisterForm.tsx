import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserPlus, Mail, Phone, Package, X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

interface RegisterFormProps {
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneCode: "",
    phoneNumber: "",
    packageType: "-Select-",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneCode: "",
    phoneNumber: "",
    packageType: "",
  });

  const emailRegex =
    /^[\w]([\w\-.+&'/]*)@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,22}$/;
  const phoneCodeRegex = /^[+][0-9]{1,4}$/;
  const phoneNumberRegex = /^[+]{0,1}[()0-9-. ]+$/;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const validate = () => {
    const newErrors = {
      name: formData.name.trim() ? "" : "Please enter your name",
      email: emailRegex.test(formData.email.trim())
        ? ""
        : "Enter a valid email address",
      phoneCode: formData.phoneCode.trim()
        ? phoneCodeRegex.test(formData.phoneCode.trim())
          ? ""
          : "Invalid country code (e.g., +91)"
        : "Country code is required",
      phoneNumber: formData.phoneNumber.trim()
        ? phoneNumberRegex.test(formData.phoneNumber.trim())
          ? ""
          : "Invalid phone number"
        : "Phone number is required",
      packageType:
        formData.packageType !== "-Select-" ? "" : "Please select a package",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("SingleLine", formData.name);
        formDataToSubmit.append("Email", formData.email);
        formDataToSubmit.append(
          "PhoneNumber_countrycodeval",
          formData.phoneCode
        );
        formDataToSubmit.append(
          "PhoneNumber_countrycode",
          formData.phoneNumber
        );
        formDataToSubmit.append("Dropdown", formData.packageType);
        formDataToSubmit.append("zf_referrer_name", "");
        formDataToSubmit.append("zf_redirect_url", "");
        formDataToSubmit.append("zc_gad", "");

        await fetch(
          "https://forms.zohopublic.in/safeledgerprivatelimited/form/AppRegisterkaroform/formperma/6ZTJYlT6mh-HoEPr1m1VG5kE88RKhOE6a5d8ihs3f2s/htmlRecords/submit",
          {
            method: "POST",
            body: formDataToSubmit,
            mode: "no-cors",
            headers: {
              Accept: "application/json",
            },
          }
        );

        toast.success("Form submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        onClose();
        setFormData({
          name: "",
          email: "",
          phoneCode: "",
          phoneNumber: "",
          packageType: "-Select-",
        });
      } catch (error) {
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 space-y-5 border border-blue-100 relative"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue/5 rounded-full translate-y-16 -translate-x-16"></div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="relative z-10 space-y-5">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-[#2A5C92] mb-1">
              FREE Expert consultation
            </h2>
            <p className="text-orange text-sm">
              Submit your Details to get an Instant All-inclusive Quote to your
              email and a FREE Expert consultation
            </p>
          </div>

          {/* Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className={`w-full px-4 py-3 rounded-xl bg-white border ${
                errors.name ? "border-red-400" : "border-blue-200"
              } text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-2">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`w-full px-4 py-3 rounded-xl bg-white border ${
                errors.email ? "border-red-400" : "border-blue-200"
              } text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                name="phoneCode"
                placeholder="+91"
                className={`w-1/3 px-4 py-3 rounded-xl bg-white border ${
                  errors.phoneCode ? "border-red-400" : "border-blue-200"
                } text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200`}
                value={formData.phoneCode}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone number"
                className={`w-2/3 px-4 py-3 rounded-xl bg-white border ${
                  errors.phoneNumber ? "border-red-400" : "border-blue-200"
                } text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200`}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            {(errors.phoneCode || errors.phoneNumber) && (
              <p className="text-red-500 text-xs mt-2">
                {errors.phoneCode || errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Package Type */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              Private Limited Package
            </label>
            <select
              name="packageType"
              className={`w-full px-4 py-3 rounded-xl bg-white border ${
                errors.packageType ? "border-red-400" : "border-blue-200"
              } text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200 appearance-none`}
              value={formData.packageType}
              onChange={handleChange}
            >
              <option className="bg-white text-gray-900">-Select-</option>
              <option className="bg-white text-gray-900">Basic</option>
              <option className="bg-white text-gray-900">Standard</option>
              <option className="bg-white text-gray-900">Premium</option>
            </select>
            {errors.packageType && (
              <p className="text-red-500 text-xs mt-2">{errors.packageType}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-orange hover:bg-orange/90 text-white rounded-full px-8 py-5 text-base font-medium shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 min-w-[200px] hover:shadow-lg ${
                isSubmitting
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:from-blue-700 hover:to-blue-900 active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
