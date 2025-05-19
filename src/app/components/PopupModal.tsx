"use client";

import React, { useEffect, useState } from "react";
import { getPopup } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage"; // Make sure this utility works correctly
import Link from "next/link";

const PopupModal = () => {
    const [popupList, setPopupList] = useState<any[]>([]);
    const [currentPopup, setCurrentPopup] = useState<any>(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const hasShown = sessionStorage.getItem("subscribePopupShown");

            if (hasShown) {
                const data = await getPopup();
                if (data && data.length > 0) {
                    setPopupList(data);

                    const randomIndex = Math.floor(Math.random() * data.length);
                    setCurrentPopup(data[randomIndex]);

                    setShowPopup(true);
                    sessionStorage.setItem("subscribePopupShown", "true");
                }
            }
        };

        fetchData();
    }, []);

    const handleClose = () => {
        setShowPopup(false);
    };

    if (!showPopup || !currentPopup) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0" style={{marginTop:0}}>
            <div className="relative w-full max-w-lg mx-auto rounded-lg shadow-lg p-6  overflow-hidden animate-slide-up ">
                <style jsx>{`
          @keyframes slideUp {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0%);
              opacity: 1;
            }
          }
          .animate-slide-up {
            animation: slideUp 0.5s ease-out forwards;
          }
        `}</style>

                <button
                    onClick={handleClose}
                    className="absolute top-[-5px] right-6 text-white text-2xl leading-none"
                >
                    ×
                </button>

                <span className="absolute top-[-10px] left-50 m-2 text-xs text-white px-2 py-1 rounded capitalize">
                    {currentPopup.type || "Advertisement"}
                </span>

                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full flex justify-center">
                        {currentPopup.image && (
                            <Link href={currentPopup.slug.current}>
                            <img
                                src={urlFor(currentPopup.image).url()}
                                alt={currentPopup.title || "Popup"}
                                className="w-full max-h-[500px] object-contain"
                            />
</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupModal;
