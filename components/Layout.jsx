import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        {/* Branding/Logo */}
        <div className="text-2xl italic font-[cursive]">
          Campus Exchange
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="space-x-2">
          <Link href="/login">
            <button className="bg-white text-blue-600 px-3 py-1 rounded">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-yellow-400 text-black px-3 py-1 rounded">
              Register
            </button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4">
        © {new Date().getFullYear()} Campus Exchange. All rights reserved.
      </footer>
    </div>
  );
}
