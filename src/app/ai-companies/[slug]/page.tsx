"use client";

import React, { useEffect, useState } from 'react';
import { getCompanyData } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { Linkedin, Building2 } from 'lucide-react';
import BackButton from '@/app/components/BackButton';


const AICompany = ({
    params
}: {
    params: Promise<{ slug: string }>;
}) => {
    const [companyData, setCompanyData] = useState<any>([]);
    const fetchData = async () => {
        const { slug } = await params;
        const [data] = await getCompanyData(slug);
        setCompanyData(data);
        console.log(data);
    };
    useEffect(() => {


        fetchData();
    }, []);




    return (
        <section className="py-2 lg:py-12 job-details">
            <div className="container mx-auto px-0 lg:px-4">
                <span><BackButton /></span>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    <div className="xl:col-span-8">
                        <div className="details-post-data">
                            
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">{companyData.name}</h2>

                            <ul className="flex flex-wrap  items-center gap-4 mb-6">
                                <li>
                                    <a target='_blank' href={companyData.linkedin} className="flex items-center px-4 rounded py-2 space-x-2 bg-[#31795a1f] text-black hover:bg-[#244034] hover:text-[#fff]">
                                        <Linkedin size={15} />
                                        <span>Linkedin</span>
                                    </a>
                                </li>
                            </ul>

                            <div className="border p-6 rounded-3xl   bg-white">
                                <div className="flex items-center mb-4">
                                    <h4 className="text-xl font-bold text-gray-700">Overview</h4>
                                </div>
                                <p className="text-gray-600">
                                    {companyData.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-4" >
                        <div className="job-company-info bg-[#eff6f3] p-6 rounded-lg ">
                            <div className="flex justify-center mb-4">
                                {companyData?.logo ?
                                    (<img
                                        src={companyData?.logo && urlFor(companyData?.logo.asset).url()}
                                        alt="Company Logo"
                                        className="w-12 h-12 rounded-md object-contain"
                                    />) :
                                    <Building2 size={66} />
                                }
                            </div>

                            <div className="text-center font-semibold text-lg mb-4">{companyData.name}</div>
                            <div className="text-center font-semibold text-lg mb-4">
                                <a href={companyData.website} target='_blank' className="inline-block text-center text-white bg-[#005025] hover:bg-[#00bf58] px-4 py-2 rounded-3xl mb-6">Visit Website</a>
                            </div>

                            <ul className="space-y-4">
                                <li>
                                    <span className="block text-gray-500 text-sm">Company Type</span>
                                    <div className="text-gray-800 font-semibold">{companyData?.category?.title}</div>
                                </li>
                                <li>
                                    <span className="block text-gray-500 text-sm">Location</span>
                                    <div className="text-gray-800 font-semibold">
                                        {companyData.locationCity}, {companyData.locationState},<br />
                                        {companyData.locationCountry}

                                    </div>
                                </li>
                                <li>
                                    <span className="block text-gray-500 text-sm">AI Company</span>
                                    <div className="text-gray-800 font-semibold" >{companyData.isAICompany ? "Yes" : "No"}</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section >

    );
};

export default AICompany;