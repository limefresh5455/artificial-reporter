'use client';

import React, { useEffect, useState } from "react";
import { Search, CircleUserRound } from "lucide-react";
import TrendingSlider from "./TrendingSlider";
import { getNavigationData, NavigationData, MenuItem } from "@/lib/sanity";
import Link from 'next/link';
import { ROUTES } from '../routes';
import { signOut } from '@/lib/supabase/action';
import { useAuth } from "@/context/AuthContext";

const Header: React.FC = () => {
    const [navigation, setNavigation] = useState<NavigationData | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser } = useAuth();

    console.log(isOpen)
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
        setIsOpen(false)
    };

    return (
        <header className="w-full bg-white border-b border-gray-200">
            {/* Top bar */}
            <div className="flex items-center justify-between text-sm px-20 py-2 border-b border-gray-100">
                <TrendingSlider />

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Keyword"
                            className="border border-gray-300 rounded-sm pl-2 pr-8 py-1 text-sm focus:outline-none"
                        />
                        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    </div>
                    <a href="#" className="text-gray-600 hover:underline m-0">Sponsors</a>
                    <span className="text-gray-400 mx-2">|</span>
                    <a href="#" className="text-gray-600 hover:underline m-0">AI</a>
                    <span className="text-gray-400 mx-2">|</span>

                    {user == null ? (
                        <>
                            <Link href={ROUTES.LOGIN} className="text-gray-600 hover:underline m-0">Login</Link>
                            <span className="text-gray-400 mx-2">|</span>
                            <Link href={ROUTES.REGISTER} className="text-gray-600 hover:underline m-0">Register</Link>
                        </>
                    ) : (
                        <div className="flex relative text-left">
                            <button
                                type="button"
                                className="font-semibold text-gray-900 shadow-xs hover:bg-gray-50"
                                id="menu-button"
                                aria-expanded={isOpen}
                                aria-haspopup="true"
                                onClick={toggleDropdown}
                            >
                                <CircleUserRound className="text-gray-700" />
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                    <div className="py-1" role="none">
                                        <button
                                            type="submit"
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                                            role="menuitem"
                                            onClick={handleLogout}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Logo + Ad */}
            <div className="lg:grid lg:grid-cols-12 gap-6 bg-[#12498b] px-20 py-2">
                <div className="lg:col-span-4 text-white font-bold text-4xl pt-4">
                    <Link href={ROUTES.HOME}>LOGO</Link>
                </div>
                <div className="lg:col-span-8">
                    <img
                        src="https://odeskthemes.com/10/news-portal/assets/img/ad-1.png"
                        alt="Feature"
                        className="float-right"
                    />
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex justify-center py-5 bg-white text-base font-medium text-black">
                <div className="flex items-center divide-x divide-gray-300 text-base">
                    {navigation?.menuItems?.map((item: MenuItem) => (
                        item.dropdown && item.dropdown.length > 0 ? (
                            <div key={item._key} className="relative group px-4">
                                <button className={`hover:text-[#12498b] ${item.highlight ? 'text-[#12498b] font-semibold' : ''}`}>
                                    {item.title} ▾
                                </button>
                                <div className="hidden group-hover:block absolute top-full left-0 bg-white shadow-md rounded border mt-1 z-50">
                                    {item.dropdown.map((subItem) => (
                                        <a
                                            key={subItem._key}
                                            href="#"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            {subItem.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <a
                                key={item._key}
                                href="#"
                                className={`px-4 hover:text-[#12498b] ${item.highlight ? 'text-[#12498b] font-semibold' : ''}`}
                            >
                                {item.title}
                            </a>
                        )
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;
