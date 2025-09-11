"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null; // avoid rendering before redirect

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="space-y-4 text-gray-700">
        <p>
          <strong>Name:</strong> {user.profile?.name || "Not set"}
        </p>
        <p>
          <strong>Email:</strong> {user.email || "Not set"}
        </p>
        <p>
          <strong>Phone:</strong> {user.profile?.phone || "Not set"}
        </p>
        <p>
          <strong>Bio:</strong> {user.profile?.bio || "Not set"}
        </p>
      </div>

      <Link
        href="/profile/update"
        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Update Profile
      </Link>
    </div>
  );
}
