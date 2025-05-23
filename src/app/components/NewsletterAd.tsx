'use client';

import { useEffect, useState } from 'react';
import { newsLetterSignUp } from "@/lib/supabase/action";
import { getNewsLetter } from '@/lib/sanity';

const NewsletterAd: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [data, setData] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getNewsLetter();
            setData(response)
        }
        fetchData();

    },[])
    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setStatus('Please enter an email.');
            return;
        }

        if (!isValidEmail(email)) {
            setStatus('Please enter a valid email address.');
            return;
        }

        try {
            const response = await newsLetterSignUp([{ email }]);

            if (response.error) {
                console.error('Insert error:', response.error);
                setStatus('Something went wrong. Please try again.');
            } else {
                setStatus('Thank you for subscribing!');
                setEmail('');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setStatus('Unexpected error occurred.');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between bg-light py-3 px-4 mb-0 bgh3">
                <h3 className="text-2xl font-medium">{data?.title}</h3>
            </div>

            <div className="bg-white py-5">
                <p className="p-4 pt-0">{data?.description}</p>

                <form onSubmit={handleSubmit} className="flex px-4 py-1 pt-0">
                    <div className="input-group w-100 flex">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control form-control-lg border-[1px] pl-3 border-gray-200 w-[200px]"
                            placeholder="Your Email"
                        />
                        <div className="input-group-append">
                            <button type="submit" className="btn-primary btnsign">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </form>

                {status && <p className="text-sm text-gray-600 px-4 pt-2">{status}</p>}
            </div>

        </div>
    );
};

export default NewsletterAd;
