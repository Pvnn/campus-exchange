import { supabase } from "./supabaseClient";

// Fetch a profile
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, phone, bio")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error?.message || error);
    return null;
  }

  return data;
}

// Update a profile
export async function updateProfile(userId, profileData) {
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      ...profileData,
      updated_at: new Date(),
    });

  if (error) {
    console.error("Error updating profile:", error?.message || error);
    throw new Error(error?.message || "Unknown error");
  }
}
