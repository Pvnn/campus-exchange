"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function UpdateProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    // Prefill form
    setFormData({
      name: user.profile?.name || "",
      email: user.email || "",
      phone: user.profile?.phone || "",
      bio: user.profile?.bio || "",
    });
  }, [user, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 🔹 Replace with real API call
    console.log("Updated profile data:", formData);

    alert("Profile updated successfully!");

    try {
      await Promise.resolve(logout());
    } catch (err) {
      console.error("Logout failed after update:", err);
    } finally {
      router.replace("/"); // go to logged-out home
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Update Profile</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className="block text-lg font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-lg font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-lg font-medium mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-lg font-medium mb-2">Bio</label>
          <textarea
            name="bio"
            className="w-full p-3 border rounded-lg"
            rows="4"
            placeholder="Write something about yourself..."
            value={formData.bio}
            onChange={handleChange}
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
  );
}
