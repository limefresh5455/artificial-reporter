"use client";

import React, { useEffect, useState } from 'react';
import { getJobs, getTotalJobsCount } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { Search, MapPin, ChevronDown, Clock, Bookmark, ExternalLink, LayoutList, LayoutGrid, Plus, Minus, ChevronRight, ChevronLeft, Building2 } from 'lucide-react';
import { ROUTES } from '@/app/routes';
import Link from 'next/link';
import LocationInput from '../components/LocationInput';

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

const AIJobs: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
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
        setIsOpen(false); // Close dropdown after selection
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
            id: 'remote',
            title: 'Remote',
            options: ['True', 'False'],
        },
        {
            id: 'datePosted',
            title: 'Date Posted',
            options: ['Last 24 hours', 'Last 3 days', 'Last 7 days', 'Last 14 days'],
        },
        {
            id: 'pay',
            title: 'Pay',
            options: ['$0 – $10,000', '$10,000 – $20,000', '$20,000 – $30,000', '$30,000 – $50,000', '$50,000 – $100,000', '$100,000+'],
        },


        // {
        //     id: 'distance',
        //     title: 'Distance',
        //     options: [
        //         'Exact location only',
        //         'Within 5 miles',
        //         'Within 10 miles',
        //         'Within 15 miles',
        //         'Within 25 miles',
        //         'Within 35 miles',
        //         'Within 50 miles',
        //         'Within 100 miles',
        //     ],
        // },
        {
            id: 'jobType',
            title: 'Job Type',
            type: 'checkbox',
            options: [
                { value: '01', label: 'Full-time' },
                { value: '02', label: 'Part-time' },
                // { value: '03', label: 'Temporary' },
                { value: '04', label: 'Contract' },
                { value: '05', label: 'Internship' },
                // { value: '06', label: 'Volunteer', hidden: true },
                // { value: '07', label: 'Permanent', hidden: true },
                // { value: '08', label: 'Freelance', hidden: true },
                // { value: '09', label: 'Tenure track', hidden: true },
                // { value: '10', label: 'Seasonal', hidden: true },
            ],
        },
        // {
        //     id: 'company',
        //     title: 'Company',
        //     options: [
        //         'All Companies',
        //         'Amazon.com',
        //         'PwC',
        //         'Flagship Pioneering, Inc.',
        //         'Accenture',
        //         'Google',
        //         'Boston Consulting Group',
        //         'Sanofi',
        //         'Takeda Pharmaceuticals',
        //         'Red Hat',
        //         'Crowe LLP',
        //     ],
        // },
        // {
        //     id: 'employer',
        //     title: 'Employer/Recruiter',
        //     options: ['Employer and Recruiter', 'Employer', 'Staffing agency'],
        // },
        // {
        //     id: 'location',
        //     title: 'Location',
        //     search: true,
        //     options: [
        //         'Boston, MA',
        //         'Cambridge, MA',
        //         'Somerville, MA',
        //         'Charlestown, MA',
        //         'Brighton, MA',
        //         'Brookline, MA',
        //         'Chelsea, MA',
        //         'Allston, MA',
        //     ],
        // },
        {
            id: 'experience',
            title: 'Experience Level',
            type: 'checkbox',
            options: [
                { value: '01', label: 'All' },
                { value: '02', label: 'Mid' },
                { value: '03', label: 'Senior' },
                { value: '04', label: 'Entry' },
            ],
        },
        {
            id: 'education',
            title: 'Education',
            options: [
                'All',
                'High School',
                "Associate’s",
                "Bachelor’s",
                "Master’s",
                'Doctoral',
            ],
        },

        // {
        //     id: 'encouraged',
        //     title: 'Encouraged to apply',
        //     type: 'checkbox',
        //     options: [
        //         { value: '01', label: 'Fair chance' },
        //         { value: '02', label: 'Military encouraged' },
        //         { value: '03', label: 'Back to work' },
        //         { value: '04', label: 'No degree' },
        //     ],
        // },
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
            getJobs(currentPage, PAGE_SIZE, selectedOptions),
            getTotalJobsCount(selectedOptions),
        ]);
        setJobs(data);
        if (currentPage == 0) {
            setCurrentPage(1)

        }
        setTotalCount(count);
        setIsLoading(false);
    };
    useEffect(() => {


        fetchData();
    }, [currentPage]);


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
            <section className="job_search-result py-12">
                <div className="container mx-auto px-4">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="section_heading text-3xl font-bold text-center mb-8">Find AI Jobs</h2>
                            <div className="job_search_inner">
                                <div className="search_box grid grid-cols-3 gap-4 items-center">
                                    <div className="input_box relative">
                                        <Search size={20} />
                                        <input
                                            type="text"
                                            placeholder="Artificial Intelligence"
                                            className="w-full pl-8 pr-4 py-2 focus:outline-none"
                                            
                                            onChange={(e) => selectOption(
                                                "title",
                                                e.target.value
                                            )}
                                        />
                                    </div>

                                    <LocationInput
                                        onSelect={handleLocationSelect}
                                        placeholder="Location"
                                        className=" input_box"
                                    />


                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            onClick={fetchData}
                                            className="btn btn_bg w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 ">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-4 gap-8">
                        {/* Filter Sidebar */}
                        <div className="col-span-1">
                            <h1 className="text-lg font-semibold mb-4">Filter By</h1>
                            <div className="bg-white p-6 rounded-3xl border border-gray-300">


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
                        <div className="col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-gray-600">
                                    <span className="text-gray-800 font-semibold">{totalCount > 0 ? "All " + totalCount : 0}</span> jobs found
                                </div>
                                <div className="flex items-center gap-4">
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
                                            {['Latest', 'Job Title', 'Location'].map((option) => (
                                                <li key={option} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectOptionSort(option)}>
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        className={`p-2 border rounded-md ${viewMode === 'list' ? 'bg-gray-100 border-gray-300' : 'border-gray-300'}`}
                                        onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                                    >
                                        {viewMode === 'list' ? (
                                            <LayoutList strokeWidth={1.5} className="w-5 h-5" />
                                        ) : (
                                            <LayoutGrid strokeWidth={1.5} className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* LayoutList View */}
                            {viewMode === 'list' ? (
                                <div className="space-y-4">
                                    {jobs.map((job, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 sm:grid-cols-12 bg-white p-6 rounded-lg border border-gray-300 gap-4 items-start sm:items-center hover:border-[#31795a]"
                                        >
                                            {/* Job Title */}
                                            <div className="sm:col-span-12">
                                                <Link
                                                    href={ROUTES.JOBS + job.slug?.current}
                                                    className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                                                >
                                                    {job.title}
                                                </Link>
                                            </div>

                                            {/* Company Info */}
                                            <div className="sm:col-span-5 flex items-start sm:items-center gap-4">
                                                {/* <img
                                                    src={job.company?.logo?.asset?.url}
                                                    alt="Company Logo"
                                                    className="w-12 h-12 rounded-md object-contain"
                                                /> */}

                                                {job?.company?.logo?.asset?.url ? (
                                                    <img
                                                        src={job?.company.logo.asset.url}
                                                        alt={`${job?.company?.name || 'Company'} Logo`}
                                                        className="w-12 h-12 rounded-md object-contain"
                                                    />
                                                ) : (
                                                    <Building2 size={48} className="text-gray-400" />
                                                )}


                                                <div>
                                                    <p
                                                        className={`text-sm text-center inline-block capitalize px-2 py-1 rounded 
                              ${typeStyles[job.jobType as keyof typeof typeStyles]}`}
                                                    >
                                                        {job.jobType}
                                                    </p>
                                                    <span className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                                                        <Clock className="w-4 h-4" />
                                                        <b> Posted {job.datePosted ? new Date(job.datePosted).toDateString() : ''}</b>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Location & Salary */}
                                            <div className="sm:col-span-4">
                                                <div className="text-sm">
                                                    <a href="#" className="text-gray-600 hover:text-blue-600">
                                                        {job.location}
                                                    </a>
                                                </div>
                                                <div className="text-sm">
                                                    From{" "}
                                                    <span className="text-gray-800 font-semibold">
                                                        {job.payAmount}
                                                    </span>{" "}
                                                    per {job.hourlyOrSalary?.toLowerCase()}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="sm:col-span-3 flex gap-2">
                                                <a
                                                    href="#"
                                                    className="py-2 px-4 bg-[#005025] text-white rounded-md flex items-center gap-2 hover:bg-[#00bf58]"
                                                >
                                                    Apply
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href="#"
                                                    className="py-2 px-4 hover:bg-[#e7f6ef] hover:border-[#e7f6ef] border border-gray-300 rounded-md flex items-center"
                                                >
                                                    <Bookmark className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : ''}

                            {/* LayoutGrid View */}
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {jobs.map((job) => (
                                        <div key={job._id} className="col-sm-6 bg-white p-6 rounded-lg flex flex-col transition-transform border border-gray-300 hover:border-[#31795a] position-relative">

                                            {/* Company Logo */}
                                            <a href="#" className="company_logo">
                                                {/* <img src={job.company?.logo?.asset?.url} alt={`${job.company?.name} logo`} className="w-12 h-12 rounded-md mb-2 object-contain" /> */}
                                                {job?.company?.logo?.asset?.url ? (
                                                    <img
                                                        src={job?.company.logo.asset.url}
                                                        alt={`${job?.company?.name || 'Company'} Logo`}
                                                        className="w-12 h-12 rounded-md object-contain mb-2"
                                                    />
                                                ) : (
                                                    <Building2 size={48} className="text-gray-400 mb-2" />
                                                )}
                                            </a>

                                            {/* Save Button */}
                                            <a href="#" className="save-btn absolute top-4 right-4">
                                                <Bookmark className="w-5 h-5 text-gray-600" />
                                            </a>

                                            {/* Job Type */}
                                            <span className={`text-xs px-2 py-1 text-center rounded font-medium inline-block job-duration ${typeStyles[job.jobType as keyof typeof typeStyles]}`}>
                                                {job.jobType}
                                            </span>

                                            {/* Job Title */}
                                            <a href={`/jobs/${job.id}`} className="title text-lg font-semibold text-gray-800 hover:text-blue-600 mt-2">
                                                {job.title}
                                            </a>

                                            {/* Posted Date */}
                                            <span className="post_time text-sm text-gray-500 flex items-center gap-1 mt-2">
                                                <Clock className="w-4 h-4" />
                                                Posted {job.datePosted ? new Date(job.datePosted).toDateString() : ''}
                                            </span>

                                            {/* Job Salary */}
                                            <div className="job-salary text-sm mt-2">
                                                From <span className="text-gray-800 font-semibold">{job.payAmount}</span> per {job.hourlyOrSalary?.toLowerCase()}
                                            </div>

                                            {/* Job Location and Apply Button */}
                                            <div className="d-flex align-items-center justify-content-between mt-auto flex justify-between items-center">
                                                <div className="job-location text-sm">
                                                    <a href="#" className="text-gray-600 hover:text-blue-600">{job.location}</a>
                                                </div>
                                                <a href="#" className="apply-btn py-2 px-4 bg-[#005025] text-white rounded-md flex items-center gap-2 hover:bg-blue-700">
                                                    Apply
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : ''}

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

export default AIJobs;