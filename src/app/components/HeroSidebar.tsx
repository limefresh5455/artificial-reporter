'use client';

import React, { useEffect, useState } from "react";
import { getImageBlocks, ImageBlock } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage";
import Link from "next/link";

const HeroSidebar: React.FC = () => {
  const [items, setItems] = useState<ImageBlock[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getImageBlocks();
      setItems(data);
      console.log(data)
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-3.5">
      {items.map((item) => (
        <div key={item._id} className="relative h-31 overflow-hidden">
          <img
            src={urlFor(item.image.asset).url()}
            alt={item.alt || item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              href=""
              className="overlay text-white font-semibold text-lg"
            >
              <span className="z-2 relative">{item.title}</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroSidebar;
