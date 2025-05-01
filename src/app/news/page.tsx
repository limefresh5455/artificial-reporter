"use client";

import React, { useEffect, useState } from 'react';
import { getTopStoriesData, getTotalTopStoriesCount } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slugify } from '@/lib/slugify';
import { ROUTES } from '@/app/routes';
import Link from 'next/link';

const PAGE_SIZE = 8;

const TopStories = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [slug, setSlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

    //   const { category } = await params;  // resolve params first
    //   setSlug(category);

      const [data, count] = await Promise.all([
        getTopStoriesData(currentPage, PAGE_SIZE, ''),
        getTotalTopStoriesCount()
        
      ]);
      console.log(data)
      setStories(data);
      setTotalCount(count);
      setIsLoading(false);
    };

    fetchData();
  }, [currentPage]); // <- Also add params as dependency

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
                    <img
                      src={urlFor(story.image.asset).url()}
                      className="w-full object-cover"
                      alt="Story Image"
                      style={{ aspectRatio: "3/2" }}
                    />
                    <div className="bg-white bg-opacity-90 p-4 flex flex-col justify-end">
                      <div className="text-sm text-gray-600 mb-1">
                        <a href="#" className="text-blue-600">{story.eventType || "Category"}</a>
                        <span className="px-1">/</span>
                        <span>{new Date(story._createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                        })}</span>
                      </div>
                      <Link href={`${ROUTES.NEWS}${story.slug.current}`} className="text-lg font-semibold hover:underline">
                        {story.title}
                      </Link>
                      <p className="text-sm mt-1">
                        {story.overview?.slice(0, 100)}
                        {story.overview?.length > 100 && '...'}
                      </p> 
                    </div>
                  </div>
                ))}
              </div>
            )}

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

          <div className="lg:col-span-4 space-y-10">
            <div>
              <p className="text-lg font-semibold mb-2">Advertisement</p>
              <button>
                <img className="w-full" src="https://odeskthemes.com/10/news-portal/assets/img/ad-4.png" alt="Ad" />
              </button>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Advertisement</p>
              <button>
                <img className="w-full" src="https://odeskthemes.com/10/news-portal/assets/img/news-500x280-4.png" alt="Ad" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopStories;
