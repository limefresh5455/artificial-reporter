"use client";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { userMetaSelect } from '@/lib/supabase/action';
import { createClient } from '@/lib/supabase/client';
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ROUTES } from "./routes";
import { AuthProvider } from "@/context/AuthContext"



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
        // const tailwindLink = document.createElement('link');
        // tailwindLink.rel = 'stylesheet';
        // tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        // document.head.appendChild(tailwindLink);
        // checkUser();
    }, []);

    return (
        <html lang="en">
            <head>
                <Script
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=G-9K8H9311HB"
                />
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', 'G-9K8H9311HB', {
                            page_path: window.location.pathname,
                          });
                        `
                    }}
                />
                <Script
                    src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"
                    strategy="afterInteractive"
                />

                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>

            </head>
            <body
                className={`${poppins.variable} antialiased`}
            >
                <AuthProvider>
                    <div className="min-h-screen flex flex-col font-poppins">
                        <Header />
                        <main className="flex-1 container mx-auto px-5 lg:px-20 py-6 space-y-10">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
