"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Manage login state here
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/"); // 👈 redirect to home page when logged out
  };

  const primaryLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    ...(isLoggedIn
      ? [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Contact", href: "/contact" },
        ]
      : [{ name: "Contact", href: "/contact" }]),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Sticky Navbar */}
      <Disclosure
        as="nav"
        className="sticky top-0 z-50 bg-white border-b shadow-sm"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Brand */}
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="text-xl font-bold tracking-tight text-gray-800"
                  >
                    Campus Exchange
                  </Link>
                </div>

                {/* Desktop nav */}
                <div className="hidden md:flex md:items-center md:space-x-6">
                  {primaryLinks.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`hover:text-black transition ${
                          active
                            ? "font-semibold underline underline-offset-4"
                            : "text-gray-600"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Right-side auth controls */}
                <div className="hidden md:flex md:items-center">
                  {!isLoggedIn ? (
                    <div className="ml-4 flex items-center space-x-2">
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
                  ) : (
                    <div className="ml-4 flex items-center space-x-4">
                      <Link
                        href="/details"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-md bg-black text-white px-3 py-2 text-sm font-medium hover:bg-gray-800"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/20">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile panel */}
            <Disclosure.Panel className="md:hidden border-t bg-white">
              <div className="space-y-1 px-4 pb-4 pt-2">
                {primaryLinks.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-base hover:bg-gray-100 ${
                        active ? "font-semibold underline" : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {!isLoggedIn ? (
                  <div className="mt-2 space-y-2">
                    <Link
                      href="/login"
                      className="block rounded-md border border-gray-300 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block rounded-md bg-black text-white px-3 py-2 text-base font-medium hover:bg-gray-800"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    <Link
                      href="/details"
                      className="block rounded-md border border-gray-300 px-3 py-2 text-base font-medium hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left rounded-md bg-black text-white px-3 py-2 text-base font-medium hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Page content */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Campus Exchange. All rights reserved.
      </footer>
    </div>
  );
}
