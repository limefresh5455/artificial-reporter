"use client";

import React, { useEffect, useState } from 'react';
import { getStoryData, getRelatedStories } from '@/lib/sanity';
import { urlFor } from '@/lib/sanityImage';
import { slugify } from '@/lib/slugify';
import { ROUTES } from '@/app/routes';
import Link from 'next/link';
import ContentRenderer from "@/app/components/ContentForPost";
import { Facebook, Twitter, Linkedin, Mail, Printer, Share2 } from 'lucide-react';


const Story = ({
    params
}: {
    params: Promise<{ slug: string }>;
}) => {
    const [story, setStory] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [relatedStories, setRelatedStoriesData] = useState<any[]>([]);

    const tagClassMap: Record<string, string> = {
        h1: ' mb-4 section_heading',
        h2: ' mb-3 section_heading',
        h3: 'text-2xl font-medium mb-2',
        p: 'text-base text-gray-700 mb-2',
        span: 'text-gray-700',
        strong: 'font-bold',
        em: 'italic text-gray-600',
        // Add more as needed
    };

    const fetchData = async () => {
        setIsLoading(true);
        const { slug } = await params;
        try {
            const data = await getStoryData(slug, 'newsArticle');
            if (Array.isArray(data) && data.length > 0) {
                setStory(data[0]);
                console.log(data[0]);

                // Fetch related stories correctly
                const tags = (data[0].tags as any[]).map(tag => tag.title);

                const relatedData = await getRelatedStories(tags || [], data[0].slug.current);
                setRelatedStoriesData(relatedData);
                // console.log(relatedData);
            } else {
                setStory(null);
            }
        } catch (error) {
            console.error('Error fetching story:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!story) {
        return <p>No story found.</p>;
    }

    const renderColumn = (columnData: any) => (
        columnData?.map((item: any) => (
            <div key={item._key}>
                {item._type === "image" && (
                    <div className="about_img">
                        <img
                            src={urlFor(item.asset).url()}
                            className="w-full h-auto rounded-lg shadow"
                            alt="About Image"
                        />
                    </div>
                )}
                {item._type === "videoEmbed" && (
                    <div className="about_video">
                        <iframe
                            src={item.url} // Assuming `url` contains the video URL (e.g., YouTube/Vimeo)
                            className="w-full h-auto rounded shadow"
                            title="Video Embed"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
                {item._type === "block" && (
                    <div className="about_cont">
                        {React.createElement(
                            item.style === "normal" ? "p" : item.style || "p",
                            {
                                className:
                                    tagClassMap[item.style === "normal" ? "p" : item.style] || "",
                            },
                            item.children.map((child: any) =>
                                React.createElement(
                                    child._type || "span",
                                    { key: child._key },
                                    child.text
                                )
                            )
                        )}
                    </div>
                )}
            </div>
        ))
    );

    return (
        <>
            <section className="single_article">
                <div className="article_img">

                    <img
                        src={urlFor(story.image.asset).url()}
                        className="w-full object-cover img-fluid"
                        alt={story.title}
                        style={{ aspectRatio: "3/2" }}
                    />
                </div>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1">
                        <div className="col-span-1">
                            <div className="single_article_inner">
                                <div className="grid grid-cols-12 gap-8">
                                    <div className="col-span-12">
                                        <div className="post_header">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="post_categories"><a href="#">{story.eventType || "Category"}</a></div>
                                                <div className="post_share">
                                                    <div className="share-container">
                                                        <div className="share-icon">
                                                            <Share2 />
                                                        </div>
                                                        <div className="social-icons flex gap-2 mt-2">
                                                            <a href="#" className='hover:text-[#fff]' target="_blank" aria-label="Facebook">
                                                                <Facebook className='hover:text-[#fff]' />
                                                                <span className="visually-hidden">Facebook</span>
                                                            </a>
                                                            <a href="#" className='hover:text-[#fff]' target="_blank" aria-label="Twiiter">
                                                                <Twitter className='hover:text-[#fff]' />
                                                                <span className="visually-hidden">Twiiter</span>
                                                            </a>
                                                            <a href="#" className='hover:text-[#fff]' target="_blank" aria-label="Linkedin">
                                                                <Linkedin className='hover:text-[#fff]' />
                                                                <span className="visually-hidden">Linkedin</span>
                                                            </a>
                                                            <a href="#" className='hover:text-[#fff]' target="_blank" aria-label="Printer">
                                                                <Printer className='hover:text-[#fff]' />
                                                                <span className="visually-hidden">Printer</span>
                                                            </a>
                                                            <a href="#" className='hover:text-[#fff]' target="_blank" aria-label="Email">
                                                                <Mail className='hover:text-[#fff]' />
                                                                <span className="visually-hidden">Email</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <h2 className="section_heading">{story.title}</h2>
                                            <div className="post_author_detail">
                                                <a className="post_author" href="#">
                                                    <span className="post_author_img"><img alt="" src="https://odeskthemes.com/10/news-portal/assets/img/img-1.jpg" />adipiscing elit</span>
                                                </a>
                                                <span className="post_date">{new Date(story.publishedAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "2-digit",
                                                })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-8">
                                        <div className="content_wrap">
                                            <div className="content">
                                                <ContentRenderer content={story.content} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Area */}
                                    <div className="lg:col-span-4 space-y-10">
                                        {/* Ad 1 */}
                                        <div>
                                            <p className="text-lg font-semibold mb-2">Advertisement</p>
                                            <button>
                                                <img className="w-full" src="https://odeskthemes.com/10/news-portal/assets/img/news-500x280-4.png" alt="Ad" />
                                            </button>
                                        </div>

                                        {/* Related Stories */}
                                        <div className="pb-6">
                                            <div className="bg-gray-100 py-2 px-4 mb-4">
                                                <h3 className="text-xl font-semibold m-0">Related Stories</h3>
                                            </div>

                                            <div className="flex flex-col space-y-4">
                                                {relatedStories.length > 0 ? (
                                                    relatedStories.map((item: any) => (
                                                        <div key={item._id} className="flex space-x-3 items-center">
                                                            <img
                                                                src={item.image ? urlFor(item.image.asset).url() : '/assets/img/placeholder.png'}
                                                                alt={item.title}
                                                                className="w-[70px] h-[70px] object-cover rounded"
                                                            />
                                                            <div className="flex-1 bg-gray-100 px-3 py-2 flex items-center h-[70px]">
                                                                <Link href={`${ROUTES.NEWS}${item?.newsCategory?.value.current}/${item.slug.current}`} className="text-sm font-semibold hover:underline">
                                                                    {item.title}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No related stories found.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Ad 2 */}
                                        <div>
                                            <p className="text-lg font-semibold mb-2">Advertisement</p>
                                            <button>
                                                <img className="w-full" src="https://odeskthemes.com/10/news-portal/assets/img/ad-4.png" alt="Ad" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stories news_inner py-12 hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-8">
                            <h2 className="text-3xl font-semibold mb-3">{story.title}</h2>

                            <div className="relative">
                                <img
                                    src={urlFor(story.image.asset).url()}
                                    className="w-full object-cover"
                                    alt={story.title}
                                    style={{ aspectRatio: "3/2" }}
                                />
                            </div>

                            <div className="bg-white bg-opacity-90 p-4 flex flex-col justify-end">
                                <div className="text-sm text-gray-600 mb-1">
                                    <Link href="#" className="text-blue-600">{story.eventType || "Category"}</Link>
                                    <span className="px-1">/</span>
                                    <span>{new Date(story.publishedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "2-digit",
                                    })}</span>
                                </div>

                                <div style={{ paddingTop: "20px" }}>
                                    <ContentRenderer content={story.content}
                                    // type="story"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Sidebar Area */}
                        <div className="lg:col-span-4 space-y-10">
                            {/* Ad 1 */}
                            <div>
                                <p className="text-lg font-semibold mb-2">Advertisement</p>
                                <button>
                                    <img className="w-full" src="https://odeskthemes.com/10/news-portal/assets/img/news-500x280-4.png" alt="Ad" />
                                </button>
                            </div>

                            {/* Related Stories */}
                            <div className="pb-6">
                                <div className="bg-gray-100 py-2 px-4 mb-4">
                                    <h3 className="text-xl font-semibold m-0">Related Stories</h3>
                                </div>

                                <div className="flex flex-col space-y-4">
                                    {relatedStories.length > 0 ? (
                                        relatedStories.map((item: any) => (
                                            <div key={item._id} className="flex space-x-3 items-center">
                                                <img
                                                    src={item.image ? urlFor(item.image.asset).url() : '/assets/img/placeholder.png'}
                                                    alt={item.title}
                                                    className="w-[70px] h-[70px] object-cover rounded"
                                                />
                                                <div className="flex-1 bg-gray-100 px-3 py-2 flex items-center h-[70px]">
                                                    <Link href={`${ROUTES.NEWS}${item?.newsCategory?.value.current}/${item.slug.current}`} className="text-sm font-semibold hover:underline">
                                                        {item.title}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No related stories found.</p>
                                    )}
                                </div>
                            </div>

                            {/* Ad 2 */}
                            <div>
                                <p className="text-lg font-semibold mb-2">Advertisement</p>
                                <button>
                                    <img className="w-full" src="https://odeskthemes.com/10/news-portal/assets/img/ad-4.png" alt="Ad" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Story;
