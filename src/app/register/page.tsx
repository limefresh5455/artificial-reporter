"use client";

import React, { useState, useEffect } from "react";

type DropdownKey = "jobTitle" | "seniority" | "jobFunction" | "industry" | "country" | "state";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  jobTitle: string;
  seniority: string;
  jobFunction: string;
  industry: string;
  country: string;
  state: string;
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    phone: "",
    jobTitle: "",
    seniority: "",
    jobFunction: "",
    industry: "",
    country: "",
    state: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState<Record<DropdownKey, boolean>>({
    jobTitle: false,
    seniority: false,
    jobFunction: false,
    industry: false,
    country: false,
    state: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDropdown = (key: DropdownKey) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getStateOptions = (country: string): string[] => {
    const stateMap: Record<string, string[]> = {
      "United States": ["California", "New York", "Texas", "Florida", "Washington", "Massachusetts"],
      Canada: ["Ontario", "Quebec", "British Columbia"],
      "United Kingdom": ["England", "Scotland", "Wales"],
      Australia: ["New South Wales", "Victoria", "Queensland"],
      India: ["Madhya Pradesh", "Maharashtra", "Karnataka", "Delhi", "Punjab", "Rajasthan"],
      Singapore: ["Singapore"],
    };
    return stateMap[country] || [];
  };

  const dropdownData: Record<DropdownKey, { label: string; options: string[]; dataValues?: string[] }> = {
    jobTitle: {
      label: "Job Title",
      options: ["CEO", "CTO", "Vice President", "Manager", "Engineer", "Analyst"],
      dataValues: ["ceo", "cto", "vp", "manager", "engineer", "analyst"],
    },
    seniority: {
      label: "Seniority",
      options: ["Intern", "Entry Level", "Mid-Level", "Senior", "Executive"],
      dataValues: ["intern", "entry", "mid", "senior", "exec"],
    },
    jobFunction: {
      label: "Job Function",
      options: ["Marketing", "Sales", "Engineering", "Product", "Human Resources", "Finance"],
      dataValues: ["marketing", "sales", "engineering", "product", "hr", "finance"],
    },
    industry: {
      label: "Industry",
      options: ["Technology", "Finance", "Healthcare", "Education", "Retail", "Energy"],
      dataValues: ["tech", "finance", "health", "edu", "retail", "energy"],
    },
    country: {
      label: "Location Country",
      options: ["United States", "Canada", "United Kingdom", "Australia", "India", "Singapore"],
      dataValues: ["us", "ca", "uk", "au", "in", "sg"],
    },
    state: {
      label: "Location State",
      options: getStateOptions(formData.country),
    },
  };

  const validateEmail = (email: string): boolean => {
    return !/@(gmail|yahoo|aol)\.com$/i.test(email) && /\S+@\S+\.\S+/.test(email);
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const requiredFields: (keyof FormData)[] = [
      "firstName",
      "lastName",
      "companyName",
      "phone",
      "jobTitle",
      "seniority",
      "jobFunction",
      "industry",
      "country",
      "state",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field === "companyName"
            ? "Company Name"
            : field === "phone"
            ? "Phone"
            : dropdownData[field as DropdownKey]?.label || field
        } is required`;
      }
    });

    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setErrors({ email: "Please enter a valid corporate email address" });
      return;
    }
    setErrors({});
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      console.log("Form submitted:", formData);
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        companyName: "",
        phone: "",
        jobTitle: "",
        seniority: "",
        jobFunction: "",
        industry: "",
        country: "",
        state: "",
      });
      setCurrentStep(1);
      alert("Registration successful!");
    } catch (error) {
      setErrors({ email: "An error occurred during submission" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdowns = document.querySelectorAll(".custom-dropdown");
      let shouldClose = true;

      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(target)) {
          shouldClose = false;
        }
      });

      if (shouldClose) {
        setDropdownOpen({
          jobTitle: false,
          seniority: false,
          jobFunction: false,
          industry: false,
          country: false,
          state: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderDropdown = (key: DropdownKey) => {
    const { label, options, dataValues } = dropdownData[key];
    const value = formData[key];

    return (
      <div className="custom-dropdown mb-3 relative">
        {/* <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label> */}
        <button
          id={key}
          type="button"
          onClick={() => toggleDropdown(key)}
          className="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center bg-white text-gray-500 hover:bg-gray-50  disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-expanded={dropdownOpen[key]}
          aria-haspopup="listbox"
          disabled={key === "state" && !formData.country}
        >
          <span className="truncate">{value || `${label}`}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {dropdownOpen[key] && options.length > 0 && (
          <ul
            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg"
            role="listbox"
          >
            {options.map((option, index) => (
              <li
                key={option}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    [key]: option,
                    ...(key === "country" ? { state: "" } : {}),
                  }));
                  toggleDropdown(key);
                }}
                className="p-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                role="option"
                aria-selected={value === option}
                data-value={dataValues ? dataValues[index] : option.toLowerCase()}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
        {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
      </div>
    );
  };

  return (
    <section className="register py-5 bg-gray-100 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="row">
          <div className="col-12">
            <div className="register_inner  max-w-2xl mx-auto">
              <h2 className="section_heading text-2xl font-bold text-center mb-6">Register</h2>

              {currentStep === 1 && (
                <form className="step" id="step1" onSubmit={handleGoToStep2}>
                  <h1 className="logo text-3xl font-bold text-center mb-4">Logo</h1>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md "
                      aria-describedby="email-error"
                    />
                    {errors.email && (
                      <p id="email-error" className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className=" bg-[#134c90] text-white px-4 py-2 rounded-md hover:bg-[#d21118] disabled:bg-blue-300"
                    disabled={isSubmitting}
                  >
                    Continue
                  </button>
                  <p className="mt-4 text-sm text-gray-600 ">
                    Stay up to date on all the news, insights and changes in the world of Artificial
                    Intelligence with The Artificial Reporter daily newsletter.
                  </p>
                  <p className="text-sm text-gray-600 ">Sign up Today!</p>
                </form>
              )}

              {currentStep === 2 && (
                <form className="step" id="step2" onSubmit={handleSubmit}>
                  <h1 className="logo text-3xl font-bold text-center mb-4">Logo</h1>
                  <h5 className="text-lg font-semibold text-center mb-4">
                    Registration and Daily Newsletter Signup
                  </h5>
                  <div className="mb-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Corporate Email</label>
                    <input
                      type="email"
                      id="emailDisplay"
                      value={formData.email}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-0">
                    <div>
                      {/* <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label> */}
                      <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md "
                        required
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      {/* <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label> */}
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md "
                        required
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-0">
                    <div>
                      {/* <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label> */}
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md "
                        required
                      />
                      {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                    </div>
                    <div>
                      {/* <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label> */}
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md "
                        required
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-0">
                    <div>{renderDropdown("jobTitle")}</div>
                    <div>{renderDropdown("seniority")}</div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-0">
                    <div>{renderDropdown("jobFunction")}</div>
                    <div>{renderDropdown("industry")}</div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-0">
                    <div>{renderDropdown("country")}</div>
                    <div>{renderDropdown("state")}</div>
                  </div>

                  <div className="checkboxes mb-4">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                        I agree to Terms of Use, Privacy Policy...
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="partners"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="partners" className="ml-2 text-sm text-gray-600">
                        I agree to allow partners to contact me...
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className=" bg-[#134c90] text-white px-4 py-2 rounded-md hover:bg-[#d21118] disabled:bg-blue-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}