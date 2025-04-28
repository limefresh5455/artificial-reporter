'use client';

import Link from 'next/link';
import { ROUTES } from '../../routes';
import { login } from '@/lib/supabase/action';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            setError(result.error.message);
            setLoading(false);
            return;
        }

        // Explicitly refresh session to ensure client-side sync
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            setError('Failed to sync user session. Please try again.');
            setLoading(false);
            return;
        }

        // Redirect to home after confirming session

        router.replace(ROUTES.HOME);
        setLoading(false);
    };

    return (
        <section className="login">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1">
                    <div className="login_inner grid grid-cols-2 md:grid-cols-2 bg-gray-100">
                        <div className="image-section">
                            <img
                                src="https://odeskthemes.com/10/news-portal/assets/img/img-7.jpg"
                                alt="Login Illustration"
                                className="w-full"
                            />
                        </div>
                        <div className="login-section p-6">
                            <div className="login-header mb-6">
                                <h2 className="section_heading">Log In</h2>
                            </div>
                            <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email" className="block mb-1">
                                        Corporate Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="block mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}

                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#134c90] text-white px-4 py-2 rounded hover:bg-[#d21118]"
                                    >
                                        {loading ? 'Logging in...' : 'SUBMIT'}
                                    </button>
                                    <div className="forgot-password ml-4">
                                        <a href="#" className="text-[#134c90] hover:underline">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>
                            </form>
                            <div className="create-account text-center mt-6">
                                Don't have an account?{' '}
                                <Link href={ROUTES.REGISTER} className="text-[#134c90] hover:underline m-0">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}