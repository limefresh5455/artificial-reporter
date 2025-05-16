"use client";

import React, { useEffect, useState } from 'react';
import { getContributorUser } from '@/lib/sanity';
import PodcastCard from "@/app/components/PodcastCard";
import { urlFor } from '@/lib/sanityImage';
import { Link } from 'lucide-react';
import { ROUTES } from '@/app/routes';

const ContributorUser = ({
    params
}: {
    params: Promise<{ slug: string }>;
}) => {
    const [contributor, setContributor] = useState<any>([]);

    const fetchData = async () => {
        const { slug } = await params;
        console.log(slug)
        const data = await getContributorUser(slug);
        setContributor(data);
        console.log(data);
    };
    useEffect(() => {
        fetchData();
    }, []);



    return (
        <section className="single_article ">
            <div className="article_img mb-6">
                <img src="https://odeskthemes.com/10/news-portal/assets/img/img-7.jpg" className="w-full h-auto object-cover" />
            </div>

            <div className="container mx-auto px-4">
                <div className="single_article_inner">
                    <div className="grid grid-cols-1">
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-8">
                                <div className="content-wrap">
                                    <div className="content">

                                        <div className="contrib-box">
                                            <img alt="" src="https://odeskthemes.com/10/news-portal/assets/img/img-7.jpg" />
                                            <div>
                                                <h2 className="text-xl font-semibold">Jason Krantz</h2>
                                                <span className="text-gray-600 text-sm">Senior Editor, The Artificial Reporter</span>
                                            </div>
                                        </div>

                                        <hr className="my-4" />

                                        <p className="text-gray-700">
                                            Jason Krantz is neque porro quisquam est qui dolorem ipsum quia dolor sit amet...
                                        </p>

                                    </div>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <div className="post-sidebar">
                                    <div className="mb-6 pb-3">
                                        <a href="#"><img className="w-full h-auto object-cover" src="https://odeskthemes.com/10/news-portal/assets/img/img-7.jpg" alt="" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 mb-6">
                            <h3 className="text-xl font-semibold">Jason Krantz's Most Recent Content</h3>
                            <hr className="my-2" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">


                            {/* <div key={index} className="relative">
                                <img
                                    src={urlFor(story.image.asset).url()}
                                    className="w-full object-cover"
                                    alt="Story Image"
                                    style={{ aspectRatio: "3/2" }}
                                />
                                <div className="bg-white bg-opacity-90 p-4 flex flex-col justify-end">
                                    <div className="text-sm text-gray-600 mb-1">
                                        <Link href="#" className="text-blue-600">{story.eventType || "Category"}</Link>
                                        <span className="px-1">/</span>
                                        <span>{new Date(story.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "2-digit",
                                        })}</span>
                                    </div>
                                    <Link href={`${ROUTES.NEWS}${story?.newsCategory?.value.current}/${story.slug.current}`} className="text-lg font-semibold hover:underline">
                                        {story.title}
                                    </Link>
                                    <p className="text-sm mt-1">
                                        {story.overview?.slice(0, 100)}
                                        {story.overview?.length > 100 && '...'}
                                    </p>
                                </div>
                            </div> */}


                        </div>

                    </div>
                </div>
            </div>
        </section>

    );
};

export default ContributorUser;