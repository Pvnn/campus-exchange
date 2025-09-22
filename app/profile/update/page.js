// app/profile/update/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile } from "@/lib/profileService";

export default function UpdateProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    student_id: "",
  });

  const [loading, setLoading] = useState(true);

  // Load profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const profile = await getProfile(user.id);

        if (profile) {
          setFormData({
            name: profile.name || "",
            email: user.email || "",
            phone: profile.phone || "",
            student_id: profile.student_id || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile(user.id, {
        email: formData.email,
        phone: formData.phone,
        student_id: formData.student_id,
      });

      //alert("Profile updated successfully!");
      router.push("/profile"); // redirect back to profile page
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Update Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name (Read-only) */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Email (Editable) */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              name="student_id"
              placeholder="Enter your student ID"
              value={formData.student_id}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
