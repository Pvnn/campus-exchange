"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import Link from "next/link";
import { Fragment, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, initialized, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pages that should not have navbar/footer
  const noLayoutPages = ['/login', '/register', '/error'];
  const isDashboard = pathname?.startsWith('/dashboard');

  // Scroll to section if element exists
  const navigateToSection = (id) => {
    setMobileMenuOpen(false); 
    if (pathname === "/") {
      return scrollToId(id);
    }
    router.push("/");
    const attemptScroll = (attempts = 0) => {
      if (attempts > 10) return;
      
      const el = document.getElementById(id);
      if (el) {
        scrollToId(id);
      } else {
        requestAnimationFrame(() => attemptScroll(attempts + 1));
      }
    };
    setTimeout(() => requestAnimationFrame(() => attemptScroll()), 100);
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = 64;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Proper logout handler
  const handleLogout = async () => {
    setMobileMenuOpen(false);
    try {
      await Promise.resolve(logout());
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.replace("/");
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
              <Link href="/" className="text-xl font-bold text-gray-900">
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
      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-50 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="mt-2 space-y-2 px-4">
              <button
                onClick={() => navigateToSection("home")}
                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Home
              </button>
              <Link
                href="/browse"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Resources
              </Link>
              <button
                onClick={() => navigateToSection("about")}
                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                About
              </button>
              {user && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => navigateToSection("contact")}
                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Contact
              </button>
            </div>

            {/* Mobile Auth Section */}
            <div className="space-y-6 border-t border-gray-200 px-4 py-6 mt-6">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
              ) : user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 -m-2 p-2 font-medium text-gray-900"
                  >
                    <UserCircleIcon className="h-6 w-6 text-gray-400" />
                    {user.profile?.name || user.email?.split('@')[0] || 'Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left -m-2 block p-2 font-medium text-gray-900"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Navbar - only on non-dashboard pages */}
      {!isDashboard && (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden hover:text-gray-500"
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <button
                  onClick={() => navigateToSection("home")}
                  className="text-xl font-bold text-gray-900 tracking-tight hover:text-indigo-600 transition-colors"
                >
                  Campus Exchange
                </button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:space-x-8">
                <button
                  onClick={() => navigateToSection("home")}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Home
                </button>
                <Link
                  href="/browse"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Resources
                </Link>
                <button
                  onClick={() => navigateToSection("about")}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  About
                </button>
                {user && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => navigateToSection("contact")}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Contact
                </button>
              </div>

              {/* Desktop Auth Section */}
              <div className="ml-auto flex items-center">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                ) : user ? (
                  <div className="hidden lg:flex lg:items-center lg:space-x-6">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      {user.profile?.name || user.email?.split('@')[0] || 'Profile'}
                    </Link>
                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="hidden lg:flex lg:items-center lg:space-x-6">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Sign in
                    </Link>
                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                    <Link
                      href="/register"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer - only on non-dashboard pages */}
      {!isDashboard && (
        <footer className="border-t p-4 text-center text-sm text-gray-600">
          © 2025 Campus Exchange. All rights reserved.
        </footer>
      )}
    </div>
  );
}
