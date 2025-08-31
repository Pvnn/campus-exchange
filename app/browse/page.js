"use client";
import Layout from "../../components/Layout";
import { useState } from "react";

export default function BrowseResources() {
  const [search, setSearch] = useState("");

  // Dummy resources
  const resources = [
    { id: 1, name: "Physics Textbook" },
    { id: 2, name: "Chemistry Notes" },
    { id: 3, name: "Graphing Calculator" },
    { id: 4, name: "Programming Guide" },
    { id: 5, name: "Math Workbook" },
  ];

  // Filter resources based on search
  const filtered = resources.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Browse Resources</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6"
        />

        {/* Resource List */}
        <ul className="list-disc pl-5 space-y-2 text-lg">
          {filtered.length > 0 ? (
            filtered.map((item) => <li key={item.id}>{item.name}</li>)
          ) : (
            <p className="text-gray-600">No resources found.</p>
          )}
        </ul>
      </div>
    </Layout>
  );
}
