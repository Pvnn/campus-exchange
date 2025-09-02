"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const pathname = usePathname();

  const isLoggedIn = true;

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
    <div className="min-h-screen flex flex-col bg-black text-white"> {/* Black background */}
      {/* Navbar */}
      <Disclosure as="nav" className="bg-blue-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Brand */}
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="text-white text-2xl italic font-[cursive]"
                  >
                    Campus Exchange
                  </Link>
                </div>

                {/* Desktop nav */}
                <div className="flex-grow flex justify-center">
                  <div className="hidden md:flex md:items-center md:space-x-6">
                    {primaryLinks.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`text-white/90 hover:text-white transition ${
                            active
                              ? "font-semibold underline underline-offset-4"
                              : ""
                          }`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Right-side auth controls */}
                <div className="hidden md:flex md:items-center">
                  {!isLoggedIn ? (
                    <div className="ml-4 flex items-center space-x-2">
                      <Link
                        href="/login"
                        className="rounded-md bg-white text-blue-600 px-3 py-2 text-sm font-medium shadow hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="rounded-md bg-yellow-400 text-black px-3 py-2 text-sm font-medium shadow hover:bg-yellow-300"
                      >
                        Register
                      </Link>
                    </div>
                  ) : (
                    <div className="ml-4 flex items-center space-x-4">
                      <Link
                        href="/profile"
                        className="rounded-md bg-white/10 text-white px-3 py-2 text-sm font-medium hover:bg-white/20"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        className="rounded-md bg-white text-blue-600 px-3 py-2 text-sm font-medium shadow hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white/50">
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
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-4 pb-4 pt-2">
                {primaryLinks.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-base text-white hover:bg-blue-500 ${
                        active ? "bg-blue-700" : ""
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
                      className="block rounded-md bg-white text-blue-600 px-3 py-2 text-base font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block rounded-md bg-yellow-400 text-black px-3 py-2 text-base font-medium"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    <Link
                      href="/profile"
                      className="block rounded-md bg-white/10 text-white px-3 py-2 text-base font-medium hover:bg-white/20"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      className="w-full text-left rounded-md bg-white text-blue-600 px-3 py-2 text-base font-medium"
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
      <footer className="bg-gray-900 text-center py-4 text-white">
        © {new Date().getFullYear()} Campus Exchange. All rights reserved.
      </footer>
    </div>
  );
}
