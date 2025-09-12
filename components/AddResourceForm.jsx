"use client";

import React, { useState } from "react";

// Error message component
const ErrorMessage = ({ message }) => (
  <p className="text-red-500 text-sm mt-1">{message}</p>
);

// Validation helper
const validateResource = (data) => {
  const errors = {};
  if (!data.title.trim()) errors.title = "Title is required";
  if (!data.description.trim()) errors.description = "Description is required";
  if (!data.category) errors.category = "Category is required";
  if (!data.price || Number(data.price) <= 0) errors.price = "Price must be positive";
  if (!data.type) errors.type = "Type is required";
  return errors;
};

export default function AddResourceForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    type: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const categories = ["Books", "Electronics", "Furniture", "Clothing"];
  const types = ["Sell", "Lend", "Share"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateResource(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      console.log("Resource ready for API:", formData);
      setLoading(false);
      setFormData({ title: "", description: "", category: "", price: "", type: "" });
      setIsModalOpen(false);
      setSuccessMessage("Resource added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  return (
    <>
      {/* Floating Add Resource Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg z-50"
      >
        Add Resource
      </button>

      {/* Success message */}
      {successMessage && (
        <div className="fixed bottom-24 right-6 bg-green-200 text-green-800 px-4 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative p-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Resource</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <label className="block font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
                {errors.title && <ErrorMessage message={errors.title} />}
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
                {errors.description && <ErrorMessage message={errors.description} />}
              </div>

              {/* Category */}
              <div>
                <label className="block font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <ErrorMessage message={errors.category} />}
              </div>

              {/* Price */}
              <div>
                <label className="block font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
                {errors.price && <ErrorMessage message={errors.price} />}
              </div>

              {/* Type */}
              <div>
                <label className="block font-medium">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="">Select Type</option>
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <ErrorMessage message={errors.type} />}
              </div>

              <button
                type="submit"
                className={`w-full p-2 rounded text-white font-semibold ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Add Resource"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
