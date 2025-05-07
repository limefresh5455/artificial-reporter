'use client';

import React, { useEffect, useState } from 'react';
import { getSponsors } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { ROUTES } from '@/app/routes';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import ContentRenderer from '../components/ContentRenderer';


const Sponsors = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sponsorPage = await getSponsors();
                setData(sponsorPage[0]);
                // console.log(sponsorPage);
            } catch (err) {
                console.error('Error fetching sponsors:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <p className="text-center">Loading...</p>;

    return (
        <section className="sponsors  py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-8">
                    <div className="lg:col-span-12 space-y-8">
                        <h2 className="text-3xl font-semibold mb-3">{data?.title}</h2>
                        <div style={{ paddingTop: "20px" }}>
                            <ContentRenderer content={data?.content} type="page" />
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.collectionItem.sponsors.map((sponsor: any, index: number) => (
                                <div className="sponsors_inner border border-gray-200 rounded-lg shadow p-4 flex flex-col justify-between h-full" key={sponsor._key || index}>
                                    <div>
                                        <div className="top flex items-center justify-between mb-4">
                                            <div className="sponsor_logo w-1/2">
                                                <img
                                                    src={urlFor(sponsor.logo)?.url() || '/placeholder.jpg'}
                                                    alt={sponsor.name || 'Sponsor'}
                                                    className="img-fluid w-full h-auto object-contain"
                                                />
                                            </div>
                                            <div className="cat text-right w-1/2">
                                                <p className="text-sm font-medium ">{sponsor.eventType || 'Category'}</p>
                                            </div>
                                        </div>
                                        <div className="middle">
                                            <a
                                                href={sponsor.url?.href}
                                                target={sponsor.url?.target || '_self'}
                                                rel="noopener noreferrer"
                                                className="h3 text-xl font-bold text-gray-800 hover:underline"
                                            >
                                                {sponsor.name}
                                            </a>
                                            <div className="text-sm text-gray-600 mt-2">
                                                <PortableText value={sponsor.description} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bottom mt-4">
                                        <a
                                            href={sponsor.url?.href}
                                            target={sponsor.url?.target || '_self'}
                                            rel="noopener noreferrer"
                                            className=" btn-primary inline-block bg-[#0062cc] text-[#fff] px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sponsors;
