"use client";

import React, { useEffect, useState } from 'react';
import { getTopStoriesData, getTotalTopStoriesCount } from '@/lib/sanity';

const PAGE_SIZE = 4;

const TopStories: React.FC = () => {
    const [stories, setStories] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const fetchData = async (page: number) => {
        setIsLoading(true);
        const [data, count] = await Promise.all([
            getTopStoriesData(page, PAGE_SIZE),
            getTotalTopStoriesCount()
        ]);
        setStories(data);
        console.log(data)
        setTotalCount(count);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    return (
        <section className="stories news_inner py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <h2 className="text-3xl font-semibold mb-3">Top Stories</h2>

                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {stories.map((story: any, index: number) => (
                                    <div key={index} className="relative">

                                        <img className="w-full h-64 object-cover" src="assets/img/img-2.png" alt="" />

                                        <div className="absolute inset-0 bg-white bg-opacity-90 p-4 flex flex-col justify-end">
                                            <div className="text-sm text-gray-600 mb-1">
                                                <a href="#" className="text-blue-600">{story.eventType || "Category"}</a>
                                                <span className="px-1">/</span>
                                                <span>{new Date(story._createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "2-digit",
                                                })}</span>

                                            </div>
                                            <a href="#" className="text-lg font-semibold hover:underline">{story.title}</a>
                                            <p className="text-sm mt-1">{story.overview}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dynamic Pagination */}
                        <div className="pt-6 border-t border-gray-200">
                            <ul className="flex flex-wrap gap-2 justify-center sm:justify-start text-sm">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <li key={pageNum}>
                                        <button
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        <div>
                            <p className="text-lg font-semibold mb-2">Advertisement</p>
                            <button>
                                <img className="w-full" src="assets/img/ad-4.png" alt="" />
                            </button>
                        </div>
                        <div>
                            <p className="text-lg font-semibold mb-2">Advertisement</p>
                            <button>
                                <img className="w-full" src="assets/img/news-500x280-4.png" alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopStories;
