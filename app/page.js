// app/page.js
"use client"; // ⚠ Must be first line

import { useState } from "react";
import AddResourceForm from "../components/AddResourceForm";

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);

  // Dummy resource data
  const resources = [
    {
      id: 1,
      name: "Pro Django",
      description:
        "A detailed textbook for mastering Django framework concepts and advanced features.",
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
      name: "Arduino Starter Kit",
      description:
        "Includes board, sensors, and cables. Great for electronics projects.",
      image:
        "https://images.unsplash.com/photo-1581090700227-4c4ef845a2c4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "Mechanical Drawing Tools",
      description:
        "Set with compass, rulers, and protractor for engineering drawings.",
      image:
        "https://images.unsplash.com/photo-1616401784845-180b6f31c50a?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      name: "Study Desk Lamp",
      description:
        "Adjustable LED desk lamp, perfect for late-night study sessions.",
      image:
        "https://images.unsplash.com/photo-1505691723518-36a1aa8326f1?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white text-black py-16 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Campus Exchange</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Your marketplace for campus essentials. Buy, sell, and exchange
          resources with ease.
        </p>

        {/* Add Resource Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 z-50"
        >
          Add Resource
        </button>

        {/* Show form when toggled */}
        {showForm && (
          <div className="mt-8">
            <AddResourceForm />
          </div>
        )}
      </section>

      {/* Search & Filter UI */}
      <section className="bg-white py-8 px-6 md:px-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <select className="w-full md:w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
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
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Popular Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {resources.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-sm hover:shadow-md bg-white overflow-hidden"
            >
              <div className="relative w-full h-40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
