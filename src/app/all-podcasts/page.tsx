"use client";

import React, { useEffect, useState } from 'react';
import { getPodcast, getPodcastCount } from '@/lib/sanity';
import { ChevronDown, LayoutGrid, LayoutList, ExternalLink, Download, CirclePlay, CirclePause, ChevronRight, ChevronLeft } from 'lucide-react';
import { PortableText, toPlainText } from '@portabletext/react';
import PodcastCard from "@/app/components/PodcastCard";

const AllPodcasts = () => {
    const [podcasts, setPodcasts] = useState<any>([]);
    const [totalCount, setTotalCount] = useState<any>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedPlatform, setselectedPlatform] = useState<string>('');


    const PAGE_SIZE = 8;

    const fetchData = async () => {
        const [data, count] = await Promise.all([
            getPodcast(selectedPlatform),
            getPodcastCount(selectedPlatform),
        ]);
        setPodcasts(data);
        setTotalCount(count);
        console.log(data);
    };
    useEffect(() => {


        fetchData();
    }, [selectedPlatform]);

    const selectOptionSort = async (Platform: string) => {
        setselectedPlatform(Platform); // Assuming you have a state to store podcast data
        setIsOpen(false);
    };


    const toggleDropdownSort = () => {
        setIsOpen((prev) => !prev);
    };
    const getPaginationRange = (totalPages: number, currentPage: number, delta = 2) => {
        const range: (number | string)[] = [];
        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        range.push(1); // Always show first page

        if (left > 2) range.push('...');

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < totalPages - 1) range.push('...');

        if (totalPages > 1) range.push(totalPages); // Always show last page

        return range;
    };

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const paginationRange = getPaginationRange(totalPages, currentPage);

    return (
        <>
            <section className="job-search-result py-10">
                <div className="container mx-auto px-4 text-center">
                    <div className="grid grid-cols-1">
                        <div>
                            <h2 className="section-heading text-3xl font-semibold text-gray-800">Podcasts</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="job-listing ai_directory py-10">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-gray-600">
                            <span className="text-gray-800 font-semibold">{totalCount > 0 ? "All " + totalCount : 0}</span> jobs found
                        </div>
                        <div className="flex items-center gap-4">

                            <div className="relative">

                                <button className="p-2 border border-gray-300 rounded-md flex items-center gap-2" onClick={toggleDropdownSort}>
                                    <span>Sort By</span>
                                    <ChevronDown className="w-5 h-5" />
                                </button>
                                <ul className={`absolute w-40 z-2 bg-white border border-gray-300 rounded-md mt-1 ${isOpen ? 'block' : 'hidden'
                                    }`}>
                                    {['All', 'Spotify', 'Apple', 'Google'].map((option) => (
                                        <li key={option} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectOptionSort(option)}>
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* <button
                                className={`p-2 border rounded-md ${viewMode === 'list' ? 'bg-gray-100 border-gray-300' : 'border-gray-300'}`}
                                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                            >
                                {viewMode === 'list' ? (
                                    <LayoutList strokeWidth={1.5} className="w-5 h-5" />
                                ) : (
                                    <LayoutGrid strokeWidth={1.5} className="w-5 h-5" />
                                )}
                            </button> */}

                        </div>
                    </div>

                    <div className="podcast-grid grid grid-cols-1  gap-6">
                        {podcasts.map((podcast: any) => (
                            <PodcastCard podcast={podcast} key={podcast._id} />
                        ))}

                    </div>
                </div>


                {/* <div id="modal1" className="podcast-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                        <button className="absolute top-2 right-2 text-xl font-bold text-gray-600">&times;</button>
                        <h3 className="text-xl font-semibold mb-3">Model Context Protocol Deep Dive</h3>
                        <p className="text-sm text-gray-700">
                            Making artificial intelligence practical, productive & accessible to everyone. Practical AI is a show in which technology professionals, business people, students, enthusiasts, and expert guests engage in lively discussions about Artificial Intelligence and related topics.
                        </p>
                    </div>
                </div> */}
            </section>

            {/* Dynamic Pagination */}
            <div className="pt-6 border-t border-gray-200">
                <ul className="flex flex-wrap gap-2 justify-center sm:justify-start text-sm">
                    <li>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </li>

                    {paginationRange.map((page, index) =>
                        page === '...' ? (
                            <li key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</li>
                        ) : (
                            <li key={page}>
                                <button
                                    onClick={() => setCurrentPage(Number(page))}
                                    className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            </li>
                        )
                    )}

                    <li>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </li>
                </ul>
            </div>


        </>

    );
};

export default AllPodcasts;