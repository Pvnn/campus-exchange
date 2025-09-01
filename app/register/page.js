"use client";
import { useState } from "react";


export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        {/* Circle Icon */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold">
            ~
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Create your account
        </h2>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-800"
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-800"
          />

          <input
            type="text"
            placeholder="Student ID"
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-800"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-800"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-800"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-800"
          />

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
