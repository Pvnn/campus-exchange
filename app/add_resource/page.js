// app/add-resource/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddResourcePage() {
  const router = useRouter();
  const isLoggedIn = false; // change to false to test redirect

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-6">
      {/* Form container */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Add a Resource
        </h1>

        <form className="space-y-4">
          {/* Resource Name */}
          <div>
            <label className="block mb-2 font-medium text-black">
              Resource Name
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded text-black"
              placeholder="Enter resource name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-black">
              Description
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded text-black"
              placeholder="Enter description"
              rows="4"
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-medium text-black">
              Category
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded text-black"
              placeholder="e.g. Textbook, Calculator"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700"
          >
            Add Resource
          </button>
        </form>
      </div>
    </div>
  );
}
