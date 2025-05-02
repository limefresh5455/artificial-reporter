"use client";

import React, { useEffect, useState } from 'react';
import { getPageData, PageData } from '@/lib/sanity'; // Import necessary types
import { urlFor } from '@/lib/sanityImage';

const About: React.FC = () => {
    const [aboutData, setAboutData] = useState<PageData | null>(null);

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

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPageData("about-us");
            setAboutData(data);
            console.log(data);
        };

        fetchData();
    }, []);

    if (!aboutData) return <div>Loading...</div>;

    // Define renderColumn with explicit type for columnData
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
            {aboutData.content.map((block: any) => {


                // Handle layout types (2column, 1column, 3column)
                if (block._type === "layout") {
                    if (block.layoutType === "2column") {
                        return (
                            <section key={block._key} className="about py-12">
                                <div className="container mx-auto px-4">
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-8 items-center">
                                        <div>{renderColumn(block.column2Left)}</div>
                                        <div>{renderColumn(block.column2Right)}</div>
                                    </div>
                                </div>
                            </section>
                        );
                    }

                    if (block.layoutType === "1column") {
                        return (
                            <section key={block._key} className="about py-12">
                                <div className="container mx-auto px-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        <div>{renderColumn(block.column1)}</div>
                                    </div>
                                </div>
                            </section>
                        );
                    }

                    if (block.layoutType === "3column") {
                        return (
                            <section key={block._key} className="about py-12">
                                <div className="container mx-auto px-4">
                                    <div className="grid grid-cols-3 md:grid-cols-2 gap-8 items-center">
                                        <div>{renderColumn(block.column3Left)}</div>
                                        <div>{renderColumn(block.column3Center)}</div>
                                        <div>{renderColumn(block.column3Right)}</div>
                                    </div>
                                </div>
                            </section>
                        );
                    }
                }

                // Handle image type separately
                if (block._type === "image") {
                    return (
                        <section key={block._key} className="about py-12">
                            <div className="container mx-auto px-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <div className="about_img">
                                            <img
                                                src={urlFor(block.asset).url()}
                                                className="w-full h-auto rounded-lg shadow"
                                                alt="About Image"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                }

                if (block._type === "block") {

                    return (
                        <section key={block._key} className="about mb-2">
                            <div className="container mx-auto px-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <div className="about_cont">
                                            {React.createElement(
                                                block.style === "normal" ? "p" : block.style || "p",
                                                {
                                                    className:
                                                        tagClassMap[block.style === "normal" ? "p" : block.style] || "",
                                                },
                                                block.children.map((child: any) =>
                                                    React.createElement(
                                                        child._type || "span",
                                                        { key: child._key },
                                                        child.text
                                                    )
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                }

                if (block._type === "videoEmbed") {
                    return (
                        <section key={block._key} className="about py-12">
                            <div className="container mx-auto px-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        {/* Embed the video using an iframe */}
                                        <div className="about_video">
                                            <iframe
                                                src={block.url} // Assuming `url` contains the video URL (e.g., YouTube/Vimeo)
                                                className="w-full h-auto rounded shadow"
                                                title="Video Embed"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                }

                return null;
            })}
        </>
    );
};

export default About;
