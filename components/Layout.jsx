"use client";

import { usePathname } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const pathname = usePathname();
  const { user, loading, initialized, logout } = useAuth();
  
  // Pages that should not have navbar/footer
  const noLayoutPages = ['/login', '/register', '/error'];
  
  // If it's an auth page, return simple layout
  if (noLayoutPages.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {children}
      </div>
    );
  }

  // Full layout for all other pages
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Navbar with Auth Context */}
      <Disclosure as="nav" className="sticky top-0 z-50 bg-white border-b shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Brand */}
                <Link href="/" className="text-xl font-bold tracking-tight text-gray-800">
                  Campus Exchange
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:space-x-6">
                  <Link href="/" className="text-gray-600 hover:text-black">Home</Link>
                  <Link href="/about" className="text-gray-600 hover:text-black">About</Link>
                  {user && (
                    <Link href="/dashboard" className="text-gray-600 hover:text-black">Dashboard</Link>
                  )}
                  <Link href="/contact" className="text-gray-600 hover:text-black">Contact</Link>
                </div>

                {/* Auth Section - Updated with AuthContext */}
                <div className="hidden md:flex md:items-center">
                  {!initialized && loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                  ) : user ? (
                    // User is logged in - show user info and logout
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/profile"
                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Welcome, {user.profile?.name || user.email?.split('@')[0] || 'User'}
                      </Link>
                      <button
                        onClick={logout}
                        className="rounded-md bg-black text-white px-3 py-2 text-sm font-medium hover:bg-gray-800"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    // User is NOT logged in - show login/register links
                    <div className="flex items-center space-x-2">
                      <Link
                        href="/login"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="rounded-md bg-black text-white px-3 py-2 text-sm font-medium hover:bg-gray-800"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100">
                    {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Panel */}
            <Disclosure.Panel className="md:hidden border-t bg-white">
              <div className="space-y-1 px-4 pb-4 pt-2">
                <Link href="/" className="block rounded-md px-3 py-2 text-base hover:bg-gray-100">Home</Link>
                <Link href="/about" className="block rounded-md px-3 py-2 text-base hover:bg-gray-100">About</Link>
                {user && (
                  <Link href="/dashboard" className="block rounded-md px-3 py-2 text-base hover:bg-gray-100">Dashboard</Link>
                )}
                <Link href="/contact" className="block rounded-md px-3 py-2 text-base hover:bg-gray-100">Contact</Link>
                
                {/* Mobile Auth Section */}
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-10 rounded mt-2"></div>
                ) : user ? (
                  // ✅ Mobile - User logged in
                  <div className="mt-2 space-y-2">
                    <Link
                      href="/profile"
                      className="block rounded-md border border-gray-300 px-3 py-2 text-base font-medium hover:bg-gray-100"
                    >
                      {user.profile?.name || user.email}
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left rounded-md bg-black text-white px-3 py-2 text-base font-medium hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  // Mobile - User NOT logged in
                  <div className="mt-2 space-y-2">
                    <Link href="/login" className="block rounded-md border px-3 py-2 text-base hover:bg-gray-100">Login</Link>
                    <Link href="/register" className="block rounded-md bg-black text-white px-3 py-2 text-base hover:bg-gray-800">Register</Link>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t p-4 text-center text-sm text-gray-600">
        © 2025 Campus Exchange. All rights reserved.
      </footer>
    </div>
  );
}
