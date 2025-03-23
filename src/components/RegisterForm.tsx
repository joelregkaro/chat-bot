import React, { useRef, useState } from "react";

const RegisterForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <div className="bg-[#1C3854] flex items-center justify-center h-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Register karo
          </h2>
          <p className="text-gray-500 text-sm">
            Fill out the form below to contact us
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="w-1/3">
              <input
                type="text"
                name="phoneCode"
                placeholder="+91"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.phoneCode ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.phoneCode}
                onChange={handleChange}
              />
            </div>
            <div className="w-2/3">
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone number"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          {(errors.phoneCode || errors.phoneNumber) && (
            <p className="text-red-500 text-xs mt-1">
              {errors.phoneCode || errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Private Limited Package
          </label>
          <select
            name="packageType"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.packageType ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.packageType}
            onChange={handleChange}
          >
            <option>-Select-</option>
            <option>Basic</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
          {errors.packageType && (
            <p className="text-red-500 text-xs mt-1">{errors.packageType}</p>
          )}
        </div>

        {/* Submit */}
        <div className="text-center pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-[#1B3654] font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Hidden Zoho Form for Submission */}
      <form
        ref={formRef}
        action="https://forms.zohopublic.in/safeledgerprivatelimited/form/AppRegisterkaroform/formperma/6ZTJYlT6mh-HoEPr1m1VG5kE88RKhOE6a5d8ihs3f2s/htmlRecords/submit"
        method="POST"
        acceptCharset="UTF-8"
        encType="multipart/form-data"
        className="hidden"
      >
        <input type="hidden" name="SingleLine" value={formData.name} />
        <input type="hidden" name="Email" value={formData.email} />
        <input
          type="hidden"
          name="PhoneNumber_countrycodeval"
          value={formData.phoneCode}
        />
        <input
          type="hidden"
          name="PhoneNumber_countrycode"
          value={formData.phoneNumber}
        />
        <input type="hidden" name="Dropdown" value={formData.packageType} />
        <input type="hidden" name="zf_referrer_name" value="" />
        <input type="hidden" name="zf_redirect_url" value="" />
        <input type="hidden" name="zc_gad" value="" />
      </form>
    </div>
  );
};

export default RegisterForm;
