"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ResourceCard from "@/components/ResourceCard";
import { getResourcesData } from "@/lib/get-resources-data";
import { useAuth } from "@/contexts/AuthContext";

const getResourceImageSrc = (resource) => {
  if (resource.has_image && resource.image_url) {
    return resource.image_url;
  }
  return `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(
    resource.title
  )}`;
};

const resourceTypes = [
  { value: "all", label: "All Types" },
  { value: "share", label: "Share" },
  { value: "rent", label: "Rent" },
  { value: "sell", label: "Sale" },
];

// Extract component that uses useSearchParams
function ResourcesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [selectedType, setSelectedType] = useState("all");
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getResourcesData();
        setResources(data.resources);
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesUser = !user || resource.owner_id !== user.id;

      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        resource.category_id?.toString() === selectedCategory;

      const matchesType =
        selectedType === "all" || resource.type === selectedType;

      return matchesUser && matchesSearch && matchesCategory && matchesType;
    });
  }, [resources, searchQuery, selectedCategory, selectedType, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Browse Resources
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover items shared by your campus community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedType !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedType("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredResources.length} resource
            {filteredResources.length !== 1 ? "s" : ""} found
          </p>

          {/* Active Filters */}
          <div className="flex items-center gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {
                  categories.find((c) => c.id.toString() === selectedCategory)
                    ?.name
                }
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="ml-1 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {resourceTypes.find((t) => t.value === selectedType)?.label}
                <button
                  onClick={() => setSelectedType("all")}
                  className="ml-1 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
              <Filter className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No resources found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedType("all");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                id={resource.id}
                imageSrc={getResourceImageSrc(resource)}
                imageAlt={resource.title}
                title={resource.title}
                price={resource.price ? `${resource.price}` : "Free"}
                status={resource.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading resources...</p>
          </div>
        </div>
      }
    >
      <ResourcesContent />
    </Suspense>
  );
}
