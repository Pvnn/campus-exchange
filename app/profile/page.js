"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/lib/profileService";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth(); // make sure AuthContext exposes loading
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // wait for auth to finish

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile(user.id);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No profile found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Your Profile
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Name:</span>
            <span className="text-gray-900">{profile.name || "Not set"}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">{profile.email || "Not set"}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="text-gray-900">{profile.phone || "Not set"}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Student ID:</span>
            <span className="text-gray-900">{profile.student_id || "Not set"}</span>
          </div>
        </div>

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
