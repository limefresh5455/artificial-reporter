'use client';

import { useEffect, useState } from 'react';
import { getActiveHeaderAd } from "@/lib/sanity";

const HeaderAd: React.FC = () => {

    const [headerAd, setHeaderAd] = useState<null | {
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
            const ad = await getActiveHeaderAd();
            setHeaderAd(ad);
        };
        fetchAd();
    }, []);


    return (
        <div className="flex justify-end">
            {headerAd?.adType == "image" ? (
                <a href={headerAd.link} target="_blank" rel="noopener noreferrer">
                    <img src={headerAd.imageUrl} alt={headerAd.alt} className="float-right" />
                </a>
            ) : null}

            {headerAd?.adType == "google" ? (
                <div dangerouslySetInnerHTML={{ __html: headerAd.googleAdScript }} />
            ) : null}
            {headerAd?.adType == "custom" ? (
                <div dangerouslySetInnerHTML={{ __html: headerAd.customEmbedCode }} />
            ) : null}
        </div>
    );
};

export default HeaderAd;
