"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      newErrors.email = "Invalid email address";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length)
      return setErrors(validationErrors);

    setLoading(true);
    setApiError("");
    setTimeout(() => {
      setLoading(false);
      setApiError("Invalid credentials");
    }, 1200);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-5xl font-bold tracking-tight text-indigo-500">
          Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className={`block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-indigo-100 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm ${
                  errors.email ? "border border-red-500" : ""
                }`}
                disabled={loading}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className={`block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-indigo-100 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm ${
                  errors.password ? "border border-red-500" : ""
                }`}
                disabled={loading}
                placeholder="Enter your password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-2 text-xs text-indigo-500 bg-transparent"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-sm">
            <a
              href="#"
              className="block text-right font-semibold text-indigo-500 hover:text-indigo-400"
            >
              Forgot password?
            </a>
          </div>

          {/* Remember me */}
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={form.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              disabled={loading}
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>

          {/* API error */}
          {apiError && (
            <div className="text-red-500 text-sm text-center">{apiError}</div>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Logging in...</span>
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </form>

        {/* Register link */}
        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-500 hover:text-indigo-400"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
