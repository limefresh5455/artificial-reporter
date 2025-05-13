'use client';

import React, { useEffect, useState } from 'react';
import { getPopular, HomeNewsData } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/client';
import { ROUTES } from '../routes';
import Link from 'next/link';


const builder = imageUrlBuilder(client);

const Popular: React.FC = () => {
  const [popularData, setPopularData] = useState<HomeNewsData | null>(null);

 
  useEffect(() => {
    const fetchPopularData = async () => {
      const data = await getPopular();
      setPopularData(data);
    };
    
    fetchPopularData();
  }, []);

  if (!popularData) {
    return ''; 
  }

  
  const urlFor = (source: any) => {
    if (source) {
      return builder.image(source).auto('format').url(); 
    }
    return ''; 
  };

  return (
    <div className="">
      <div className="flex items-center justify-between bg-light py-3 px-4 mb-3 bgh3">
        <h3 className="text-2xl font-medium">{popularData.mainTitle}</h3>
        <Link className="text-secondary font-medium" href={popularData.viewAllLink}>
          {popularData.viewAllLinkText || "View All"}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div>
          <div className="block lg:flex gap-6">
            {popularData.relatedArticles?.slice(0, 2)?.map((story) => (
              <div key={story._id} className="overflow-hidden mb-4">
                <img
                  src={urlFor(story.image)} 
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-white">
                 
                  {story.slug ? (
                    <Link
                      href={`${ROUTES.NEWS}${story.newsCategory?.value.current}/${story.slug.current}`}
                      className="text-xl font-bold leading-snug mb-2"
                      style={{ zIndex: 20 }}
                    >
                      {story.title}
                    </Link>
                  ) : (
                    <h4 className="text-xl font-bold leading-snug mb-2">
                    {story.title}
                  </h4>
                  )}
                  <p className="text-gray-600 text-sm">                   
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {popularData.relatedArticles?.slice(2, 6)?.map((story) => (
              <div key={story._id+ Math.random()} className="flex items-center mb-3 bg-white w-90 popularWrap">
                <img
                  src={urlFor(story.image)} 
                  alt={story.title}
                  className="w-20 h-16 object-cover"
                />                
                  {story.slug ? (
                    <Link
                      href={`${ROUTES.NEWS}${story.newsCategory?.value.current}/${story.slug.current}`}
                      className="text-sm font-medium py-3 px-4"
                      style={{ zIndex: 20 }}
                    >
                      {story.title}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium py-3 px-4">
                  {story.title}
                  </p>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popular;