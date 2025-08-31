import Layout from "../../components/Layout";
import Link from "next/link";

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-bold mb-10">Dashboard</h1>

        {/* Dashboard Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Browse Resources */}
          <Link
            href="/browse"
            className="block p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Browse Resources
            </h2>
            <p className="text-gray-600 mt-2">
              Explore resources shared by other students.
            </p>
          </Link>

          {/* Messages */}
          <Link
            href="/review"
            className="block p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Resource Reviews
            </h2>
            <p className="text-gray-600 mt-2">
              Check your messages and stay connected.
            </p>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className="block p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
            <p className="text-gray-600 mt-2">
              Update your details and manage your account.
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
