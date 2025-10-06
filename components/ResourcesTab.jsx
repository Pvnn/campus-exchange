"use client"
import { Button } from "@/components/ui/button"
import AddResourceForm from "./AddResourceForm"
import { useState, useEffect } from "react"
import ViewEditResourceModal from "./ViewEditResourceModal"
import Image from "next/image";
import { ImageIcon } from "lucide-react";

const ResourceImage = ({ resource, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset error state when resource changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [resource.image_url]);

  if (!resource.has_image || !resource.image_url || imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <ImageIcon className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-100 ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <Image
        src={resource.image_url}
        alt={resource.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        priority={false}
      />
    </div>
  );
};


export default function ResourcesTab({ user, resources: initialResources }) {
  const [resources, setResources] = useState(initialResources || [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  const handleResourceAdded = (newResource) => {
    setResources((prevResources) => [newResource, ...prevResources])
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Resources ({resources.length})</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <ResourceImage resource={resource} className="h-48" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                  {resource.categories?.name || "Uncategorized"}
                </span>
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1 rounded-md transition-colors"
                  onClick={() => {
                    setSelectedResourceId(resource.id);
                    setResourceModalOpen(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}

        {resources.length === 0 && (
          <div className="col-span-full text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first resource to share with others.</p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Add Your First Resource
            </Button>
          </div>
        )}
      </div>
      <AddResourceForm
        user={user}
        onResourceAdded={handleResourceAdded}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <ViewEditResourceModal
        open={resourceModalOpen}
        onOpenChange={setResourceModalOpen}
        resourceId={selectedResourceId}
        currentUserId={user?.id}
        onResourceUpdated={(updatedResource) => {
          setResources(prev => 
            prev.map(r => r.id === updatedResource.id ? updatedResource : r)
          );
        }}
      />
    </div>
  )
}