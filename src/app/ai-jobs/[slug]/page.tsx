"use client";

import React, { useEffect, useState } from 'react';
import { getJobData } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { Facebook, Building2, Twitter, Link } from 'lucide-react';
import BackButton from '@/app/components/BackButton';


const AICompany = ({
    params
}: {
    params: Promise<{ slug: string }>;
}) => {
    const [jobData, setJobData] = useState<any>([]);
    const fetchData = async () => {
        const { slug } = await params;
        const data = await getJobData(slug);
        setJobData(data);
        console.log(data);
    };
    useEffect(() => {


        fetchData();
    }, []);




    return (
        <section className="py-12 ">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8">
                        <div className="mb-4 text-sm text-gray-500">
                            {new Date(jobData.datePosted).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                            })} by <a href="#" className="font-medium text-gray-800 hover:underline">{jobData?.company?.name}</a>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{jobData?.jobTitle}</h2>

                        <ul className="flex flex-wrap gap-4 mb-6">
                            <li>
                                <a href="#" className="flex items-center px-4 rounded py-1 space-x-2 bg-[#31795a1f] text-black hover:bg-[#244034] hover:text-[#fff] gap-2">
                                    <Facebook size={14} /> Facebook
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center px-4 rounded py-1 space-x-2 bg-[#31795a1f] text-black hover:bg-[#244034] hover:text-[#fff] gap-2">
                                    <Twitter size={14} /> Twitter
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center px-4 rounded py-1 space-x-2 bg-[#31795a1f] text-black hover:bg-[#244034] hover:text-[#fff] gap-2">
                                    <Link size={14} /> Copy
                                </a>
                            </li>
                        </ul>

                        <div className="space-y-8">
                            {/* <div className="border border-gray-200 p-6 rounded-lg bg-white">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 flex items-center justify-center bg-[#31795a] text-white rounded-full font-semibold mr-4">1</div>
                                    <h4 className="text-lg font-semibold text-gray-800">Overview</h4>
                                </div>
                                <p className="text-gray-700">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                                </p>
                            </div> */}

                            <div className="border border-gray-200 p-6 rounded-lg bg-white">
                                <div className="flex items-center mb-4">
                                    {/* <div className="w-8 h-8 flex items-center justify-center bg-[#31795a] text-white rounded-full font-semibold mr-4">1</div> */}
                                    <h4 className="text-lg font-semibold text-gray-800">Job Description</h4>
                                </div>
                                <p className="text-gray-700">
                                    {jobData.jobDescription}
                                </p>
                            </div>

                            {/* <div className="border border-gray-200 p-6 rounded-lg bg-white">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 flex items-center justify-center bg-[#31795a] text-white rounded-full font-semibold mr-4">3</div>
                                    <h4 className="text-lg font-semibold text-gray-800">Responsibilities</h4>
                                </div>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Develop and maintain infrastructure as code (IaC)...</li>
                                    <li>Collaborate with the development team to streamline and optimize the CI/CD pipeline...</li>
                                </ul>
                            </div>

                            <div className="border border-gray-200 p-6 rounded-lg bg-white">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 flex items-center justify-center bg-[#31795a] text-white rounded-full font-semibold mr-4">4</div>
                                    <h4 className="text-lg font-semibold text-gray-800">Requirements</h4>
                                </div>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Degree(s): B.Tech/BE (CS, IT, EC, EI) or MCA.</li>
                                    <li>Eligibility: Open to 2021, 2022, and 2023 graduates and postgraduates only.</li>
                                </ul>
                            </div>

                            <div className="border border-gray-200 p-6 rounded-lg bg-white">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 flex items-center justify-center bg-[#31795a] text-white rounded-full font-semibold mr-4">5</div>
                                    <h4 className="text-lg font-semibold text-gray-800">Benefits</h4>
                                </div>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>We are a remote-first company.</li>
                                    <li>100% company-paid health insurance premiums for you & your dependents.</li>
                                </ul>
                            </div> */}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="border  border-gray-200 p-6 rounded-lg bg-[#eff6f3]">
                            <div className='text-center w-full flex justify-center mb-4'>
                                {jobData?.company?.logo?.asset?.url ? (
                                    <img
                                        src={jobData?.company.logo.asset.url}
                                        alt={`${jobData?.company?.name || 'Company'} Logo`}
                                        className="w-30 h-30 mb-4  rounded-md object-contain"
                                    />
                                ) : (
                                    <Building2 size={48} className="text-gray-400" />
                                )}
                            </div>


                            <div className="text-xl text-center font-semibold text-gray-800 mb-4">{jobData?.company?.name}</div>
                            <div className="text-center font-semibold text-lg mb-4">
                                <a href={jobData?.company?.website} target='_blank' className="inline-block text-center text-white bg-[#005025] hover:bg-[#00bf58] px-4 py-2 rounded-3xl mb-6">Visit Website</a>
                            </div>

                            <ul className="space-y-4 text-sm text-gray-700 mb-4">
                                <li><strong>Salary:</strong> {jobData.payAmount}/ {jobData.hourlyOrSalary}</li>
                                <li><strong>Location:</strong> {jobData.location}</li>
                                <li><strong>Job Type:</strong> {jobData.jobType}</li>
                                <li><strong>Experience:</strong> {jobData.experienceLevel}</li>
                                <li><strong>Education:</strong> {jobData.education}</li>
                                {/* <li><strong>Schedule:</strong> Day shift</li> */}
                            </ul>

                            {/* <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">Data Analyst</span>
                                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">DevOps Engineer</span>
                            </div> */}

                            <a href="#" className="inline-flex items-center px-4 py-2 bg-[#31795a] text-white rounded hover:bg-green-700">
                                Apply
                                <i className="bi bi-box-arrow-up-right ml-2"></i>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>


    );
};

export default AICompany;