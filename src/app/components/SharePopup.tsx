import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Facebook, Twitter, Copy } from 'lucide-react';

type SharePopupProps = {
    platformUrl: string;
};

export default function SharePopup({ platformUrl }: SharePopupProps) {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    const togglePopup = () => setShowPopup(!showPopup);

    const shareUrl = platformUrl;

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        setShowPopup(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block">
            <button
                onClick={togglePopup}
                className="apply-btn px-5 py-1 rounded-2xl inline-flex items-center gap-2"
            >
                Share <ExternalLink size={16} />
            </button>

            {showPopup && (
                <div
                    ref={popupRef}
                    className="absolute z-10 mt-2 right-0 w-48 bg-white shadow-md border border-gray-200 rounded-xl p-2"
                >
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                    >
                        <Facebook size={16} /> Facebook
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                    >
                        <Twitter size={16} /> Twitter
                    </a>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 w-full rounded"
                    >
                        <Copy size={16} /> Copy Link
                    </button>
                </div>
            )}
        </div>
    );
}
