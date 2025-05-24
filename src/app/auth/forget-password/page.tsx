// 'use client';

// import Link from 'next/link';
// import { ROUTES } from '../../routes';
// import { resetPassword } from '@/lib/supabase/action';
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
//         console.log(e)
//         // const result = await resetPassword(formData);

//         // if (result?.error) {
//         //     setError(result.error.message);
//         //     setLoading(false);
//         //     return;
//         // }

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
//                                 <h2 className="section_heading">Forget Password</h2>
//                             </div>
//                             <form id="login-form" className="space-y-4" onSubmit={(e)=>handleSubmit(e)}>
//                                 <div className="form-group">
//                                     <label htmlFor="email" className="block mb-1">
//                                         Corporate Email Address
//                                     </label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         name="email"
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded"
//                                     />
//                                 </div>


//                                 {error && (
//                                     <p className="text-red-500 text-sm">{error}</p>
//                                 )}

//                                 <div className="flex justify-between items-center">
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
//                                 Don't have an account?{' '}
//                                 <Link href={ROUTES.REGISTER} className="text-[#134c90] hover:underline m-0">
//                                     Sign Up
//                                 </Link>
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
import { resetPassword } from '@/lib/supabase/action';

export default function ForgetPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        const result = await resetPassword(email);

        // if (result?.error) {
        //     setError(result.error.message);
        //     setLoading(false);
        //     return;
        // }
        // const { error } = await supabase.auth.resetPasswordForEmail(email, {
        //     redirectTo: `${window.location.origin}/reset-password`,
        // });

        if (result?.error) {
            setError(result?.error.message);
        } else {
            setSuccess('A reset link has been sent to your email.');
        }

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
                                <h2 className="section_heading">Forgot Password</h2>
                            </div>
                            <form id="reset-form" className="space-y-4" onSubmit={handleSubmit}>
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

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                                {success && (
                                    <p className="text-green-600 text-sm">{success}</p>
                                )}

                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#134c90] text-white px-4 py-2 rounded hover:bg-[#d21118]"
                                    >
                                        {loading ? 'Sending...' : 'Submit'}
                                    </button>
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
