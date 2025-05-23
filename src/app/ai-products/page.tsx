"use client";

import React, { useEffect, useState } from 'react';
import { getProducts, getProductsCount } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { Search, MapPin, Star, ChevronDown, Clock, Bookmark, ExternalLink, LayoutList, LayoutGrid, Plus, Minus, ChevronRight, ChevronLeft, Building2 } from 'lucide-react';
import { ROUTES } from '@/app/routes';
import Link from 'next/link';
import LocationInput from '../components/LocationInput';
import RatingStars from '../components/Rating';


const PAGE_SIZE = 8;

interface FilterOption {
    value: string;
    label: string;
    hidden?: boolean;
}

interface Filter {
    id: string;
    title: string;
    options: string[] | FilterOption[];
    type?: 'checkbox';
    search?: boolean;
}

const AIProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOptionSort, setSelectedOptionSort] = useState<string>('');



    const toggleFilter = (id: string) => {
        setActiveFilter(activeFilter === id ? null : id);
    };

    const toggleDropdownSort = () => {
        setIsOpen((prev) => !prev);
    };

    const selectOptionSort = (option: string) => {
        setSelectedOptionSort(option);
        setSelectedOptions({ ...selectedOptions, sortBy: option });
        setIsOpen(false); // Close dropdown after selection
        console.log("first", option)
    };

    const toggleDropdown = (id: string) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const selectOption = (filterId: string, option: string) => {
        console.log(option)
        if (filterId === "jobType" || filterId === "experience") {
            if (!option) return; // Ignore empty/invalid options

            setSelectedOptions((prev: any) => {
                const prevOptions = prev[filterId] || [];
                const exists = prevOptions.includes(option);

                const updatedOptions = exists
                    ? prevOptions.filter((o: any) => o !== option)
                    : [...prevOptions, option];

                if (updatedOptions.length === 0) {
                    // Remove filter key when no options selected
                    const { [filterId]: _, ...rest } = prev;
                    return rest;
                }

                return {
                    ...prev,
                    [filterId]: updatedOptions,
                };
            });
        } else {
            if (!option) {
                // Remove the key if option is empty
                setSelectedOptions((prev) => {
                    const { [filterId]: _, ...rest } = prev;
                    return rest;
                });
            } else {
                // Normal set for non-checkbox filters
                setSelectedOptions((prev) => ({
                    ...prev,
                    [filterId]: option,
                }));
            }
        }

        // setSelectedOptions((prev) => ({
        //     ...prev,
        //     [filterId]: option,
        // }));
        toggleDropdown(filterId); // Close dropdown after selection

        console.log("selectedOptions", selectedOptions)
    };

    const filters: Filter[] = [
        {
            id: 'productType',
            title: 'Product Type',
            options: [
                'AI Chatbot',
                'AI Platform',
                'Generative AI Tool',
                'AI-Powered Service',
                'Other AI Product',
            ],
        },
        {
            id: 'rating',
            title: 'By Rating',
            options: [
                '★★★★★ (5)',
                '★★★★☆ (4)',
                '★★★☆☆ (3)',
                '★★☆☆☆ (2)',
                '★☆☆☆☆ (1)',
            ],
        },
    ];

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const typeStyles = {
        'Full-time': 'bg-green-100 text-green-700',
        'Part-time': 'bg-yellow-100 text-yellow-700',
        'Internship': 'bg-blue-100 text-blue-700',
        'Contract': 'bg-purple-100 text-purple-700',
        'Freelance': 'bg-pink-100 text-pink-700',
    };

    const fetchData = async () => {
        setIsLoading(true);

        const filters = {

            // jobType: ['Full-time'],
        };
        const [data, count] = await Promise.all([
            getProducts(currentPage, PAGE_SIZE, selectedOptions),
            getProductsCount(selectedOptions),
        ]);
        setProducts(data);
        console.log(data)
        if (currentPage == 0) {
            setCurrentPage(1)

        }
        setTotalCount(count);
        setIsLoading(false);
    };
    useEffect(() => {


        fetchData();
    }, [currentPage, selectedOptionSort]);


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

    const paginationRange = getPaginationRange(totalPages, currentPage);
    const resetFilter = () => {
        setSelectedOptions({});
        setCurrentPage(0);
        setSelectedOptionSort('');
    }
    const handleLocationSelect = (location: string) => {
        // console.log("Selected location:", location);
        selectOption("locationCountry", location);
        selectOption("locationState", location);
        selectOption("locationCity", location);
    };

    return (
        <div className="job-listing">
            <section className="job_search-result py-0 lg:py-12">
                <div className="container mx-auto px-0 lg:px-4">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="section_heading text-3xl font-bold text-center mb-0">AI Product</h2>

                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6 lg:py-12 ">
                <div className="container mx-auto px-0 lg:px-4">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Filter Sidebar */}
                        <div className="col-span-12 lg:col-span-1">
                            <h1 className="text-lg font-semibold mb-4">Filter By</h1>
                            <div className="bg-white p-4 lg:p-6 rounded-3xl border border-gray-300">


                                {/* Filter Blocks */}
                                {filters.map((filter) => (
                                    <div key={filter.id} className="border-b border-gray-200 py-4">
                                        <button
                                            className="w-full text-left text-gray-800 font-medium flex justify-between items-center"
                                            onClick={() => toggleFilter(filter.id)}
                                        >
                                            {filter.title}
                                            <span className='w-6 h-6 p-1 bg-[#005025] rounded-3xl'>{activeFilter === filter.id ? (
                                                <Minus className={` transition-transform   text-[#fff]`} size={16} />
                                            ) : (
                                                <Plus className={` transition-transform  text-[#fff]`} size={16} />
                                            )}</span>

                                        </button>
                                        <div className={`mt-2 ${activeFilter === filter.id ? 'block' : 'hidden'}`}>
                                            {filter.type === 'checkbox' ? (
                                                <ul className="space-y-2">
                                                    {filter.options.map((option: any) => (
                                                        <li key={option.value} className={option.hidden ? 'hidden' : ''}>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    name={filter.id}
                                                                    value={option.value}
                                                                    checked={selectedOptions[filter.id]?.includes(option.label) || false}
                                                                    onChange={() =>
                                                                        selectOption(
                                                                            filter.id,
                                                                            typeof option === 'string' ? option : option.label
                                                                        )
                                                                    }
                                                                />

                                                                {option.label}
                                                            </label>
                                                        </li>
                                                    ))}
                                                    {filter.options.some((opt: any) => opt.hidden) && (
                                                        <button className="text-blue-600 text-sm mt-2 more-btn">Show More</button>
                                                    )}
                                                </ul>
                                            ) : (
                                                <div className="relative">
                                                    {filter.search && (
                                                        <input
                                                            type="text"
                                                            placeholder="Search"
                                                            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                                                        />
                                                    )}
                                                    <button
                                                        className="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center"
                                                        onClick={() => toggleDropdown(filter.id)}
                                                    >
                                                        <span>{selectedOptions[filter.id] || filter.title}</span>
                                                        <ChevronDown className="w-5 h-5" />
                                                    </button>
                                                    <ul
                                                        className={`absolute w-full bg-white border border-gray-300 rounded-md mt-1 z-10 ${dropdownOpen[filter.id] ? 'block' : 'hidden'
                                                            }`}
                                                    >
                                                        {filter.options.map((option: string | FilterOption) => (
                                                            <li
                                                                key={typeof option === 'string' ? option : option.value}
                                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                                onClick={() =>
                                                                    selectOption(
                                                                        filter.id,
                                                                        typeof option === 'string' ? option : option.label
                                                                    )
                                                                }
                                                            >
                                                                {typeof option === 'string' ? option : option.label}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button onClick={fetchData} className="w-full mt-4 py-2 bg-[#005025] text-white rounded-md hover:bg-[#00bf58]">
                                    Apply Filter
                                </button>
                            </div>
                        </div>

                        {/* Job Listings */}
                        <div className="col-span-12 lg:col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-gray-600">
                                    <span className="text-gray-800 font-semibold">{totalCount > 0 ? "All " + totalCount : 0}</span> products found
                                </div>
                                <div className="flex items-center gap-2 lg:gap-4">

                                    <button className="py-2 px-4 border border-gray-300 rounded-md flex items-center gap-2" onClick={resetFilter}>
                                        <span>Reset</span>
                                    </button>
                                    <div className="relative">
                                        <button className="p-2 border border-gray-300 rounded-md flex items-center gap-2" onClick={toggleDropdownSort}>
                                            <span>Sort By</span>
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                        <ul className={`absolute w-40 bg-white border border-gray-300 rounded-md mt-1 ${isOpen ? 'block' : 'hidden'
                                            }`}>
                                            {['Products Type', 'Products Name'].map((option) => (
                                                <li key={option} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectOptionSort(option)}>
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* <button
                                        className={`hidden lg:block p-2 border rounded-md ${viewMode === 'list' ? 'bg-gray-100 border-gray-300' : 'border-gray-300'}`}
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

                            {/* LayoutList View */}
                            {/* {viewMode === 'list' ? ( */}
                                <div className="space-y-4">
                                    {products.map((product, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 sm:grid-cols-12 bg-white p-6 rounded-lg border border-gray-300 gap-4 items-start sm:items-center hover:border-[#31795a]"
                                        >
                                            {/* Job Title */}
                                            <div className="sm:col-span-12">
                                                <Link
                                                    href={ROUTES.PRODUCTS + product.slug?.current}
                                                    className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                                                >
                                                    {product.productName}
                                                </Link>
                                            </div>


                                            <div className="sm:col-span-12 flex justify-between">
                                                <div className="text-sm">
                                                    <RatingStars averageRating={product.averageRating} ratingCount={product.productReview.length} />
                                                </div>
                                                <div className="text-md font-semibold">
                                                    {product.productType}
                                                </div>
                                            </div>

                                            <div className="sm:col-span-10">
                                                <div className="text-md">
                                                    {product.overview.slice(0, 100)}...
                                                </div>
                                            </div>


                                        </div>
                                    ))}
                                </div>
                            {/* ) : ''} */}

                        

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
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AIProducts;