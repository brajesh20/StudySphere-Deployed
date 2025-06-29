import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setError(data.msg || data.message || "Failed to sign up");
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-8 transition-all duration-300 hover:shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
            Join our community and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none shadow-sm"
                  id="username"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none shadow-sm"
                  id="email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none shadow-sm"
                  id="password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              disabled={loading}
              className="cursor-pointer w-full flex justify-center items-center bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <OAuth />
        </form>

        {error && (
          <div className="flex justify-center mt-4">
            <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-sm animate-fade-in w-fit">
              <div className="flex items-center gap-3 text-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium leading-snug">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
