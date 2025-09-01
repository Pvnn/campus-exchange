"use client"; 
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    studentId: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation logic
  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.studentId.trim()) newErrors.studentId = "Student ID is required";

    if (!form.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Registration successful (demo)!");
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Register
        </h1>

        {/* Name */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        {/* Email */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        {/* Student ID */}
        <input
          type="text"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          placeholder="Student ID"
          className="w-full p-3 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        {errors.studentId && (
          <p className="text-red-500 text-sm">{errors.studentId}</p>
        )}

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-3 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        {/* Password */}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full p-3 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Link to Login */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
