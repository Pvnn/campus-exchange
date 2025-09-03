"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDetails() {
  const router = useRouter();

  // Dummy logged-in status
  const isLoggedIn = true;

  // Dummy user details (replace later with real data from DB/API)
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "I’m a Computer Science student who loves coding, AI, and building cool projects.",
    phone: "+91 9876543210",
    university: "XYZ Institute of Technology",
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">User Details</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {user.phone}
        </p>
        <p>
          <span className="font-semibold">University:</span> {user.university}
        </p>
        <p>
          <span className="font-semibold">Bio:</span> {user.bio}
        </p>
      </div>
    </div>
  );
}
