import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { UserPlus, Mail, Phone, Package } from "lucide-react";
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
    <div className="w-full h-full flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-blue-50/80 rounded-3xl shadow-2xl p-8 space-y-8 border border-blue-100"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-blue mb-1">Register karo</h2>
          <p className="text-[#FCA229] text-sm">
            Fill out the form below to contact us
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
            className={`w-full bg-blue-900 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
              isSubmitting
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-blue-700 active:scale-[0.98]"
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
      </form>
    </div>
  );
};

export default RegisterForm;
