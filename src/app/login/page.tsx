import Link from 'next/link';
import { ROUTES } from "../routes";

export default function Login() {
  return (
    <section className="login ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1">
          <div className="login_inner grid grid-cols-2 md:grid-cols-2  bg-gray-100 ">
            <div className="image-section">
              <img
                src="https://odeskthemes.com/10/news-portal/assets/img/img-7.jpg"
                alt="Login Illustration"
                className="w-full "
              />
            </div>
            <div className="login-section">
              <div className="login-header">
                <h2 className="section_heading ">Log In</h2>
              </div>
              <form id="login-form" className="space-y-4">
                <div className="form-group">
                  <label htmlFor="username" className="block mb-1">
                    Corporate Email Address
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
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
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="bg-[#134c90] text-white px-4 py-2 rounded hover:bg-[#d21118]"
                  >
                    SUBMIT
                  </button>
                  <div className="forgot-password">
                    <a href="#" className="text-[#134c90] hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </form>
              <div className="create-account  text-center">
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
