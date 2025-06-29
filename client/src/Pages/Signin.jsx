import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  //console.log(location.pathname);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    setShowError(false);
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        formData,
        { withCredentials: true }
      );
      const data = response.data;
      dispatch(signInSuccess(data.user));
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to sign in";
      setShowError(true);
      dispatch(signInFailure(errorMessage));
    }
  };

  if (currentUser && !hasNavigated) {
    const userRole = currentUser.role || currentUser.user?.role;
    setHasNavigated(true);

    if (userRole === "admin") {
      navigate("/admin-dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r bg-blue-50">
        <div className="text-lg font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr bg-blue-50 p-5">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg shadow-2xl rounded-2xl p-8 transition-transform transform hover:scale-105">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8 tracking-wide">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email Address"
            id="email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full flex justify-center items-center bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>

          <OAuth />
        </form>

        <div className="flex justify-center gap-2 mt-6 text-sm">
          <p className="text-gray-700">Don't have an account?</p>
          <Link
            to="/sign-up"
            className="text-indigo-600 hover:underline font-medium"
          >
            {location.pathname === "/sign-up" ? "Sign In" : "Create an account"}
          </Link>
        </div>

        {error && showError && (
          <p className="text-red-500 text-center mt-6 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SignIn;
