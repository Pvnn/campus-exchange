import { createClient } from "@/utils/supabase/client";

// Mock data as fallback when Supabase isn't configured
const mockResourcesData = {
  resources: [
    {
      id: 1,
      title: "MacBook Pro 2021",
      description: "Excellent condition laptop for coding and design work",
      price: 1200,
      type: "rent",
      category_id: 1,
      categories: { name: "Electronics" },
      availability_status: "available",
      owner_id: 1,
      owner: { name: "Alex Chen" },
      created_at: "2024-01-15T00:00:00Z",
    },
    {
      id: 2,
      title: "Calculus Textbook",
      description: "Stewart's Calculus 8th Edition - barely used",
      price: 80,
      type: "sale",
      category_id: 2,
      categories: { name: "Books" },
      availability_status: "available",
      owner_id: 2,
      owner: { name: "Sarah Johnson" },
      created_at: "2024-01-20T00:00:00Z",
    },
    {
      id: 3,
      title: "Bike Repair Kit",
      description: "Complete toolkit for bicycle maintenance",
      price: null,
      type: "share",
      category_id: 3,
      categories: { name: "Tools" },
      availability_status: "available",
      owner_id: 3,
      owner: { name: "Mike Wilson" },
      created_at: "2024-01-18T00:00:00Z",
    },
    {
      id: 4,
      title: "Chemistry Lab Goggles",
      description: "Safety goggles for chemistry experiments",
      price: 15,
      type: "rent",
      category_id: 4,
      categories: { name: "Lab Equipment" },
      availability_status: "available",
      owner_id: 4,
      owner: { name: "Emma Davis" },
      created_at: "2024-01-22T00:00:00Z",
    },
    {
      id: 5,
      title: "Guitar Amplifier",
      description: "Fender practice amp, perfect for dorm room",
      price: 200,
      type: "sale",
      category_id: 5,
      categories: { name: "Music" },
      availability_status: "available",
      owner_id: 5,
      owner: { name: "Jake Martinez" },
      created_at: "2024-01-25T00:00:00Z",
    },
  ],
  categories: [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Books" },
    { id: 3, name: "Tools" },
    { id: 4, name: "Lab Equipment" },
    { id: 5, name: "Music" },
    { id: 6, name: "Appliances" },
  ],
};

function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getResourcesData() {
  if (!isSupabaseConfigured()) {
    console.warn(
      "Supabase not configured, using mock data. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables."
    );
    return mockResourcesData;
  }

  const supabase = createClient();

  try {
    const [resourcesResult, categoriesResult] = await Promise.all([
      // Get all resources with category information
      supabase
        .from("resources")
        .select(
          `
          *,
          categories(name),
          owner:users!owner_id(name)
        `
        )
        .eq("availability_status", "available")
        .order("created_at", { ascending: false }),

      // Get all categories for filter options
      supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true }),
    ]);

    if (resourcesResult.error) throw resourcesResult.error;
    if (categoriesResult.error) throw categoriesResult.error;

    return {
      resources: resourcesResult.data || [],
      categories: categoriesResult.data || [],
    };
  } catch (error) {
    console.error("Error fetching resources:", error);
    console.warn("Falling back to mock data");
    return mockResourcesData;
  }
}

export async function getResourceById(id) {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, using mock data");
    const resource = mockResourcesData.resources.find(
      (r) => r.id.toString() === id
    );
    return resource || null;
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("resources")
      .select(
        `
        *,
        categories(name),
        owner:users!owner_id(name, email, phone)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching resource:", error);
    // Fallback to mock data
    const resource = mockResourcesData.resources.find(
      (r) => r.id.toString() === id
    );
    return resource || null;
  }
}
