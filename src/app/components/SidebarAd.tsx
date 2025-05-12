'use client';

import { useEffect, useState } from 'react';
import { getActiveSidebarAd } from "@/lib/sanity";

const SidebarAd: React.FC = () => {
 
  const [sidebarAd, setSidebarAd] = useState<null | {
    title: string;
    link: string;
    alt: string;
    imageUrl: string;
  }>(null);

  useEffect(() => {
    const fetchAd = async () => {
      const ad = await getActiveSidebarAd();      
      setSidebarAd(ad);
    };
    fetchAd();
  }, []);
  

  return (   
      <div className="flex my-6">       
        {sidebarAd ? (
            <a href={sidebarAd.link} target="_blank" rel="noopener noreferrer">
            <img src={sidebarAd.imageUrl} alt={sidebarAd.alt} className="float-right" />
            </a>
        ) : null}        
      </div>    
  );
};

export default SidebarAd;
