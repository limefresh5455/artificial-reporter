'use client';

import { getTags, getInsights } from '@/lib/sanity';
import { useEffect, useState } from 'react';
import { ROUTES } from '../routes';
import { urlFor } from '@/lib/sanityImage';
import Link from 'next/link';


const InsightsTags: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const topTagsData = await getTags();
                const topInsightsData = await getInsights();
                setData({ tags: topTagsData, insight: topInsightsData });

            } catch (err) {
                console.error('Failed to fetch top tags:', err);
                setError('Failed to load top tags');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    console.log(data)

    const tags = [
        "Business", "Corporate", "Sports", "Health", "Education",
        "Science", "Technology", "Foods", "Entertainment", "Travel", "Lifestyle",
        "AI", "Machine Learning", "Tech", "Jobs", "Ethics"
    ];
    return (
        <div className="">
            <div className="">
                <div className="flex items-center justify-between bg-light py-3 px-4 mb-3 bgh3">
                    <h3 className="text-2xl font-medium">Insights</h3>
                    <Link className="text-secondary font-medium" href={ROUTES.INSIGHT}>
                        {"View All"}
                    </Link>
                </div>
                <ul className="space-y-3">
                    {data?.insight?.map((item: any) => (
                        <li key={item._id} className="flex items-center gap-3 bg-white">
                            <img src={urlFor(item.image.asset).url()} alt="thumb" className="w-16 h-16 object-contain" />
                            <Link href={ROUTES.INSIGHT+ item.slug.current} className="text-sm font-medium leading-snug">{item.title}</Link>
                        </li>
                    ))}
                </ul>

            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between bg-light py-3 px-4 mb-3 bgh3">
                    <h3 className="text-2xl font-medium">Tags</h3>

                </div>

                <div className="flex flex-wrap gap-2">
                    {data?.tags?.map((tag: any) => (
                        <Link href={`${ROUTES.NEWS}?tag=${tag.slug?.current}`} key={tag._id} className="text-xs border-[1px] rounded-sm border-[gray] px-3 py-2 hover:bg-[#6c757d] hover:text-white">{tag.title}</Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InsightsTags;
