"use client";

import React, { useEffect, useState } from 'react';
import { getPageData, PageData } from '@/lib/sanity'; // Import necessary types
import { urlFor } from '@/lib/sanityImage';
import ContentRenderer from "@/app/components/ContentRenderer";


const About: React.FC = () => {
    const [aboutData, setAboutData] = useState<PageData | null>(null);

    const tagClassMap: Record<string, string> = {
        h1: ' mb-4 section_heading',
        h2: ' mb-3 section_heading',
        h3: 'text-2xl font-medium mb-2',
        p: 'text-base text-gray-700 mb-2',
        span: 'text-gray-700',
        strong: 'font-bold',
        em: 'italic text-gray-600',
        // Add more as needed
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPageData("about-us");
            setAboutData(data);
            // console.log(data);
        };

        fetchData();
    }, []);

    if (!aboutData) return <div>Loading...</div>;



    return (
        <>
            <div style={{ paddingTop: "20px" }}>
                <ContentRenderer content={aboutData.content} type="page" />
            </div>

        </>
    );
};

export default About;
