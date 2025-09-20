"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  //useEffect(() => {
    //if (!user) {
    //  router.push("/login");
   // }
  //}, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Your Profile
        </h1>

        {/* Profile Card */}
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Name:</span>
            <span className="text-gray-900">
              {user?.profile?.name || "Not set"}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">{user?.email || "Not set"}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="text-gray-900">
              {user?.profile?.phone || "Not set"}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Bio:</span>
            <span className="text-gray-900">
              {user?.profile?.bio || "Not set"}
            </span>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-8 text-center">
          <Link
            href="/profile/update"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
