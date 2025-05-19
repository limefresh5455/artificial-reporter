"use client";

import React, { useEffect, useState } from "react";

const PopupModal = () => {
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        const hasShown = sessionStorage.getItem("subscribePopupShown");
        if (!hasShown) {
            setShowPopup(true);
            sessionStorage.setItem("subscribePopupShown", "true");
        }
    }, []);

    const handleClose = () => {
        setShowPopup(false);
    };

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0" style={{marginTop:0}}>
            <div className="relative w-full max-w-lg mx-auto rounded-lg shadow-lg p-6 text-white overflow-hidden animate-slide-up">
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

                <span className="absolute top-[-10px] left-50 m-2 text-xs text-white px-2 py-1 rounded">
                    Advertisement
                </span>

                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full flex justify-center">
                        <img
                            src="https://odeskthemes.com/10/news-portal/assets/img/newsletter-ad.png"
                            alt="Subscribe"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupModal;