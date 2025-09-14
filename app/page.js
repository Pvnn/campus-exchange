"use client";
import React from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth(); // no loading block

  // Dummy resources
  const resources = [
    {
      id: 1,
      name: "Pro Django",
      description: "Advanced concepts for professional Django developers.",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Dell XPS 13 Laptop",
      description:
        "Lightweight and powerful, ideal for coding and assignments.",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Scientific Calculator",
      description: "Casio FX-991ES Plus, almost new and works perfectly.",
      image:
        "https://images.unsplash.com/photo-1581090700227-4c4ef845a2c4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Headphones",
      description: "Perfect for focusing while studying.",
      image:
        "https://images.unsplash.com/photo-1580894894513-3999f3a16b6e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "Drawing Kit",
      description: "Complete architecture drawing set with rulers and tools.",
      image:
        "https://images.unsplash.com/photo-1580910051074-7ce65ef6e94d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      name: "Office Chair",
      description: "Ergonomic chair, perfect for long study sessions.",
      image:
        "https://images.unsplash.com/photo-1505691723518-36a1aa8326f1?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
          alt="Students studying together"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-6 md:px-12 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Campus Exchange
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
            Your one-stop marketplace for books, notes, devices, and more. Buy,
            sell, and exchange resources with your campus community.
          </p>
          {!user ? (
            <Link
              href="/register"
              className="bg-white text-black px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-200 transition"
            >
              Get Started
            </Link>
          ) : null}
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-white py-8 px-6 md:px-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
          <select className="w-full md:w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black">
            <option>Filter by category</option>
            <option>Books</option>
            <option>Devices</option>
            <option>Notes</option>
            <option>Stationery</option>
          </select>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="bg-white py-12 px-6 md:px-12">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Popular Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {resources.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-sm hover:shadow-md bg-white overflow-hidden transition"
            >
              <div className="relative w-full h-40">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative min-h-screen py-32 px-6 md:px-12 border-t border-gray-200 flex items-center"
      >
        <Image
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80"
          alt="Students collaborating"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">About Us</h2>
          <p className="text-xl md:text-2xl mb-6 leading-relaxed">
            Campus Exchange is a student-to-student marketplace designed to make
            sharing resources easy and convenient. From books to gadgets, notes
            to furniture, we provide a trusted platform for students to buy,
            sell, and exchange within their campus community.
          </p>
          <p className="text-xl md:text-2xl leading-relaxed">
            Our goal is to promote sustainability, affordability, and
            collaboration, ensuring that every student has access to the tools
            they need to succeed.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="bg-gray-100 py-16 px-6 md:px-12 border-t border-gray-200"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
          <p className="text-lg text-gray-700 mb-2">
            Email: contact@campusexchange.com
          </p>
          <p className="text-lg text-gray-700">Phone: +91 12345 67890</p>
        </div>
      </section>
    </>
  );
}