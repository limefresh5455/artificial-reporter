"use client"; // Only if using App Router in Next.js 13+

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"; // or 'next/navigation' for App Router

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded flex items-center gap-2 mb-5"
        >
            <ArrowLeft size={16} /> Back
        </button>
    );
}
