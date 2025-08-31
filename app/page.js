"use client";

import Layout from "../components/Layout";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = true; // change this to true/false for testing

  const handleNavigation = (page) => {
    if (isLoggedIn) {
      router.push(page); // go to requested page
    } else {
      router.push("/login"); // not logged in → login page
    }
  };

  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to Campus Exchange</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A platform where students can share resources, connect with peers, and
          exchange resources to make campus life easier.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => handleNavigation("/message")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Messages
          </button>
          <button
            onClick={() => handleNavigation("/add_resource")}
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg shadow hover:bg-yellow-500 transition"
          >
            Add Resource
          </button>
        </div>
      </div>
    </Layout>
  );
}
