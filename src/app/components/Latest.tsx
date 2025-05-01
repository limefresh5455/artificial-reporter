'use client';

import React, { useEffect, useState } from 'react';
import { getLatest, HomeNewsData } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/client';
import { format } from 'date-fns';
import { PortableText } from '@portabletext/react';
import { ROUTES } from '../routes';

const builder = imageUrlBuilder(client);

// Helper function to extract plain text from PortableText blocks
const getPlainText = (blocks: any) => {
  if (!blocks) return '';
  return blocks
    .filter((block: any) => block._type === 'block' && block.children)
    .map((block: any) => block.children.map((child: any) => child.text).join(''))
    .join('\n\n');
};

const Latest: React.FC = () => {
  const [latestData, setLatestData] = useState<HomeNewsData | null>(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      const data = await getLatest();
      setLatestData(data);
    };

    fetchLatestData();
  }, []);

  const urlFor = (source: any) => {
    return source ? builder.image(source).auto('format').url() : '';
  };

  const formatDate = (dateString: string | undefined) => {
    try {
      return dateString ? format(new Date(dateString), 'MMMM dd, yyyy') : 'No date available';
    } catch {
      return 'Invalid date';
    }
  };

  if (!latestData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between bg-light py-3 px-4 mb-3 bgh3">
        <h3 className="text-2xl font-medium">{latestData.mainTitle}</h3>
        <a className="text-secondary font-medium" href={latestData.viewAllLink}>
          {latestData.viewAllLinkText || "View All"}
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex gap-6">
            {latestData.relatedArticles.slice(0, 2).map((story) => (
              <div key={story._id+Math.random()} className="overflow-hidden mb-4">
                <img
                  src={urlFor(story.image)}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 bg-white">
                  <div className="mb-2 text-base">
                    <a href="#" className="link-a">Technology</a>
                    <span className="px-1">/</span>
                    <span>{formatDate(story._createdAt || story._createdAt)}</span>
                  </div>
                 
                  {story.title ? (
                    <a
                      href={`${ROUTES.NEWS}${story.slug.current}`}
                      className="text-2xl font-bold leading-snug mb-2"
                      style={{ zIndex: 20 }}
                    >
                      {story.title}
                    </a>
                  ) : (
                    <span className="text-white text-lg font-semibold leading-tight">
                      {story.title}
                    </span>
                  )}

                  <div className="text-gray-600 text-base mt-2">
                    {story.overview && (
                      <p>
                        {story.overview.slice(0, 100)}
                        {story.overview.length > 100 && '...'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {latestData.relatedArticles.slice(2, 6).map((story) => (
              <div key={story._id+Math.random()} className="flex items-center mb-3 bg-white w-90">
                <img
                  src={urlFor(story.image)}
                  alt={story.title}
                  className="w-20 h-16 object-cover"
                />
                <div className="py-3 px-4">
                  <a href={`${ROUTES.NEWS}${story.slug.current}`} className="text-sm font-medium">{story.title}</a><br></br>
                  <span className="text-sm text-gray-500">
                    {formatDate(story._createdAt || story._createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Latest;