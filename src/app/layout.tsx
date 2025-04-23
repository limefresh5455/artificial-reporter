import type { Metadata } from "next";
import { Poppins } from "next/font/google"; 
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins", 
  weight: ["400", "500", "600"], 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home || Artificial Reporter",
  description: "News, Jobs, Company Directory, Job Postings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {children}
      </body>
    </html>
  );
}
