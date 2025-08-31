"use client";

import { useState } from "react";
import Layout from "../../components/Layout";

export default function ReviewPage() {
  const allResources = [
    { id: 1, name: "Math Textbook" },
    { id: 2, name: "Physics Calculator" },
    { id: 3, name: "Chemistry Notes" },
  ];

  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});

  const resources = allResources.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const setRating = (id, value) => {
    setRatings((r) => ({ ...r, [id]: value }));
  };

  const setReviewText = (id, text) => {
    setReviews((rv) => ({ ...rv, [id]: text }));
  };

  const handleSubmit = (id) => {
    const rating = ratings[id] || 0;
    const text = reviews[id] || "";
    alert(`Submitted review for resource ${id}:
- Rating: ${rating} star(s)
- Review: ${text}`);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Review Resources
        </h1>

        {/* 🔍 Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full border rounded-lg p-3 bg-transparent text-white placeholder-white"
          />
        </div>

        {resources.length === 0 ? (
          <p className="text-center text-gray-300">
            No resources found for "{search}".
          </p>
        ) : (
          <div className="space-y-6">
            {resources.map(({ id, name }) => (
              <div
                key={id}
                className="bg-white border rounded-lg shadow-sm p-5"
              >
                <h2 className="text-xl font-semibold mb-3 text-black">
                  {name}
                </h2>

                {/* ⭐ Star Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = (ratings[id] || 0) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        onClick={() => setRating(id, star)}
                        className={`text-2xl leading-none select-none ${
                          filled ? "text-yellow-400" : "text-gray-400"
                        }`}
                      >
                        ★
                      </button>
                    );
                  })}
                  <span className="ml-2 text-black">
                    {ratings[id] ? `${ratings[id]}/5` : "No rating"}
                  </span>
                </div>

                {/* ✍ Review Box */}
                <textarea
                  className="w-full border rounded-lg p-3 text-black"
                  rows={3}
                  placeholder={`Write your review for ${name}...`}
                  value={reviews[id] || ""}
                  onChange={(e) => setReviewText(id, e.target.value)}
                />

                <div className="mt-4">
                  <button
                    onClick={() => handleSubmit(id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
