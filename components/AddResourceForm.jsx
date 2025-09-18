"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";

// Error message component
const ErrorMessage = ({ message }) => (
  <p className="text-red-500 text-sm mt-1">{message}</p>
);

const validateResource = (data) => {
  const errors = {};
  if (!data.title.trim()) errors.title = "Title is required";
  if (!data.description.trim()) errors.description = "Description is required";
  if (!data.category_id) errors.category = "Category is required";
  if (!data.price || Number(data.price) <= 0)
    errors.price = "Price must be positive";
  if (!data.type) errors.type = "Type is required";
  return errors;
};

export default function AddResourceForm({isModalOpen, setIsModalOpen, onResourceAdded, user}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: '',
    price: "",
    type: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const types = ["Sell", "Lend", "Share"];
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

      if (!error && data) {
        setCategories(data);
      } else {
        console.error('Failed to fetch categories', error);
      }
      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateResource(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const {data, error} = await supabase 
    .from('resources').insert([
      {
        owner_id : user.id,
        title : formData.title,
        category_id: parseInt(formData.category_id, 10),
        price: parseFloat(formData.price), 
        type: formData.type.toLowerCase(),
        description: formData.description
      }
    ])
    .select('*, categories(name)')
    .single();
    if (!error && data) {
      onResourceAdded(data); 
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        type: '',
      });
    }  
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative p-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Add New Resource
            </h2>

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
                {errors.description && (
                  <ErrorMessage message={errors.description} />
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                {loadingCategories ? (
                  <p className="text-sm text-gray-500">Loading categories...</p>
                ) : (
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category_id: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
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
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && <ErrorMessage message={errors.type} />}
              </div>

              <button
                type="submit"
                className={`cursor-pointer w-full p-2 rounded text-white font-semibold ${
                  loading
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600 transition"
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
