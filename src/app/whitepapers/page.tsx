"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { getPageData, getWhitepaperCategories, getAllWhitepapers } from "@/lib/sanity";
import ContentRenderer from "../components/ContentRenderer";
import { urlFor } from "@/lib/sanityImage";
import { ROUTES } from "../routes";
import Link from "next/link";

const PAGE_SIZE = 8;

const Whitepapers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageData, setPageData] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [whitepapers, setWhitepapers] = useState<any[]>([]);
    const [filteredWhitepapers, setFilteredWhitepapers] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            const [page, cats] = await Promise.all([
                getPageData("whitepapers"),
                getWhitepaperCategories(),
            ]);
            setPageData(page);
            setCategories(cats);

            const initialPapers = await getAllWhitepapers(null);
            setWhitepapers(initialPapers);
            setFilteredWhitepapers(initialPapers);
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchFiltered() {
            const papers = await getAllWhitepapers(selectedCategory);
            setFilteredWhitepapers(papers);
            setWhitepapers(papers); // optional: update full list
            setCurrentPage(1);
        }

        fetchFiltered();
    }, [selectedCategory]);


    const totalCount = filteredWhitepapers.length;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const paginatedPapers = filteredWhitepapers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const getPaginationRange = (totalPages: number, currentPage: number, delta = 2) => {
        const range: (number | string)[] = [];
        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        range.push(1);
        if (left > 2) range.push("...");
        for (let i = left; i <= right; i++) range.push(i);
        if (right < totalPages - 1) range.push("...");
        if (totalPages > 1) range.push(totalPages);

        return range;
    };

    const paginationRange = getPaginationRange(totalPages, currentPage);

    console.log(selectedCategory)
    return (
        <section className="whitepaper py-0 lg:py-10">
            <div className="container mx-auto px-0 lg:px-4">
                <div className="grid grid-cols-1 gap-6 p-4 lg:p-8">
                    {pageData && (
                        <>
                            <h2 className="text-3xl font-semibold mb-1">{pageData.title}</h2>
                            <div className="mb-1  border-b border-gray-300">
                                <ContentRenderer content={pageData.content} type="page" />
                            </div>
                        </>
                    )}

                    {/* Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {categories?.length > 0 && (
                            <>
                                <li key={1 * .2}>
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`hover:underline hover:text-[#af0e14] text-[#134c90]`}
                                    >
                                        All
                                    </button>
                                </li>
                                {categories
                                    .slice(0, Math.ceil(categories.length / 2))
                                    .map((cat) => (
                                        <li key={cat._id}>
                                            <button
                                                onClick={() => setSelectedCategory(cat._id)}
                                                className={`hover:underline hover:text-[#af0e14] text-[#134c90] ${selectedCategory === cat._id ? " font-bold" : ""}`}
                                            >
                                                {cat.title}
                                            </button>
                                        </li>
                                    ))}
                                {categories
                                    .slice(Math.ceil(categories.length / 2))
                                    .map((cat) => (
                                        <li key={cat._id}>
                                            <button
                                                onClick={() => setSelectedCategory(cat._id)}
                                                className={`hover:underline hover:text-[#af0e14] text-[#134c90] ${selectedCategory === cat._id ? " font-bold" : ""}`}
                                            >
                                                {cat.title}
                                            </button>
                                        </li>
                                    ))}
                            </>
                        )}
                    </div>

                    {/* Whitepaper List */}

                    {paginatedPapers.length == 0 ? "No data found" :

                        paginatedPapers.map((item, i) => (
                            <div className="whitepaper_box mt-0 flex flex-col md:flex-row items-center md:items-start  gap-6" key={item._id}>
                                <div className="cont flex-1">
                                    <Link className="h4 text-lg font-semibold flex items-center gap-2" href={ROUTES.WHITEPAPERS +item.slug?.current}>
                                        <FileText />
                                        {item.title}
                                    </Link>
                                    <p className="m-0 text-gray-700 mt-2">
                                        {item?.description?.slice(0, 200)}...
                                    </p>
                                    <Link href={ROUTES.WHITEPAPERS + item.slug?.current} className="mt-3 inline-block bg-[#134c90] text-white px-4 py-2 rounded hover:bg-[#d21118]">
                                        More Information
                                    </Link>
                                </div>
                                <div className="img w-full md:w-1/3">
                                    <Link href={ROUTES.WHITEPAPERS +item.slug?.current}>
                                        <img
                                            src={urlFor(item.thumbnail).url()}
                                            alt={`Whitepaper ${i + 1}`}
                                            className="img-fluid max-w-full h-auto"
                                        />
                                    </Link>
                                </div>
                            </div>
                        ))
                    }

                    {/* Pagination */}
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
                </div>
            </div>
        </section>
    );
};

export default Whitepapers;
