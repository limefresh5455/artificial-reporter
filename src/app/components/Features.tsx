'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { getFeatures } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/client';

import 'swiper/css';
import 'swiper/css/navigation';

const builder = imageUrlBuilder(client);

const CardSlider: React.FC = () => {
  const [features, setFeatures] = useState<any>(null);
  const swiperRef = useRef<any>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeaturesData = async () => {
      try {
        const data = await getFeatures();
        setFeatures(data);
      } catch (error) {
        console.error('Error fetching features data:', error);
      }
    };

    fetchFeaturesData();
  }, []);

  if (!features) {
    return <div>Loading...</div>;
  }

  const getImageUrl = (source: any) => {
    return builder.image(source).url();
  };

  return (
    <section className="">
      <div className="flex items-center justify-between bg-light py-3 px-4 mb-3 bgh3">
        <h3 className="text-2xl font-medium">{features.mainTitle}</h3>
        <a className="text-secondary font-weight-medium text-decoration-none" href={features.viewAllLink}>
          {features.viewAllLinkText}
        </a>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          loop
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {features.stories.map((story: any) => (
            <SwiperSlide key={story._key}>
              <div className="flex bg-white h-full">
                <img
                  src={getImageUrl(story.backgroundImage.asset)}
                  alt={story.title}
                  className="w-[80px] object-cover"
                />
                <div className="p-4 text-[#42526E] text-sm font-medium">
                  {story.title}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          ref={prevRef}
          className="absolute left-5 top-1/2 transform -translate-y-1/2 z-20 bg-[#134c90] border-[0.1vw] border-[#134c90] hover:bg-[transparent] hover:border-[0.1vw] hover:border-[#134c90] p-1 cursor-pointer"
          onClick={() => swiperRef.current?.slidePrev()}
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
          className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 bg-[#134c90] border-[0.1vw] border-[#134c90] hover:bg-[transparent] hover:border-[0.1vw] hover:border-[#134c90] p-1 cursor-pointer"
          onClick={() => swiperRef.current?.slideNext()}
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
      </div>
    </section>
  );
};

export default CardSlider;