// lib/profileService.js
import { supabase } from "./supabaseClient";

// Get profile by user id
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, phone, student_id")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }

  return data;
}

// Update profile
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("users")
    .update({
      email: updates.email,
      phone: updates.phone,
      student_id: updates.student_id,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error.message);
    throw error;
  }
  return data;
}
