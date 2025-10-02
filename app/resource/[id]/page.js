"use client";
import React, { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import DetailCard from "@/components/DetailCard";
import ContactModal from "@/components/ContactModal";
import ResourceCard from "@/components/ResourceCard";

export default function ResourceDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const supabase = createClient();
  const [resource, setResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) setCurrentUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    fetchUser();
  }, []);

  // Fetch main resource
  useEffect(() => {
    if (!id) {
      setError("Resource ID not found");
      setLoading(false);
      return;
    }

    async function fetchResource() {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setResource(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load resource");
      } finally {
        setLoading(false);
      }
    }

    fetchResource();
  }, [id]);

  // Fetch four related resources (excluding current)
  useEffect(() => {
    async function fetchRelated() {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .neq("id", id)
          .limit(4);
        if (error) throw error;
        setRelatedResources(data || []);
      } catch (err) {
        console.error("Failed to fetch related resources:", err);
      }
    }
    fetchRelated();
  }, [id]);

  if (loading) return <p className="p-6">Loading resource...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!resource) return <p className="p-6">Resource not found.</p>;

  return (
    <main className="container mx-auto p-6 space-y-10">
      {/* Main DetailCard */}
      <DetailCard
        title={resource.title}
        description={resource.description || "No description available."}
        images={[
          { 
            src: resource.has_image && resource.image_url 
              ? resource.image_url 
              : "/placeholder.png", 
            alt: `${resource.title} 1` 
          },
          { src: "/placeholder.png", alt: `${resource.title} 2` },
          { src: "/placeholder.png", alt: `${resource.title} 3` },
          { src: "/placeholder.png", alt: `${resource.title} 4` },
        ]}
        price={resource.price ?? 0}
        rating={resource.rating ?? 4}
        reviewCount={resource.reviewCount ?? 0}
        extraInfo={resource.type ? [{ type: resource.type }] : []}
        onAddToBag={() => setIsModalOpen(true)}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={resource}
        currentUser={currentUser}
      />

      {/* Related Resources */}
{relatedResources.length > 0 && (
  <section>
    <h2 className="text-xl font-bold mb-4">You may also like</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {relatedResources.map((res) => (
        <ResourceCard
          key={res.id}
          id={res.id}                        // links to /resource/[id]
          imageSrc={
            res.has_image && res.image_url
              ? res.image_url
              : "/placeholder.png"
          }
          imageAlt={res.title}
          title={res.title}
          price={res.price}
          status={res.type}                  // "share" | "rent" | "sale"
          className="hover:shadow-lg hover:scale-105 transition-transform duration-200 ease-out"
        />
      ))}
    </div>
  </section>
)}

    </main>
  );
}
