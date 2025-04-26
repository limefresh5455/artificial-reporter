"use client";

import React, { useEffect, useState } from 'react';
import { getStoryData, getRelatedStories } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { slugify } from '@/lib/slugify';
import { ROUTES } from '@/app/routes';
import Link from 'next/link';

const Story = ({
    params
}: {
    params: Promise<{ slug: string,category: string }>;
}) => {
    const [story, setStory] = useState<any>(null);
    const [slug, setSlug] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [relatedStories, setRelatedStoriesData] = useState<any[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        const { slug, category } = await params;
        setCategory(category);
        setSlug(slug);

        try {
            const data = await getStoryData(slug);
            if (Array.isArray(data) && data.length > 0) {
                setStory(data[0]);
                console.log(data[0]);
                
                // NOW fetch related stories correctly
                const relatedData = await getRelatedStories(data[0].tags || [], data[0].title);
                setRelatedStoriesData(relatedData);
                console.log(relatedData)
            } else {
                setStory(null);
            }
        } catch (error) {
            console.error('Error fetching story:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!story) {
        return <p>No story found.</p>;
    }

    return (
        <section className="stories news_inner py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <h2 className="text-3xl font-semibold mb-3">{story.title}</h2>

                        <div className="relative">
                            <img
                                src={urlFor(story.image.asset).url()}
                                className="w-full object-cover"
                                alt={story.title}
                                style={{ aspectRatio: "3/2" }}
                            />
                        </div>

                        <div className="bg-white bg-opacity-90 p-4 flex flex-col justify-end">
                            <div className="text-sm text-gray-600 mb-1">
                                <a href="#" className="text-blue-600" >{story.eventType || "Category"}</a>
                                <span className="px-1">/</span>
                                <span>{new Date(story._createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                })}</span>
                            </div>

                            <p className="text-lg mt-2" style={{whiteSpace:"pre-line"}}>{story.overview}</p>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Ad 1 */}
                        <div>
                            <p className="text-lg font-semibold mb-2">Advertisement</p>
                            <button>
                                <img className="w-full" src="https://odeskthemes.com/10/news-portal/assets/img/news-500x280-4.png" alt="Ad" />
                            </button>
                        </div>

                        {/* Related Stories */}
                        <div className="pb-6">
                            <div className="bg-gray-100 py-2 px-4 mb-4">
                                <h3 className="text-xl font-semibold m-0">Related Stories</h3>
                            </div>

                            <div className="flex flex-col space-y-4">
                                {relatedStories.length > 0 ? (
                                    relatedStories.map((item: any) => (
                                        <div key={item._id} className="flex space-x-3 items-center">
                                            <img
                                                src={item.image ? urlFor(item.image.asset).url() : '/assets/img/placeholder.png'}
                                                alt={item.title}
                                                className="w-[70px] h-[70px] object-cover rounded"
                                            />
                                            <div className="flex-1 bg-gray-100 px-3 py-2 flex items-center h-[70px]">
                                                <Link href={`${ROUTES.NEWS}${category}/${encodeURI(item._id)}`} className="text-sm font-semibold hover:underline">
                                                    {item.title}
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No related stories found.</p>
                                )}
                            </div>
                        </div>

                        {/* Ad 2 */}
                        <div>
                            <p className="text-lg font-semibold mb-2">Advertisement</p>
                            <button>
                                <img className="w-full" src="https://odeskthemes.com/10/news-portal/assets/img/ad-4.png" alt="Ad" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Story;
