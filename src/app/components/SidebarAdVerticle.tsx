'use client';

import { useEffect, useState } from 'react';
import { getActiveSidebarAdVerticle } from "@/lib/sanity";

const SidebarAdVerticle: React.FC = () => {

    const [sidebarAdVerticle, setSidebarAdVerticle] = useState<null | {
        title: string;
        link: string;
        alt: string;
        imageUrl: string;
        adType: string;
        googleAdScript: any;
        customEmbedCode: any;
    }>(null);

    useEffect(() => {
        const fetchAd = async () => {
            const ad = await getActiveSidebarAdVerticle();
            setSidebarAdVerticle(ad);
        };
        fetchAd();
    }, []);


    return (
        <div className="flex my-6">
            {sidebarAdVerticle?.adType == "image" ? (
                <a href={sidebarAdVerticle.link} target="_blank" rel="noopener noreferrer">
                    <img src={sidebarAdVerticle.imageUrl} alt={sidebarAdVerticle.alt} className="float-right" />
                </a>
            ) : null}


            {sidebarAdVerticle?.adType == "google" ? (
                <div dangerouslySetInnerHTML={{ __html: sidebarAdVerticle.googleAdScript }} />
            ) : null}
            {sidebarAdVerticle?.adType == "custom" ? (
                <div dangerouslySetInnerHTML={{ __html: sidebarAdVerticle.customEmbedCode }} />
            ) : null}
        </div>
    );
};

export default SidebarAdVerticle;
