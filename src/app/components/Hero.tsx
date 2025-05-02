'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { getHeroData, HeroSlide } from '@/lib/sanity';
import { urlFor } from "@/lib/sanityImage"

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';

const Hero: React.FC = () => {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const swiperRef = useRef<any>(null);

    const prevRef = useRef<HTMLDivElement | null>(null);
    const nextRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        async function fetchSlides() {
            const data = await getHeroData();
            setSlides(data?.slides || []);
        }

        fetchSlides();
    }, []);


    useEffect(() => {
        if (!swiperRef.current) return;

        const swiper = swiperRef.current;
        if (typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
        }
    }, [slides]);
    console.log(slides)

    return (
        <section className="relative bg-cover bg-center">
            <div className="absolute inset-0 bg-[#12498bcc] z-0" />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1 w-full relative">
                    <Swiper
                        key={slides.length}
                        onSwiper={(swiper: any) => {
                            swiperRef.current = swiper;
                        }}
                        modules={[Autoplay, Navigation]}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                            disabledClass: 'swiper-button-disabled'
                        }}
                        loop
                        spaceBetween={10}
                        slidesPerView={1}
                    >
                        {slides.map((slide) => (
                            <SwiperSlide key={slide._key}>
                                <div
                                    className="overlay text-white p-10 bg-cover bg-center min-h-100 flex flex-col justify-end"
                                    style={{
                                        backgroundImage: `url("${urlFor(slide.image.asset).url()}")`,
                                    }}
                                >
                                    <div className="text-sm mb-2 text-[#e0e0e0] z-2 relative">
                                        <a target={slide.linkTarget} href={slide.link}>{slide.title || 'Fallback Title'}</a>
                                    </div>
                                    <a
                                        target={slide.linkTarget}
                                        href={slide.link}
                                        className="text-2xl lg:text-3xl font-bold leading-tight hover:underline z-2 relative"
                                    >
                                        {slide.subtitle}
                                    </a>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows */}
                    <div
                        ref={prevRef}
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 z-20 bg-[#134c90] border-[0.1vw] border-[#134c90] hover:bg-[transparent] hover:border-[#134c90] p-1 cursor-pointer"
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
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 bg-[#134c90] border-[0.1vw] border-[#134c90] hover:bg-[transparent] hover:border-[#134c90] p-1 cursor-pointer"
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
            </div>
        </section>
    );
};

export default Hero;