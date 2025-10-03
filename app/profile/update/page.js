// app/profile/update/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile } from "@/lib/profileService";
import { createClient } from "@/utils/supabase/client";
// Ensure all local component imports use the consistent relative path (../../../components/ui/...)
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { Input } from "../../../components/ui/input.jsx"; // <-- Now definitively fixed
import { Label } from "../../../components/ui/label.jsx";

import { Loader2, User, Phone, GraduationCap, Mail, Lock, Edit3, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function UpdateProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "", // from profile, read-only
    phone: "",
    student_id: "",
  });

  const [authForm, setAuthForm] = useState({
    email: "", // Current email (read-only in form)
    newEmail: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Load profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const profile = await getProfile(user.id);

        if (profile) {
          // Initialize profile metadata form data
          setFormData({
            name: profile.name || "",
            phone: profile.phone || "",
            student_id: profile.student_id || "",
          });
          
          // Initialize auth form data (current email)
          setAuthForm(prev => ({
            ...prev,
            email: user.email || "",
          }));
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
    const { name, value } = e.target;
    if (["phone", "student_id"].includes(name)) {
      setFormData({ ...formData, [name]: value });
    } else {
      setAuthForm({ ...authForm, [name]: value });
    }
    setErrors({});
    setSuccess(null);
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = "Phone number must be at least 10 digits.";
    if (!formData.student_id || formData.student_id.length < 3) newErrors.student_id = "Student ID must be at least 3 characters.";
    return newErrors;
  };

  const validateAuth = () => {
    const newErrors = {};
    
    // Validate New Email
    if (authForm.newEmail.trim()) {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(authForm.newEmail)) {
            newErrors.newEmail = "Invalid email address format.";
        } else if (authForm.newEmail.trim() === authForm.email) {
            newErrors.newEmail = "New email cannot be the same as the current email.";
        }
    }

    // Validate Password
    const passwordSet = authForm.password.trim() || authForm.confirmPassword.trim();
    if (passwordSet) {
        if (!authForm.password.trim() || authForm.password.length < 6) {
            newErrors.password = "New password must be at least 6 characters.";
        }
        if (authForm.password.trim() !== authForm.confirmPassword.trim()) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
    }
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...validationErrors }));
        return;
    }

    setSaving(true);
    setSuccess(null);

    try {
      // Update profile metadata in the 'users' table
      await updateProfile(user.id, {
        phone: formData.phone,
        student_id: formData.student_id,
        // Name is typically managed on the server side via auth hook, but passing it for clarity
        name: formData.name
      });

      setSuccess({ type: "profile", message: "Profile details updated successfully!" });
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submitProfile: "Failed to update profile details. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const validationErrors = validateAuth();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...validationErrors }));
        return;
    }

    const isEmailChange = authForm.newEmail.trim() && authForm.newEmail.trim() !== authForm.email;
    const isPasswordChange = authForm.password.trim();

    if (!isEmailChange && !isPasswordChange) {
        setErrors({ submitAuth: "No changes detected for email or password." });
        return;
    }

    setSaving(true);
    setSuccess(null);

    try {
      const userUpdates = {};
      let message = "";

      // Handle Email Change
      if (isEmailChange) {
        userUpdates.email = authForm.newEmail;
        message += "Email update link sent! Please check your new email to confirm. ";
      }

      // Handle Password Change
      if (isPasswordChange) {
        userUpdates.password = authForm.password;
        message += isEmailChange ? " " : "";
        message += "Password updated successfully!";
      }

      // Perform the update via Supabase Auth API
      const { error: authError } = await supabase.auth.updateUser(userUpdates);
      if (authError) throw authError;

      // Reset password fields and show success message
      setSuccess({ type: isEmailChange && isPasswordChange ? "combined" : isEmailChange ? "email" : "password", message });
      setAuthForm(prev => ({ ...prev, password: "", confirmPassword: "", newEmail: isEmailChange ? prev.newEmail : "" }));
      
      // Clear success message after a delay
      setTimeout(() => setSuccess(null), isEmailChange ? 10000 : 3000);

    } catch (error) {
      console.error("Error updating auth details:", error);
      setErrors({ submitAuth: error.message || "Failed to update account details. Please try again." });
    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Update Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Edit your personal details or update your account credentials.
          </p>
        </div>

        <div className="space-y-10">
          
          {/* Profile Details Card */}
          <Card className="p-8 shadow-xl bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <User className="w-6 h-6 text-indigo-600" />
              Personal Information
            </h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
                
              {/* Name (Read-only) */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name (Managed by SSO)
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  disabled
                  className="bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone className="w-4 h-4 mr-1 inline-block" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.phone}</p>}
              </div>

              {/* Student ID */}
              <div>
                <Label htmlFor="student_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <GraduationCap className="w-4 h-4 mr-1 inline-block" />
                  Student ID
                </Label>
                <Input
                  id="student_id"
                  name="student_id"
                  type="text"
                  placeholder="Enter your student ID"
                  value={formData.student_id}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                />
                {errors.student_id && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.student_id}</p>}
              </div>

              {/* Submission Status */}
              {success?.type === "profile" && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{success.message}</span>
                </div>
              )}
              {errors.submitProfile && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <XCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{errors.submitProfile}</span>
                </div>
              )}

              {/* Save Button */}
              <div className="text-right pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Edit3 className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
          
          {/* Account Details (Email & Password) Card */}
          <Card className="p-8 shadow-xl bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-indigo-600" />
              Security and Credentials
            </h2>
            
            <form onSubmit={handleAuthSubmit} className="space-y-6">
                
              {/* Current Email (Read-only) */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={authForm.email}
                  disabled
                  className="bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                />
              </div>

              {/* New Email */}
              <div>
                <Label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail className="w-4 h-4 mr-1 inline-block" />
                  New Email (Requires verification)
                </Label>
                <Input
                  id="newEmail"
                  name="newEmail"
                  type="email"
                  placeholder="Leave blank to keep current email"
                  value={authForm.newEmail}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                />
                {errors.newEmail && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.newEmail}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div>
                      <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </Label>
                      <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Leave blank to keep current password"
                            value={authForm.password}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 dark:text-white pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Lock className="w-4 h-4 text-gray-500 hover:text-indigo-600" />
                          </button>
                      </div>
                      {errors.password && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                      <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password
                      </Label>
                      <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            value={authForm.confirmPassword}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 dark:text-white pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                             <Lock className="w-4 h-4 text-gray-500 hover:text-indigo-600" />
                          </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.confirmPassword}</p>}
                  </div>
              </div>
              
              {/* Submission Status */}
              {(success?.type === "email" || success?.type === "password" || success?.type === "combined") && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{success.message}</span>
                </div>
              )}
              {errors.submitAuth && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <XCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{errors.submitAuth}</span>
                </div>
              )}

              {/* Save Button */}
              <div className="text-right pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  Update Credentials
                </Button>
              </div>
            </form>
          </Card>

          <div className="text-center mt-6">
            <Link href="/profile" className="text-indigo-600 hover:text-indigo-700 font-medium">
              &larr; Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
