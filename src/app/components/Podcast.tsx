"use client";

import Link from "next/link";
import { getPodcastData } from '@/lib/sanity';
import { useEffect, useState } from "react";
import { PortableText } from '@portabletext/react';
import { ROUTES } from "../routes";



const Podcast: React.FC = () => {
    const [podcast, setPodcast] = useState<any>([]);
    const fetchData = async () => {

        const data = await getPodcastData();
        setPodcast(data);
        console.log(data);
    };
    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className="bg-[#344252] p-6 mt-5">
            <h2 className="text-xl font-bold mt-5 text-white">{podcast?.title}</h2>
            <div className="lg:grid lg:grid-cols-12 gap-6 mt-8">
                <div className="lg:col-span-4">
                    <img src={podcast?.image?.asset.url} alt="Podcast" className="w-[100%] h-[215] object-cover" />
                </div>
                <div className="lg:col-span-8">
                    <div className="text-white">
                        <PortableText value={podcast?.body} />
                    </div>
                    <div className="mt-3">
                        <Link href={ROUTES.ALLPODCASTS} className="btn btn-secondry">View All Episodes</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Podcast;
