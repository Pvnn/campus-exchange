"use client";
import React, { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import DetailCard from "@/components/DetailCard";
import ContactModal from "@/components/ContactModal";
import ResourceCard from "@/components/ResourceCard";
import { ArrowLeft } from "lucide-react";
export default function ResourceDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const supabase = createClient();
  const [resource, setResource] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasTransaction, setHasTransaction] = useState(false); 

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

        if (currentUser && data.owner_id === currentUser.id) {
          setIsOwner(true);
        }

        // Fetch category
        if (data?.category_id) {
          const { data: catData, error: catError } = await supabase
            .from("categories")
            .select("name")
            .eq("id", data.category_id)
            .single();
          if (catError) throw catError;
          setCategory(catData.name);
        }

        // Check if transaction exists for this user & resource
        if (currentUser) {
          const { data: existingTransaction, error: transError } =
            await supabase
              .from("transactions")
              .select("*")
              .eq("resource_id", data.id)
              .eq("requester_id", currentUser.id)
              .maybeSingle(); // returns null if none

          if (transError) throw transError;
          setHasTransaction(!!existingTransaction);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load resource");
      } finally {
        setLoading(false);
      }
    }

    fetchResource();
  }, [id, currentUser]);

  // Fetch related resources
  useEffect(() => {
    async function fetchRelated() {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .neq("id", id)
          .eq("availability_status", "available")
          .limit(4);
        if (error) throw error;
        setRelatedResources(data || []);
      } catch (err) {
        console.error("Failed to fetch related resources:", err);
      }
    }
    fetchRelated();
  }, [id]);

  const handleEdit = () => {
    router.push(`/dashboard/resources?edit=${id}`);
  };

  const handleContactOwner = () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    if (hasTransaction) {
      router.push("/dashboard/messages");
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) return <p className="p-6">Loading resource...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!resource) return <p className="p-6">Resource not found.</p>;

  return (
    <main className="container mx-auto p-6 space-y-10">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group mb-2"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </button>
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
        extraInfo={[
          ...(resource.type ? [{ type: resource.type }] : []),
          ...(resource.condition ? [{ type: resource.condition }] : []),
          ...(resource.brand ? [{ type: resource.brand }] : []),
          ...(resource.usage_duration
            ? [{ type: resource.usage_duration }]
            : []),
        ]}
        category={category}
        isOwner={isOwner}
        availability_status={resource.availability_status}
        hasTransaction={hasTransaction} 
        onAddToBag={handleContactOwner}
        onCheckStatus={() => router.push("/dashboard/messages")} 
        onEdit={handleEdit}
      />

      {/* Contact Modal */}
      {!isOwner && isModalOpen && (
        <ContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resource={resource}
          currentUser={currentUser}
          onTransactionCreated={() => setHasTransaction(true)} 
        />
      )}

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full text-center shadow-lg">
            <p className="mb-6 text-gray-700 text-lg">
              You must be signed in to contact the owner.
            </p>
            <div className="flex flex-col gap-4">
              <a
                href={`/login?redirect=/resource/${id}`}
                className="inline-block bg-indigo-700 text-white px-6 py-3 rounded-md hover:bg-indigo-600 transition"
              >
                Sign In
              </a>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
