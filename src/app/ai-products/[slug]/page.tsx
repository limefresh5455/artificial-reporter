"use client";

import React, { useEffect, useState } from 'react';
import { getProduct } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { Facebook, Building2, Twitter, Link, ChevronLeft, ChevronRight } from 'lucide-react';
import BackButton from '@/app/components/BackButton';
import RatingStars from '@/app/components/Rating';
import SubmitReviewForm from '@/app/components/ReviewForm';

const PAGE_SIZE = 4;


const AICompany = ({
    params
}: {
    params: Promise<{ slug: string }>;
}) => {
    const [productData, setProductData] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);


    const fetchData = async () => {
        const { slug } = await params;
        const data = await getProduct(slug, currentPage, PAGE_SIZE);

        console.log(data.totalReviews)
        setProductData(data);
        setTotalCount(data.totalReviews ? data.totalReviews : 0);
        console.log(data);
    };
    useEffect(() => {


        fetchData();
    }, [currentPage]);
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);


    const handleReviewSubmitted = () => {
        console.log('Review was successfully submitted!');
        fetchData();
        // You can also refresh reviews or show a custom message here
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

    const paginationRange = getPaginationRange(totalPages, currentPage);

    return (<>
        {productData ? (
            <section className="py-2 lg:py-12 ">
                <div className="container mx-auto px-0 lg:px-4">
                    <span><BackButton /></span>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <h2 className="col-span-12 text-2xl font-bold text-gray-900 mb-1">{productData?.productName}</h2>
                        <div className="lg:col-span-8">
                            {/* <div className="mb-4 text-sm text-gray-500">
                                {new Date(productData.dateAdded).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                })} by <a href={"#"} className="font-medium text-gray-800 hover:underline">{productData?.company?.name}</a>
                            </div> */}




                            <div className="space-y-8">


                                <div className="border border-gray-200 p-6 rounded-lg bg-white">
                                    <div className="flex items-center mb-4">
                                        <h4 className="text-lg font-semibold text-gray-800">Overview</h4>
                                    </div>
                                    <p className="text-gray-700">
                                        {productData.overview}
                                    </p>

                                    <div className="mt-12">
                                        <div className="flex items-center mb-6">
                                            <h4 className="text-xl font-semibold">{
                                                productData?.totalReviews > 0 ? `${productData.totalReviews} Reviews` : "No Reviews Yet"
                                            }</h4>
                                        </div>
                                        <div className="grid gap-6">
                                            {productData.productReview?.map((review: any, index: any) => (
                                                <div key={index} className="bg-[#f2f2f2] p-5 grid grid-cols-12 gap-4  ">
                                                    <div className="col-span-12 sm:col-span-3 text-sm text-gray-700 border-r border-[#999]">
                                                        <p className=" text-sm font-bold mb-3">{review.name || "John"}</p>

                                                        <RatingStars averageRating={review.stars} ratingCount={1} removeText={true} />
                                                    </div>
                                                    <div className="col-span-12 sm:col-span-9 ">
                                                        <div className="mb-1">
                                                            <p className="text-sm font-bold text-gray-500">
                                                                {new Date(review.date_of_review).toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "2-digit",
                                                                })}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-800 text-sm">{review.details}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {productData.productReview?.length >= PAGE_SIZE ? (
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
                                            ) : ''}


                                        </div>

                                        <SubmitReviewForm productId={productData._id} onSubmitSuccess={handleReviewSubmitted} />
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className=" p-6 rounded-lg bg-[#eff6f3]">


                                <ul className="grid grid-cols-1 gap-4 border-none">

                                    <li className="col-span-1">
                                        <span className="block text-sm font-medium text-gray-600">Product Type</span>
                                        <div className="text-base font-semibold text-gray-800">AI Chatbot</div>
                                    </li>

                                    <li className="col-span-1">
                                        <span className="block text-sm font-medium text-gray-600">Rating</span>
                                        <div className="flex items-center gap-1 text-yellow-500">

                                            <RatingStars averageRating={productData?.averageRating} ratingCount={productData.totalReviews} />
                                        </div>
                                    </li>
                                </ul>



                            </div>
                        </div>

                    </div>
                </div>
            </section>
        ) : ''}

    </>
    );
};

export default AICompany;