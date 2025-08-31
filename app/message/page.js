// app/messages/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const router = useRouter();
  const isLoggedIn = true; // change to false to test redirect

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
      {/* Blue container */}
      <div className="bg-blue-600 w-full max-w-2xl p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">
          Messages
        </h1>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Write a message to..."
          className="w-full p-3 border border-gray-300 rounded mb-6 text-black bg-white"
        />

        {/* Messages list */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow text-black">
            📩 Message from Admin: Welcome to Campus Exchange!
          </div>
          <div className="bg-white p-4 rounded shadow text-black">
            📩 John Doe: Is anyone selling a used calculator?
          </div>
          <div className="bg-white p-4 rounded shadow text-black">
            📩 Mary Smith: I have extra textbooks for sale.
          </div>
        </div>
      </div>
    </div>
  );
}
