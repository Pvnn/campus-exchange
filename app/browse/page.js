"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
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

// Mock data based on the ER diagram structure
const mockResources = [
  {
    id: 1,
    title: "MacBook Pro 2021",
    description: "Excellent condition laptop for coding and design work",
    price: "$1200",
    type: "rent",
    category_id: 1,
    category_name: "Electronics",
    availability_status: "available",
    owner_id: 1,
    created_at: "2024-01-15",
    imageSrc: "/silver-macbook-on-desk.png",
  },
  {
    id: 2,
    title: "Calculus Textbook",
    description: "Stewart's Calculus 8th Edition - barely used",
    price: "$80",
    type: "sale",
    category_id: 2,
    category_name: "Books",
    availability_status: "available",
    owner_id: 2,
    created_at: "2024-01-20",
    imageSrc: "/calculus-textbook.png",
  },
  {
    id: 3,
    title: "Bike Repair Kit",
    description: "Complete toolkit for bicycle maintenance",
    price: "Free",
    type: "share",
    category_id: 3,
    category_name: "Tools",
    availability_status: "available",
    owner_id: 3,
    created_at: "2024-01-18",
    imageSrc: "/bike-repair-tools.jpg",
  },
  {
    id: 4,
    title: "Chemistry Lab Goggles",
    description: "Safety goggles for chemistry experiments",
    price: "$15",
    type: "rent",
    category_id: 4,
    category_name: "Lab Equipment",
    availability_status: "available",
    owner_id: 4,
    created_at: "2024-01-22",
    imageSrc: "/safety-goggles.jpg",
  },
  {
    id: 5,
    title: "Guitar Amplifier",
    description: "Fender practice amp, perfect for dorm room",
    price: "$200",
    type: "sale",
    category_id: 5,
    category_name: "Music",
    availability_status: "available",
    owner_id: 5,
    created_at: "2024-01-25",
    imageSrc: "/guitar-amplifier.jpg",
  },
  {
    id: 6,
    title: "Organic Chemistry Notes",
    description: "Comprehensive study notes from last semester",
    price: "Free",
    type: "share",
    category_id: 2,
    category_name: "Books",
    availability_status: "available",
    owner_id: 6,
    created_at: "2024-01-28",
    imageSrc: "/study-notes.jpg",
  },
  {
    id: 7,
    title: "Mini Fridge",
    description: "Compact refrigerator for dorm room",
    price: "$30/month",
    type: "rent",
    category_id: 6,
    category_name: "Appliances",
    availability_status: "available",
    owner_id: 7,
    created_at: "2024-01-30",
    imageSrc: "/mini-fridge.jpg",
  },
  {
    id: 8,
    title: "Scientific Calculator",
    description: "TI-84 Plus CE graphing calculator",
    price: "$90",
    type: "sale",
    category_id: 1,
    category_name: "Electronics",
    availability_status: "available",
    owner_id: 8,
    created_at: "2024-02-01",
    imageSrc: "/graphing-calculator.jpg",
  },
];

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
  { id: 3, name: "Tools" },
  { id: 4, name: "Lab Equipment" },
  { id: 5, name: "Music" },
  { id: 6, name: "Appliances" },
];

const resourceTypes = [
  { value: "all", label: "All Types" },
  { value: "share", label: "Share" },
  { value: "rent", label: "Rent" },
  { value: "sale", label: "Sale" },
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Filter resources based on search and filters
  const filteredResources = useMemo(() => {
    return mockResources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        resource.category_id.toString() === selectedCategory;

      const matchesType =
        selectedType === "all" || resource.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedType]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Browse Resources
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover items shared by your campus community
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
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
      <div className="container mx-auto px-4 py-4">
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
      <div className="container mx-auto px-4 pb-8">
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
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                id={resource.id}
                imageSrc={resource.imageSrc}
                imageAlt={resource.title}
                title={resource.title}
                price={resource.price}
                status={resource.type}
                className={
                  viewMode === "list"
                    ? "flex flex-row items-center gap-4 p-4"
                    : ""
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
