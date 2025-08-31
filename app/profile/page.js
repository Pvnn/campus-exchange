"use client";
import Layout from "../../components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  // Dummy variable for logged-in status
  // true = logged in, false = not logged in
  const isLoggedIn = true; // ✅ flipped back to correct logic

  useEffect(() => {
    if (!isLoggedIn) {
      // 👉 If not logged in, redirect to login page
      router.push("/login"); // 🔑 later, replace with your actual login page
    }
    // If logged in → stay on Update Profile
  }, [isLoggedIn, router]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Update Profile</h1>

        <form className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-lg font-medium mb-2">Bio</label>
            <textarea
              className="w-full p-3 border rounded-lg"
              rows="4"
              placeholder="Write something about yourself..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
}
