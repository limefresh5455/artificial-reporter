'use client';

import React, { useEffect, useState } from "react";
import { Search, CircleUserRound, Menu, Building2 } from "lucide-react";
import TrendingSlider from "./TrendingSlider";
import { getNavigationData, NavigationData, MenuItem, getSearchResult } from "@/lib/sanity";
import Link from 'next/link';
import { ROUTES } from '../routes';
import { signOut } from '@/lib/supabase/action';
import { useAuth } from "@/context/AuthContext";
import { buildCroppedImageUrl, urlFor } from "@/lib/sanityImage";
import HeaderAd from "./HeaderAd";

const Header: React.FC = () => {
    const [navigation, setNavigation] = useState<NavigationData | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, setUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const navData = await getNavigationData();
            setNavigation(navData);
        };
        fetchData();
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await signOut();
        setUser(null);
        setIsOpen(false);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const data = await getSearchResult(searchQuery);
            setSearchResults(data);
        } catch (err) {
            console.error('Search error', err);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim()) {
                getSearchResult(searchQuery).then(setSearchResults).catch(console.error);
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const getHref = (item: any) => {
        if (item._type === "page") return `/${item.slug.current}`;
        if (item._type === "newsArticle") return `${ROUTES.NEWS}${item.newsCategory?.value.current}/${item.slug.current}`;
        if (item._type === "insight") return `${ROUTES.INSIGHT}${item.slug.current}`;
        if (item._type === "newsCategory") return `${ROUTES.NEWS}${item?.value?.current}`;
        if (item._type === "jobListing") return `${ROUTES.JOBS}`;
        if (item._type === "aiCompany") return `${ROUTES.COMPANIES}${item?.slug?.current}`;
        if (item._type === "podcastEpisode") return `${ROUTES.ALLPODCASTS}`;
        return `/${item.slug.current}`;
    };

    return (
        <header className="w-full bg-white border-b border-gray-200">
            {/* Top bar */}
            <div className="flex flex-col justify-start lg:flex-row lg:justify-between text-sm px-4 lg:px-20 py-2 border-b border-gray-100">
                <TrendingSlider />
                <div className="lg:flex items-center text-center lg:text-right space-x-4 mt-4 lg:mt-0">
                    {/* Desktop search bar */}
                    <div className="hidden lg:block relative mb-0">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-300 rounded-sm pl-2 pr-8 py-1 text-sm focus:outline-none w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Search
                            className="srchIcon absolute right-0 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                            size={16}
                            onClick={handleSearch}
                        />
                        {searchQuery && searchResults.length > 0 && (
                            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-md z-50 max-h-60 overflow-y-auto">
                                {['page', 'newsArticle', 'insight', 'newsCategory', 'jobListing', 'aiCompany', 'podcastEpisode'].map(type => {
                                    const groupItems = searchResults.filter(i => i._type === type);
                                    if (!groupItems.length) return null;
                                    const groupTitle = {
                                        page: 'Pages',
                                        newsArticle: 'News',
                                        insight: 'Insights',
                                        newsCategory: 'Category',
                                        jobListing: 'Jobs',
                                        aiCompany: 'Companies',
                                        podcastEpisode: 'Podcasts',
                                    }[type];
                                    return (
                                        <div key={type}>
                                            <div className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">{groupTitle}</div>
                                            {groupItems.map(item => (
                                                <Link
                                                    key={item._id}
                                                    href={getHref(item)}
                                                    className="text-left flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-sm text-black"
                                                    onClick={() => {setMobileMenuOpen(false); setSearchQuery('')}}
                                                >
                                                    {item.image && <img src={urlFor(item.image).url()} alt={item.title} className="w-8 h-8 object-cover rounded" />}

                                                    {item.coverImage && <img src={urlFor(item.coverImage).url()} alt={item.title} className="w-8 h-8 object-cover rounded" />}


                                                    {item._type == "aiCompany" ? item?.logo ?
                                                        (<img
                                                            src={item?.logo && urlFor(item?.logo.asset).url()}
                                                            alt="Company Logo"
                                                            className="w-12 h-12 rounded-md object-contain"
                                                        />) :
                                                        <Building2 size={20} /> : ''
                                                    }

                                                    <span>{item?.title}</span>
                                                    <span>{item?.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <Link href={ROUTES.SPONSORS} className="text-gray-600 hover:underline">Sponsors</Link>

                    <span className="text-gray-400">|</span>
                    {user == null ? (
                        <>
                            <Link href={ROUTES.LOGIN} className="text-gray-600 hover:underline">Login</Link>
                            <span className="text-gray-400">|</span>
                            <Link href={ROUTES.REGISTER} className="text-gray-600 hover:underline">Register</Link>
                        </>
                    ) : (
                        <div className="relative">
                            <button onClick={toggleDropdown} className="text-gray-700"><CircleUserRound /></button>
                            {isOpen && (
                                <div className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                                    <div className="py-1">
                                        <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-gray-700">Sign out</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile logo and menu */}
            <div className="block lg:hidden mx-auto w-96">
                <HeaderAd />
            </div>
            <div className="h-4 block lg:hidden"></div>

            <div className={`flex lg:hidden flex-wrap items-center justify-between px-4 md:px-20 py-4 bg-[${navigation?.bannerBgColor?.value?.hex}]`}>
                <div className="lg:col-span-4 text-white font-bold text-4xl">
                    <Link href={ROUTES.HOME}>
                        {navigation?.logo?.image?.crop && navigation?.logo?.imageUrl ? (
                            <img src={buildCroppedImageUrl(navigation.logo.imageUrl, navigation.logo.image.crop)} alt={navigation.logo.alt || 'Logo'} width="130px" />
                        ) : navigation?.logo?.imageUrl ? (
                            <img src={navigation.logo.imageUrl} alt={navigation.logo.alt || 'Logo'} width="130px" />
                        ) : null}
                    </Link>
                </div>
                <div className="">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white focus:outline-none">
                        <Menu className="w-8 h-8" />
                    </button>
                </div>
            </div>

            {/* Accordion-style Mobile Menu */}
            <div className={`w-full overflow-hidden transition-all bg-black duration-300 ease-in-out lg:hidden px-4 ${mobileMenuOpen ? 'max-h-[800px] py-4' : 'max-h-0'}`}>
                <div className="space-y-2">
                    {navigation?.menuItems?.map((item: MenuItem) => (
                        <div key={item._key}>
                            <Link href={item.url || "#"} className={`block py-2 px-0 text-sm text-white hover:text-[#fff] ${item.highlight ? 'text-[#fff] font-semibold' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                                {item.title}
                            </Link>
                            {Array.isArray(item.dropdown) && item.dropdown.length > 0 && (
                                <div className="ml-4 space-y-1">
                                    {item.dropdown.map(sub => (
                                        <Link key={sub._key} href={item.url || "#"} className="block py-1 px-2 text-sm text-white hover:text-[#fff]" onClick={() => setMobileMenuOpen(false)}>
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="relative mt-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-white border border-gray-300 rounded-lg pl-2 pr-8 py-1 text-sm focus:outline-none w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Search
                        className="absolute right-2 top-6 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={16}
                        onClick={handleSearch}
                    />
                    {searchQuery && searchResults.length > 0 && (
                        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-md z-50 max-h-60 overflow-y-auto">
                            {['page', 'newsArticle', 'insight', 'newsCategory', 'jobListing'].map(type => {
                                const groupItems = searchResults.filter(i => i._type === type);
                                if (!groupItems.length) return null;
                                const groupTitle = {
                                    page: 'Pages',
                                    newsArticle: 'News',
                                    insight: 'Insights',
                                    newsCategory: 'Category',
                                    jobListing: 'Jobs'
                                }[type];
                                return (
                                    <div key={type}>
                                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">{groupTitle}</div>
                                        {groupItems.map(item => (
                                            <Link
                                                key={item._id}
                                                href={getHref(item)}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-sm text-black"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.image && <img src={urlFor(item.image).url()} alt={item.title} className="w-8 h-8 object-cover rounded" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop header */}
            <div className={`hidden lg:grid lg:grid-cols-12 gap-6 px-2 lg:px-20 py-2 bg-[${navigation?.bannerBgColor?.value?.hex}]`}>
                <div className="lg:col-span-4 text-white font-bold text-4xl pt-2">
                    <Link href={ROUTES.HOME}>
                        {navigation?.logo?.image?.crop && navigation?.logo?.imageUrl ? (
                            <img src={buildCroppedImageUrl(navigation.logo.imageUrl, navigation.logo.image.crop)} alt={navigation.logo.alt || 'Logo'} width="130px" />
                        ) : navigation?.logo?.imageUrl ? (
                            <img src={navigation.logo.imageUrl} alt={navigation.logo.alt || 'Logo'} width="130px" />
                        ) : null}
                    </Link>
                </div>
                <div className="hidden lg:block lg:col-span-8">
                    <HeaderAd />
                </div>

            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex justify-center py-5 bg-white text-base font-medium text-black">
                <div className="flex items-center divide-x divide-gray-300 text-base">
                    {navigation?.menuItems?.map((item: MenuItem) => (
                        Array.isArray(item.dropdown) && item.dropdown.length > 0 ? (
                            <div key={item._key} className="relative group px-4">
                                <Link href={item.url || "#"} className={`hover:text-[#12498b] ${item.highlight ? 'text-[#12498b] font-semibold' : ''}`}>{item.title} ▾</Link>
                                <div className="hidden group-hover:block absolute top-full left-0 bg-white shadow-md rounded border mt-1 z-50">
                                    {item.dropdown.map(subItem => (
                                        <Link key={subItem._key} href={item.url || "#"} className="block px-4 py-2 text-sm hover:bg-gray-100">{subItem.title}</Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Link key={item._key} href={item.url || "#"} className={`px-4 hover:text-[#12498b] ${item.highlight ? 'text-[#12498b] font-semibold' : ''}`}>{item.title}</Link>
                        )
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;
