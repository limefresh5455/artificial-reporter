// 'use client';

// import Link from 'next/link';
// import { ROUTES } from '../../routes';
// import { updatePassword } from '@/lib/supabase/action';
// import { useState, FormEvent } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
// import { useAuth } from "@/context/AuthContext";

// export default function Login() {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const router = useRouter();
//     const supabase = createClient();
//     const { setUser } = useAuth();

//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         const formData = new FormData(e.currentTarget);
//         const result = await updatePassword(formData);

//         if (result?.error) {
//             setError(result.error.message);
//             setLoading(false);
//             return;
//         }

//         const { data: { user }, error: userError } = await supabase.auth.getUser();

//         if (userError || !user) {
//             setError('Failed to sync user session. Please try again.');
//             setLoading(false);
//             return;
//         }

//         setUser(user);
//         router.replace(ROUTES.HOME);
//         setLoading(false);
//     };

//     return (
//         <section className="login">
//             <div className="max-w-6xl mx-auto px-0 lg:px-4">
//                 <div className="grid grid-cols-1">
//                     <div className="login_inner grid grid-cols-2 md:grid-cols-2 bg-gray-100">
//                         <div className="image-section">
//                             <img
//                                 src="/login.jpg"
//                                 alt="Login Illustration"
//                                 className="w-full"
//                             />
//                         </div>
//                         <div className="login-section p-2 lg:p-6">
//                             <div className="login-header mb-6">
//                                 <h2 className="section_heading">Reset Password</h2>
//                             </div>
//                             <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
//                                 <div className="form-group">
//                                     <label htmlFor="password" className="block mb-1">
//                                         New Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         id="password"
//                                         name="password"
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded"
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <label htmlFor="password" className="block mb-1">
//                                         Confirm Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         id="password"
//                                         name="password"
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded"
//                                     />
//                                 </div>

//                                 {error && (
//                                     <p className="text-red-500 text-sm">{error}</p>
//                                 )}

//                                 <div className="flex justify-between items-center mb-6">
//                                     <button
//                                         type="submit"
//                                         disabled={loading}
//                                         className="bg-[#134c90] text-white px-4 py-2 rounded hover:bg-[#d21118]"
//                                     >
//                                         {loading ? 'Logging in...' : 'SUBMIT'}
//                                     </button>
                                    
//                                 </div>
//                             </form>
//                             <div className="create-account text-center mt-6">

//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }


'use client';

import Link from 'next/link';
import { ROUTES } from '../../routes';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from "@/context/AuthContext";
import { updatePassword } from '@/lib/supabase/action';


export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();
    const { setUser } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        const { data, error } = await updatePassword(password);
        // const { data, error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            setError('Failed to sync user session. Please try again.');
            setLoading(false);
            return;
        }

        setUser(userData.user);
        setSuccess("Password updated successfully. Redirecting...");
        setTimeout(() => router.replace(ROUTES.HOME), 2000);
        setLoading(false);
    };

    return (
        <section className="login">
            <div className="max-w-6xl mx-auto px-0 lg:px-4">
                <div className="grid grid-cols-1">
                    <div className="login_inner grid grid-cols-2 md:grid-cols-2 bg-gray-100">
                        <div className="image-section">
                            <img
                                src="/login.jpg"
                                alt="Login Illustration"
                                className="w-full"
                            />
                        </div>
                        <div className="login-section p-2 lg:p-6">
                            <div className="login-header mb-6">
                                <h2 className="section_heading">Reset Password</h2>
                            </div>
                            <form id="reset-form" className="space-y-4" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="password" className="block mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="block mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                {success && <p className="text-green-600 text-sm">{success}</p>}

                                <div className="flex justify-between items-center ">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#134c90] mb-12 text-white px-4 py-2 rounded hover:bg-[#d21118]"
                                    >
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
