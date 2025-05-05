"use client";

import React, { useEffect, useState } from 'react';
import { getPageData, PageData } from '@/lib/sanity'; // Import necessary types
import ContentRenderer from "@/app/components/ContentRenderer";

const Page = ({
    params
}: {
    params: Promise<{ slug: string }>;
}) => {
    const [pageData, setPageData] = useState<PageData | null>(null);

    useEffect(() => {

        const fetchData = async () => {
            const { slug } = await params;
            const data = await getPageData(slug);
            setPageData(data);
        };

        fetchData();
    }, []);

    if (!pageData) return <div>Loading...</div>;



    return (
        <>
            <div style={{ paddingTop: "20px" }}>
                <ContentRenderer content={pageData.content} type="page" />
            </div>

        </>
    );
};

export default Page;
