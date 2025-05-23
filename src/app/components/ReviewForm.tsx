'use client';

import { useState } from 'react';

const SubmitReviewForm = () => {
    const [formData, setFormData] = useState({
        user_name: '',
        stars: '5',
        details: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitted Review:', formData);
        // You can replace this with actual API submission
    };

    return (
        <div className="mt-12">
            <div className="mb-6">
                <h4 className="text-2xl font-semibold">Submit Your Review</h4>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white  rounded-lg ">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (optional)</label>
                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        placeholder="Name or leave blank"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className='col-span-2'>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
                    <select
                        name="stars"
                        value={formData.stars}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="5">★★★★★ (5)</option>
                        <option value="4">★★★★☆ (4)</option>
                        <option value="3">★★★☆☆ (3)</option>
                        <option value="2">★★☆☆☆ (2)</option>
                        <option value="1">★☆☆☆☆ (1)</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                    <textarea
                        name="details"
                        rows={4}
                        value={formData.details}
                        onChange={handleChange}
                        required
                        placeholder="Write your review..."
                        className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Submit Review
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitReviewForm;
