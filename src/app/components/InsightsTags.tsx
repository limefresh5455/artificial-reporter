'use client';

import { getTags } from '@/lib/sanity';
import { useEffect, useState } from 'react';
import { ROUTES } from '../routes';


const InsightsTags: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const topTagsData = await getTags();
                setData(topTagsData);
                console.log(topTagsData)
            } catch (err) {
                console.error('Failed to fetch top tags:', err);
                setError('Failed to load top tags');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


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
                </div>
                <ul className="space-y-3">
                    {[
                        {
                            id: 1,
                            image: "https://odeskthemes.com/10/news-portal/assets/img/2149611193.jpg",
                            title: "Lorem ipsum dolor sit amet consec adipis elit",
                        },
                        {
                            id: 2,
                            image: "https://odeskthemes.com/10/news-portal/assets/img/2149611193.jpg",
                            title: "Lorem ipsum dolor sit amet consec adipis elit",
                        },
                        {
                            id: 3,
                            image: "https://odeskthemes.com/10/news-portal/assets/img/2149611193.jpg",
                            title: "Lorem ipsum dolor sit amet consec adipis elit",
                        },
                        {
                            id: 4,
                            image: "https://odeskthemes.com/10/news-portal/assets/img/2149611193.jpg",
                            title: "Lorem ipsum dolor sit amet consec adipis elit",
                        },
                        {
                            id: 5,
                            image: "https://odeskthemes.com/10/news-portal/assets/img/2149611193.jpg",
                            title: "Lorem ipsum dolor sit amet consec adipis elit",
                        },
                    ].map((item) => (
                        <li key={item.id} className="flex items-center gap-3 bg-white">
                            <img src={item.image} alt="thumb" className="w-16 h-16 object-cover" />
                            <p className="text-sm font-medium leading-snug">{item.title}</p>
                        </li>
                    ))}
                </ul>

            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between bg-light py-3 px-4 mb-3 bgh3">
                    <h3 className="text-2xl font-medium">Tags</h3>

                </div>

                <div className="flex flex-wrap gap-2">
                    {data?.map((tag: any) => (
                        <a href={`${ROUTES.NEWS}?tag=${tag.slug.current}`} key={tag._id} className="text-xs border-[1px] rounded-sm border-[gray] px-3 py-2 hover:bg-[#6c757d] hover:text-white">{tag.title}</a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InsightsTags;
