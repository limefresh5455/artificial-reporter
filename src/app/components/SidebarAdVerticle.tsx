'use client';

import { useEffect, useState } from 'react';
import { getActiveSidebarAdVerticle } from "@/lib/sanity";

const SidebarAdVerticle: React.FC = () => {
 
  const [sidebarAdVerticle, setSidebarAdVerticle] = useState<null | {
    title: string;
    link: string;
    alt: string;
    imageUrl: string;
  }>(null);

  useEffect(() => {
    const fetchAd = async () => {
      const ad = await getActiveSidebarAdVerticle();      
      setSidebarAdVerticle(ad);
    };
    fetchAd();
  }, []);
  

  return (   
      <div className="flex my-6">       
        {sidebarAdVerticle ? (
            <a href={sidebarAdVerticle.link} target="_blank" rel="noopener noreferrer">
            <img src={sidebarAdVerticle.imageUrl} alt={sidebarAdVerticle.alt} className="float-right" />
            </a>
        ) : null}        
      </div>    
  );
};

export default SidebarAdVerticle;
