"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTrendingData } from "@/lib/sanity";

interface TrendingItem {
  _key: string;
  title: string;
  slug: string; // updated from { current: string } to string
}

const TrendingSlider: React.FC = () => {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        const trendingData = await getTrendingData();
        if (trendingData?.items?.length) {
          setItems(trendingData.items);
          console.log("items", trendingData )
        } else {
          setError("No items available in trending data");
        }
      } catch (error) {
        setError("Failed to load trending items");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingItems();
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (Math.abs(deltaX) > 50) {
        deltaX > 0 ? handleNext() : handlePrev();
      }
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading trending items...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!items.length) return <div className="text-sm text-gray-500">No trending items available.</div>;

  return (
    <div
      className="flex items-center space-x-3 text-sm"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <span className="font-semibold text-gray-700">Trending</span>
      <div className="flex gap-3">
        <button
          className="bg-[#134c90] text-white px-2 py-2 rounded hover:bg-[#0d3a6d] transition-colors"
          onClick={handlePrev}
          aria-label="Previous trending item"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className="bg-[#134c90] text-white px-2 py-2 rounded hover:bg-[#0d3a6d] transition-colors"
          onClick={handleNext}
          aria-label="Next trending item"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
        <a
          href={`/${items[current]?.slug || "#"}`} // updated to use string
          className="hover:underline"
        //   target="_blank"
          rel="noopener noreferrer"
        >
          {items[current]?.title || "No title available"}
        </a>
      </div>
    </div>
  );
};

export default TrendingSlider;
