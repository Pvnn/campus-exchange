"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, initialized, logout } = useAuth();

  // Pages that should not have navbar/footer
  const noLayoutPages = ['/login', '/register', '/error'];
  // Scroll to section if element exists
  // Layout.jsx  ── inside the component scope
  const navigateToSection = (id) => {
    // if we’re already on the home page just scroll
    if (pathname === "/") {
      return scrollToId(id);
    }

    // otherwise go to "/", then scroll after a short delay
    router.push("/");     // <-- no .then()

    // give React 1-2 frames to mount the new DOM
    setTimeout(() => scrollToId(id), 200);
  };

  // tiny helper so we don’t repeat code
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  // ----- Proper logout handler -----
  const handleLogout = async () => {
    try {
      await Promise.resolve(logout()); // works if logout is sync or async
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.replace("/"); // always go back to logged-out homepage
    }
  };

  // If it's an auth page, return simple layout
  if (noLayoutPages.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        {children}
      </div>
    );
  }

  // Loading state while auth initializes
  if (!initialized) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-tight text-gray-800">
                Campus Exchange
              </Link>
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t p-4 text-center text-sm text-gray-600">
          © 2025 Campus Exchange. All rights reserved.
        </footer>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Navbar */}
      <Disclosure as="nav" className="sticky top-0 z-50 bg-white border-b shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Brand */}
                <button onClick={() => navigateToSection("home")} className="text-xl font-bold tracking-tight text-gray-800">
                  Campus Exchange
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:space-x-6">
                  <button onClick={() => navigateToSection("home")} className="text-gray-600 hover:text-black">Home</button>
                  <button onClick={() => navigateToSection("about")} className="text-gray-600 hover:text-black">About</button>
                  {user && (
                    <Link href="/dashboard" className="text-gray-600 hover:text-black">Dashboard</Link>
                  )}
                  <button onClick={() => navigateToSection("contact")} className="text-gray-600 hover:text-black">Contact</button>
                </div>

                {/* Auth Section */}
                <div className="hidden md:flex md:items-center">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                  ) : user ? (
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/profile"
                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Welcome, {user.profile?.name || user.email?.split('@')[0] || 'User'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="rounded-md bg-black text-white px-3 py-2 text-sm font-medium hover:bg-gray-800"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
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
                <button onClick={() => navigateToSection("home")} className="block rounded-md px-3 py-2 text-base hover:bg-gray-100">Home</button>
                <button onClick={() => navigateToSection("about")} className="block rounded-md px-3 py-2 text-base hover:bg-gray-100">About</button>
                {user && (
                  <Link href="/dashboard" className="block rounded-md px-3 py-2 text-base hover:bg-gray-100">Dashboard</Link>
                )}
                <button onClick={() => navigateToSection("contact")} className="block rounded-md px-3 py-2 text-base hover:bg-gray-100">Contact</button>

                {/* Mobile Auth Section */}
                {!initialized && loading ? (
                  <div className="animate-pulse bg-gray-200 h-10 rounded mt-2"></div>
                ) : user ? (
                  <div className="mt-2 space-y-2">
                    <Link
                      href="/profile"
                      className="block rounded-md border border-gray-300 px-3 py-2 text-base font-medium hover:bg-gray-100"
                    >
                      {user.profile?.name || user.email}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left rounded-md bg-black text-white px-3 py-2 text-base font-medium hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
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
