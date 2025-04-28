"use client";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { userMetaSelect } from '@/lib/supabase/action';
import { createClient } from '@/lib/supabase/client';
import React, {  useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ROUTES } from "./routes";




const poppins = Poppins({
    variable: "--font-poppins",
    weight: ["400", "500", "600"],
    subsets: ["latin"],
});

// export const metadata: Metadata = {
//     title: "Home || Artificial Reporter",
//     description: "News, Jobs, Company Directory, Job Postings",
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                
                const userMetaResponse = await userMetaSelect(user.id);
                if (userMetaResponse.data) {
                    router.push(ROUTES.HOME);
                } 
            }
        };
        checkUser();
    }, []);

    return (
        <html lang="en">
            <head>
                <Script
                    src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"
                    strategy="afterInteractive"
                />
            </head>
            <body
                className={`${poppins.variable} antialiased`}
            >
                <div className="min-h-screen flex flex-col font-poppins">
                    <Header />
                    <main className="flex-1 container mx-auto px-20 py-6 space-y-10">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
