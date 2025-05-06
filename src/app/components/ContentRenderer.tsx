"use client";

import React from "react";
import { urlFor } from "@/lib/sanityImage";

interface ContentRendererProps {
    content: any[];
    type: string;
}

const tagClassMap: Record<string, string> = {
    h1: "mb-4 section_heading",
    h2: "mb-3 section_heading",
    h3: "text-2xl font-medium mb-2",
    p: "text-base text-gray-700 mb-2",
    span: "text-gray-700",
    strong: "font-bold",
    em: "italic text-gray-600",
};

const renderColumn = (columnData: any[]) =>
    columnData?.map((item) => {
        if (item._type === "image") {
            return (
                <div key={item._key} className="about_img">
                    <img
                        src={urlFor(item.asset).url()}
                        className="w-full h-auto rounded-lg shadow"
                        alt="About Image"
                    />
                </div>
            );
        }

        if (item._type === "videoEmbed") {
            return (
                <div key={item._key} className="about_video">
                    <iframe
                        src={item.url}
                        className="w-full h-auto rounded shadow"
                        title="Video Embed"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }

        if (item._type === "block") {
            return (
                <div key={item._key} className="about_cont">
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
            );
        }

        return null;
    });

const ContentRenderer: React.FC<ContentRendererProps> = ({ content, type }) => {
    return (
        <>
            {content?.map((block) => {
                if (block._type === "layout") {
                    const { layoutType } = block;

                    const columns =
                        layoutType === "2column"
                            ? [block.column2Left, block.column2Right]
                            : layoutType === "3column"
                                ? [block.column3Left, block.column3Center, block.column3Right]
                                : [block.column1];

                    const gridCols =
                        layoutType === "2column"
                            ? "grid-cols-2"
                            : layoutType === "3column"
                                ? "grid-cols-3"
                                : "grid-cols-1";

                    return (
                        <section key={block._key} className={`about  `}
                        >
                            <div className={`container   padding-0  mx-auto  ${type == 'page' ? 'px-4' : ''}`}>
                                <div className={`grid  ${gridCols} gap-8 items-center`}>
                                    {columns.map((col, idx) => (
                                        <div key={idx}>{renderColumn(col)}</div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                }

                if (block._type === "image") {
                    return (
                        <section key={block._key} className={`about  `}>
                            <div className={`container padding-0  mx-auto  ${type == 'page' ? 'px-4' : ''}`}>
                                <img
                                    src={urlFor(block.asset).url()}
                                    className="w-full h-auto rounded-lg shadow"
                                    alt="About Image"
                                />
                            </div>
                        </section>
                    );
                }

                if (block._type === "block") {
                    return (
                        <section key={block._key} className={`about `}>
                            <div className={`container padding-0  mx-auto  ${type == 'page' ? 'px-4' : ''}`}>
                                {React.createElement(
                                    block.style === "normal" ? "p" : block.style || "p",
                                    {
                                        className:
                                            tagClassMap[block.style === "normal" ? "p" : block.style] ||
                                            "",
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
                        </section>
                    );
                }

                if (block._type === "videoEmbed") {
                    return (
                        <section key={block._key} className={`about  `}>
                            <div className={`container padding-0  mx-auto  ${type == 'page' ? 'px-4' : ''}`}>
                                <iframe
                                    src={block.url}
                                    className="w-full h-auto rounded shadow"
                                    title="Video Embed"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </section>
                    );
                }

                return null;
            })}
        </>
    );
};

export default ContentRenderer;
