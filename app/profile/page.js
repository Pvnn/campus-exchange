// app/profile/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/lib/profileService";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, GraduationCap, Edit3, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

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
      <div className="flex flex-1 items-center justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>No profile found. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  const DisplayField = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
        <p className="text-base text-gray-900 font-medium truncate">
          {value || "Not set"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center pt-11 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Your Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            View your personal and account details.
          </p>
        </div>

        <Card className="p-8 shadow-xl border-t-4 border-indigo-600 bg-white">
          <CardContent className="p-0">
            {/* Header with Avatar and Name */}
            <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 dark:border-gray-700 mb-6">
              <Avatar className="h-20 w-20">
                {/* Placeholder image (replace with actual image later) */}
                <AvatarFallback className="bg-indigo-600 text-white text-3xl font-semibold">
                  {profile.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.name || user?.email?.split('@')[0] || "User"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member since: {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Details (Metadata) */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <DisplayField icon={Mail} label="Email" value={profile.email} />
                  <DisplayField icon={Phone} label="Phone Number" value={profile.phone} />
                  <DisplayField icon={GraduationCap} label="Student ID" value={profile.student_id} />
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col space-y-4 pt-4 md:pt-0">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  Manage Account
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your contact details and change your email or password.
                </p>
                <Link href="/profile/update" className="w-full">
                  <Button 
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Update Profile Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
