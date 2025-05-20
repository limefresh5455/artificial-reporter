'use client';

import { useEffect, useState } from 'react';
import { getWhitepaperBySlug } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/routes';


interface Category {
    _id: string;
    slug: { _type: string; current: string };
    title: string;
}

interface Vendor {
    _id: string;
    name: string | null;
}

interface Whitepaper {
    _id: string;
    categories: Category[];
    description: string;
    format: string;
    publishDate: string;
    slug: { _type: string; current: string };
    thumbnail: { asset: { _id: string; url: string } };
    title: string;
    vendor: Vendor;
}

export default function WhitepaperClientPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [whitepaper, setWhitepaper] = useState<Whitepaper | null>(null);
    const { user, setUser } = useAuth();
    const router = useRouter();


    useEffect(() => {
        async function fetchWhitepaper() {
            const { slug } = await params;
            const result = await getWhitepaperBySlug(slug);
            setWhitepaper(result);
            console.log(result);
        }
        fetchWhitepaper();
    }, [params]);

    if (!whitepaper) return <div>Loading...</div>;

    // Format date like "May 19, 2025"
    const formattedDate = new Date(whitepaper.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    function downloadWhitepaper() {
        if (user) {
            alert("downloaded")
        } else {
            router.replace(ROUTES.LOGIN);
        }
    }
    return (
        <section className="whitepaper_download py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="col-span-12">
                        <h2 className="text-3xl font-semibold mb-1">{whitepaper.title}</h2>
                    </div>

                    <div className="grid grid-cols-12 col-span-12 whitepaper_left gap-15">
                        <div className="whitepaper_img p-0 border-0 flex justify-center col-span-5">
                            <img
                                src="https://odeskthemes.com/10/news-portal/assets/img/Whitepaper_315X408.jpg"
                                alt="Whitepaper Thumbnail"
                                className="rounded-md shadow-md"
                                style={{ maxHeight: '408px', width: '315px' }}
                            />
                        </div>
                        <div className='col-span-7'>
                            <p className="text-gray-700 whitespace-pre-line">{whitepaper.description}</p>
                            <hr />
                            <div className="grid grid-cols-12 gap-2 text-sm text-gray-600 pt-6 ">
                                <div className='col-span-9'>
                                    <div className='grid grid-cols-12'>
                                        <span className="title col-span-4 font-bold mr-1">Vendor:</span>
                                        <span className="value col-span-6 ">{whitepaper.vendor.name ?? 'N/A'}</span>
                                    </div>
                                    <div className='grid grid-cols-12'>
                                        <span className="title col-span-4 font-bold mr-1">Posted:</span>
                                        <span className="value col-span-6 ">{formattedDate}</span>
                                    </div>
                                    <div className='grid grid-cols-12'>
                                        <span className="title col-span-4 font-bold mr-1">Published:</span>
                                        <span className="value col-span-6 ">{formattedDate}</span>
                                    </div>
                                    <div className='grid grid-cols-12'>
                                        <span className="title col-span-4 font-bold mr-1">Format:</span>
                                        <span className="value col-span-6 ">{whitepaper.format}</span>
                                    </div>
                                    <div className='grid grid-cols-12'>
                                        <span className="title col-span-4 font-bold mr-1">Category:</span>
                                        <span className="value col-span-6 ">
                                            {whitepaper.categories.map((cat) => cat.title).join(', ')}
                                        </span>
                                    </div>
                                </div>
                                <img
                                    src={whitepaper.thumbnail.asset.url}
                                    alt="Whitepaper Thumbnail"
                                    className="col-span-3  "

                                />
                            </div>
                            <div className="md:col-span-7 mt-10">
                                <button onClick={downloadWhitepaper} className=" inline-block bg-[#134c90] text-white px-4 py-2 rounded hover:bg-[#d21118]">
                                    Download Now
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </section>
    );
}
