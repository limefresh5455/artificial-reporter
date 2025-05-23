'use client';

import { useState } from 'react';

const SubmitReviewForm = ({ productId, onSubmitSuccess }: { productId: any, onSubmitSuccess?: () => void }) => {
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        stars: '5',
        details: '',
    });
    const [message, setMessage] = useState<string>('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.user_name,
                    email: formData.user_email,
                    stars: formData.stars,
                    details: formData.details,
                    productId: productId, // Replace with actual product ID dynamically
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Review submitted successfully!');
                setFormData({ user_name: '', user_email: '', stars: '5', details: '' });
                if (onSubmitSuccess) {
                    onSubmitSuccess();  // call the function if passed
                }
            } else {
                setMessage('Failed to submit review: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setMessage('Error submitting review');
        }
    };

    return (
        <div className="mt-12">
            <div className="mb-6">
                <h4 className="text-2xl font-semibold">Submit Your Review</h4>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg p-6"
            >
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="col-span-2">
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
                {message}
            </form>
        </div>
    );
};

export default SubmitReviewForm;
