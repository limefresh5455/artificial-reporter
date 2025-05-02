"use client";

import React, { useEffect, useState } from 'react';
import { getFooterData, FooterData, Category, QuickLink, SocialLink } from '@/lib/sanity'; // Import necessary types
import { Facebook, Twitter, Linkedin, Instagram, Youtube, ChevronRight } from 'lucide-react';
import { buildCroppedImageUrl, urlFor } from '@/lib/sanityImage';
import Link from 'next/link';

const Footer: React.FC = () => {
    const [footerData, setFooterData] = useState<FooterData | null>(null);

    useEffect(() => {
        const fetchFooterData = async () => {
            const data = await getFooterData();
            setFooterData(data);
            console.log(data)
        };

        fetchFooterData();
    }, []);

    if (!footerData) return <div>Loading...</div>;

    return (
        <footer className="bg-white pt-10 text-gray-800">
            <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 md:col-span-6">
                    <h2 className="text-2xl font-bold mb-2">
                        {footerData?.logo ? (
                            <img
                                src={footerData.logo?.crop ? buildCroppedImageUrl(footerData.logo.asset.url , footerData.logo.crop) : footerData.logo.asset.url}
                                alt={footerData.logo.alt || 'Logo'}
                                width="130px"
                            />
                        ) : null}

                    </h2>


                    <p className="text-sm mb-4">{footerData.aboutText}</p>
                    <div className="flex space-x-3">
                        {footerData.socialLinks.map((link: SocialLink, i: number) => (
                            <Link
                                key={i}
                                href={link.url}
                                target={link.linkTarget}
                                className="border p-3 rounded hover:bg-gray-600 hover:text-white"
                            >
                                {link.platform === 'Facebook' && <Facebook size={16} />}
                                {link.platform === 'Twitter' && <Twitter size={16} />}
                                {link.platform === 'Linkedin' && <Linkedin size={16} />}
                                {link.platform === 'Instagram' && <Instagram size={16} />}
                                {link.platform === 'Youtube' && <Youtube size={16} />}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-6 md:col-span-6">
                    <h3 className="text-xl font-semibold mb-3">Categories</h3>
                    <div className="flex flex-wrap">
                        {footerData.categories.map((cat: Category, i: number) => (
                            <Link
                                key={i}
                                target={cat.linkTarget}
                                href={cat.url}
                                className="text-sm border border-gray-400 rounded px-2 py-1 m-1 hover:bg-gray-100"
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3 md:col-span-6">
                    <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        {footerData.quickLinks.map((link: QuickLink, i: number) => (
                            <li key={i}>
                                <Link href={link.url} target={link.linkTarget} className="hover:underline flex">
                                    <span className="mr-2"><ChevronRight size={16} /></span>{link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="text-center text-sm py-4 bg-[#f2f2f2] mt-6">
                &copy; {new Date().getFullYear()} {footerData.copyright}
            </div>
        </footer>
    );
};

export default Footer;
