"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { getResourcesData } from "@/lib/get-resources-data";
import ResourceCard from "@/components/ResourceCard";
import { ArrowRight } from "lucide-react";

const getResourceImageSrc = (resource) => {
  if (resource.has_image && resource.image_url) {
    return resource.image_url;
  }
  return `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(
    resource.title
  )}`;
};

export default function HomePage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getResourcesData();
        setResources(data.resources.slice(0, 8));
        setCategories(data.categories.slice(0, 3));
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section - Refined Typography */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
          alt="Students studying together"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
        
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Campus Exchange
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Your trusted marketplace for books, devices, notes, and more. Share, rent, and trade resources within your campus community.
          </p>
          {!user ? (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Browse Resources
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Shop by Category Section - EXACT REPLICA */}
      <section className="bg-white py-12">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shop by Category</h2>
            <Link 
              href="/browse" 
              className="hidden md:flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm group"
            >
              Browse all categories
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Custom Grid - Large left + 2 stacked right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
                {/* Large Category Card - Left */}
                {categories[0] && (
                  <Link
                    href={`/browse?category=${categories[0].id}`}
                    className="group relative h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <Image
                      src={`/categories/${categories[0].name.toLowerCase()}.png`}
                      alt={categories[0].name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{categories[0].name}</h3>
                      <p className="text-sm font-medium opacity-90 group-hover:opacity-100 transition">
                        Shop now
                      </p>
                    </div>
                  </Link>
                )}

                {/* Right Side - Two Stacked Cards */}
                <div className="grid grid-rows-2 gap-4 h-full">
                  {categories[1] && (
                    <Link
                      href={`/browse?category=${categories[1].id}`}
                      className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <Image
                        src={`/categories/${categories[1].name.toLowerCase()}.png`}
                        alt={categories[1].name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <h3 className="text-xl font-bold mb-1">{categories[1].name}</h3>
                        <p className="text-sm font-medium opacity-90 group-hover:opacity-100 transition">
                          Shop now
                        </p>
                      </div>
                    </Link>
                  )}

                  {categories[2] && (
                    <Link
                      href={`/browse?category=${categories[2].id}`}
                      className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <Image
                        src={`/categories/${categories[2].name.toLowerCase()}.png`}
                        alt={categories[2].name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <h3 className="text-xl font-bold mb-1">{categories[2].name}</h3>
                        <p className="text-sm font-medium opacity-90 group-hover:opacity-100 transition">
                          Shop now
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center md:hidden">
                <Link 
                  href="/browse"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Browse all categories
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Resources - Horizontal Grid like screenshot */}
      <section className="bg-white py-12">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending products</h2>
            <Link 
              href="/browse" 
              className="hidden md:flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm group"
            >
              See everything
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-base mb-3">No resources available yet.</p>
              {user && (
                <Link
                  href="/dashboard/resources"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Be the first to add a resource
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Grid Layout - 4 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {resources.slice(0, 4).map((resource) => (
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

              <div className="text-center mt-6 md:hidden">
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  See everything
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="relative min-h-[60vh] flex items-center" id="about">
        <Image
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80"
          alt="Students collaborating"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Building a Sustainable Campus
          </h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light mb-3">
            We're committed to making education more accessible and affordable. Our platform 
            promotes resource sharing, sustainability, and collaboration among students.
          </p>
          <p className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light mb-6">
            Every resource shared helps build a stronger, more connected campus community.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
          >
            Start Exploring
          </Link>
        </div>
      </section>

      {/* Contact Section - Subtle Background */}
      <section className="bg-gray-50 py-12" id="contact">
        <div className="w-full px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-base text-gray-600 mb-5">
            Questions? We'd love to hear from you.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Email: <a href="mailto:contact@campusexchange.com" className="text-indigo-600 hover:text-indigo-700 transition font-medium">contact@campusexchange.com</a>
            </p>
            <p className="text-sm text-gray-700">
              Phone: <a href="tel:+911234567890" className="text-indigo-600 hover:text-indigo-700 transition font-medium">+91 12345 67890</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
