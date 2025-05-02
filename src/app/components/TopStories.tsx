'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/client';
import { getTopStories, HomeNewsData } from '@/lib/sanity';

import 'swiper/css';
import 'swiper/css/navigation';
import { ROUTES } from '../routes';
import Link from 'next/link';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source).width(800).url();
}

const CardSlider: React.FC = () => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<HomeNewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topStoriesData = await getTopStories();
        setData(topStoriesData);
      } catch (err) {
        console.error('Failed to fetch top stories:', err);
        setError('Failed to load top stories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading top stories...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!data || !data.relatedArticles || data.relatedArticles.length === 0) {
    return <div className="text-center py-8">No top stories available.</div>;
  }

  return (
    <section>
      <div className="flex items-center justify-between bg-light py-3 px-4 mb-3 bgh3">
        <h3 className="text-2xl font-medium">{data.mainTitle}</h3>
        {data.viewAllLink && (
          <Link
            href={data.viewAllLink}
            className="text-secondary font-weight-medium text-decoration-none"
          >
            {data.viewAllLinkText}
          </Link>
        )}
      </div>

      <div className="relative max-w-7xl mx-auto">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper: SwiperType) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {data.relatedArticles.map((story) => (
            <SwiperSlide key={story._id}>
              <div className="relative w-full h-64 rounded overflow-hidden">
                {story.image && (
                  <>
                    <img
                      src={urlFor(story.image)}
                      alt={story.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                  </>
                )}
                <div className="absolute bottom-4 left-4 z-10">
                  {story.slug ? (
                    <Link
                      href={`${ROUTES.NEWS}${story.slug.current}`}
                      className="text-white text-lg font-semibold leading-tight hover:underline z-20"
                    >
                      {story.title}
                    </Link>
                  ) : (
                    <span className="text-white text-lg font-semibold leading-tight">
                      {story.title}
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Navigation Buttons */}
          <div
            ref={prevRef}
            className="absolute left-5 top-1/2 transform -translate-y-1/2 z-20 bg-[#134c90] border-[0.1vw] border-[#134c90] hover:bg-transparent hover:border-[#134c90] p-1 cursor-pointer"
          >
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div
            ref={nextRef}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 bg-[#134c90] border-[0.1vw] border-[#134c90] hover:bg-transparent hover:border-[#134c90] p-1 cursor-pointer"
          >
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default CardSlider;
