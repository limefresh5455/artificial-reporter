"use client";

import React, { useState, useEffect } from "react";
import { signInWithEmail, userMetaInsert, userMetaSelect, updateUserPassword } from '@/lib/supabase/action';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from "@/app/routes";
import { BadgeCheck, Eye, EyeClosed } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { getSiteLogo } from "@/lib/sanity";
import { buildCroppedImageUrl } from "@/lib/sanityImage";

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

interface UserMeta {
    first_name: string;
    last_name: string;
    company_name: string;
    phone: string;
    job_title: string;
    seniority: string;
    job_function: string;
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
    const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'password', string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [userMeta, setUserMeta] = useState<UserMeta | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [siteLogo, setSiteLogo] = useState<any>([]);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchLogo = async () => {
            const response = await getSiteLogo();
            setSiteLogo(response);
            console.log(response)
        }
        fetchLogo()
    }, [])
    useEffect(() => {
        let mounted = true;

        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!mounted) return;

                if (!user) {
                    router.push(ROUTES.REGISTER);
                } else {
                    setAuthUser(user);
                    setCurrentStep(2);
                    setFormData(prev => ({
                        ...prev,
                        email: user.email || '',
                    }));

                    const userMetaResponse = await userMetaSelect(user.id);
                    if (userMetaResponse.data && mounted) {
                        setUserMeta(userMetaResponse.data);
                        setFormData(prev => ({
                            ...prev,
                            firstName: userMetaResponse.data.first_name || '',
                            lastName: userMetaResponse.data.last_name || '',
                            companyName: userMetaResponse.data.company_name || '',
                            phone: userMetaResponse.data.phone || '',
                            jobTitle: userMetaResponse.data.job_title || '',
                            seniority: userMetaResponse.data.seniority || '',
                            jobFunction: userMetaResponse.data.job_function || '',
                            industry: userMetaResponse.data.industry || '',
                            country: userMetaResponse.data.country || '',
                            state: userMetaResponse.data.state || '',
                        }));
                    }
                }
            } catch (error) {
                console.error('Error checking user:', error);
            }
        };

        checkUser();
        return () => {
            mounted = false;
        };
    }, [router, supabase]);

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
        return /\S+@\S+\.\S+/.test(email) && !/@(gmail|yahoo|aol|hotmail)\.com$/i.test(email);
    };

    const validateStep2 = (): boolean => {
        const newErrors: Partial<Record<keyof FormData | 'password', string>> = {};
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
                newErrors[field] = `${field === "companyName"
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

        if (!password || password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const email = formData.email;
        // if (!validateEmail(email)) {
        //     setErrors({ email: "Please enter a valid corporate email address" });
        //     setIsSubmitting(false);
        //     return;
        // }

        // try {
        //     const response = await signInWithEmail(email);
        //     if (response.error) {
        //         setErrors({ email: response.error.message });
        //     } else {

        //         setErrors({ email: "A confirmation email has been sent to your address. Please verify your email to continue." });
        //         if (response.data.session) {
        //             setAuthUser(response.data.user);
        //             setCurrentStep(2);
        //         } else if(response.data.user?.identities?[0].identity_data.email_verified){

        //             router.push(ROUTES.LOGIN);
        //         }
        //     }
        // } catch (error) {
        //     setErrors({ email: "An error occurred during email submission" });
        // } finally {
        //     setIsSubmitting(false);
        // }
        try {
            const response = await signInWithEmail(email);
            if (response.error) {
                setErrors({ email: response.error.message });
            } else if (
                response.data.user &&
                response.data.user.identities &&
                response.data.user.identities.length > 0 &&
                response.data.user.identities[0].identity_data &&
                response.data.user.identities[0].identity_data.email_verified
            ) {
                router.push(ROUTES.LOGIN);
            } else {
                setErrors({ email: "A confirmation email has been sent to your address. Please verify your email to continue." });
                if (response.data.session) {
                    setAuthUser(response.data.user);
                    setCurrentStep(2);
                }
            }
        } catch (error) {
            setErrors({ email: "An error occurred during email submission" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateStep2()) {
            return;
        }

        if (!authUser) {
            setErrors({ email: "User not authenticated" });
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const userMeta = [{
                user_id: authUser.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                company_name: formData.companyName,
                phone: formData.phone,
                job_title: formData.jobTitle,
                seniority: formData.seniority,
                job_function: formData.jobFunction,
                industry: formData.industry,
                country: formData.country,
                state: formData.state,
            }];

            const [metaResponse, passResponse] = await Promise.all([
                userMetaInsert(userMeta),
                updateUserPassword(password),
            ]);

            if (metaResponse.error) {
                setErrors({ email: metaResponse.error.message });
                return;
            }

            if (passResponse.error) {
                setErrors({ password: passResponse.error.message });
                return;
            }

            // Reset form
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
            setPassword('');
            setCurrentStep(1);
            router.push(ROUTES.HOME);
        } catch (error) {
            setErrors({ email: "An error occurred during submission" });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <button
                    id={key}
                    type="button"
                    onClick={() => toggleDropdown(key)}
                    className="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center bg-white text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'password') {
            setPassword(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <section className="register py-5 bg-gray-100 min-h-0 lg:min-h-screen flex items-center">
            <div className="container mx-auto px-4">
                <div className="row">
                    <div className="col-12">
                        <div className="register_inner max-w-2xl mx-auto">
                            <h2 className="section_heading text-center mb-6">Register</h2>

                            {currentStep === 1 && (
                                <form className="step" id="step1" onSubmit={handleSubmitEmail}>
                                    <h1 className="logo text-3xl font-bold text-center mb-4 flex justify-center">
                                        {siteLogo?.image?.crop && siteLogo?.imageUrl ? (
                                            <img
                                                src={buildCroppedImageUrl(siteLogo.imageUrl, siteLogo.image.crop)}
                                                alt={siteLogo.alt || 'Logo'}
                                                width="130px"
                                            />
                                        ) : siteLogo?.imageUrl ? (
                                            <img
                                                src={siteLogo.imageUrl}
                                                alt={siteLogo.alt || 'Logo'}
                                                width="130px"
                                            />
                                        ) : null}
                                    </h1>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Corporate Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-2 border border-gray-300 rounded-md"
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
                                        className="bg-[#134c90] text-white px-4 py-2 rounded-md hover:bg-[#d21118] disabled:bg-blue-300"
                                        disabled={isSubmitting}
                                    >
                                        Continue
                                    </button>
                                    <p className="mt-4 text-sm text-gray-600 mb-4">
                                        Stay up to date on all the news, insights and changes in the world of Artificial
                                        Intelligence with The Artificial Reporter daily newsletter.
                                    </p>
                                    <p className="text-sm text-gray-600">Sign up Today!</p>
                                </form>
                            )}

                            {currentStep === 2 && (
                                <form className="step" id="step2" onSubmit={handleSubmit}>
                                    <h1 className="logo text-3xl font-bold text-center mb-4">Logo</h1>
                                    <h5 className="text-lg font-semibold text-center mb-4">
                                        Registration and Daily Newsletter Signup
                                    </h5>
                                    <div className="mb-4 relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Corporate Email</label>
                                        <input
                                            type="email"
                                            id="emailDisplay"
                                            value={formData.email}
                                            disabled
                                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                        />
                                        <span className="absolute top-1/2 right-4"><BadgeCheck size={20} color="green" /></span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Create a new password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                            >
                                                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="First Name"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Last Name"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="companyName"
                                                placeholder="Company Name"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                                        <div>{renderDropdown("jobTitle")}</div>
                                        <div>{renderDropdown("seniority")}</div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                                        <div>{renderDropdown("jobFunction")}</div>
                                        <div>{renderDropdown("industry")}</div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
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
                                        className="bg-[#134c90] text-white px-4 py-2 rounded-md hover:bg-[#d21118] disabled:bg-blue-300"
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