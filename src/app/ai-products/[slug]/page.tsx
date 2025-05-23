"use client";

import React, { useEffect, useState } from 'react';
import { getProduct } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { Facebook, Building2, Twitter, Link } from 'lucide-react';
import BackButton from '@/app/components/BackButton';
import RatingStars from '@/app/components/Rating';
import SubmitReviewForm from '@/app/components/ReviewForm';


const AICompany = ({
    params
}: {
    params: Promise<{ slug: string }>;
}) => {
    const [productData, setProductData] = useState<any>([]);
    const fetchData = async () => {
        const { slug } = await params;
        const data = await getProduct(slug);
        setProductData(data);
        console.log(data);
    };
    useEffect(() => {


        fetchData();
    }, []);

const handleReviewSubmitted = () => {
    console.log('Review was successfully submitted!');
    fetchData();
    // You can also refresh reviews or show a custom message here
  };


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
                                                productData.productReview?.length > 0 ? `${productData.productReview?.length} Reviews` : "No Reviews Yet"
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

                                            <RatingStars averageRating={productData?.averageRating} ratingCount={productData.productReview?.length} />
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