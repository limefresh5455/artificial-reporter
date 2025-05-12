'use client';

import { useEffect, useState } from 'react';
import { getActiveHeaderAd } from "@/lib/sanity";

const HeaderAd: React.FC = () => {
 
    const [headerAd, setHeaderAd] = useState<null | {
        title: string;
        link: string;
        alt: string;
        imageUrl: string;
      }>(null);
      
      useEffect(() => {
        const fetchAd = async () => {
          const ad = await getActiveHeaderAd();
          setHeaderAd(ad);
        };
        fetchAd();
      }, []);
  

  return (   
      <div className="flex">       
        {headerAd ? (
            <a href={headerAd.link} target="_blank" rel="noopener noreferrer">
            <img src={headerAd.imageUrl} alt={headerAd.alt} className="float-right" />
            </a>
        ) : null}        
      </div>    
  );
};

export default HeaderAd;
