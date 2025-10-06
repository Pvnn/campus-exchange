"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserCircleIcon } from "@heroicons/react/24/outline"

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await Promise.resolve(logout());
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.replace("/");
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} />
      
      {/* Navbar OUTSIDE SidebarInset */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh)]">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 lg:px-8">
          {/* Mobile trigger */}
          <div className="lg:hidden mr-4">
            <SidebarTrigger className="h-8 w-8" />
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 tracking-tight hover:text-indigo-600 transition-colors"
          >
            Campus Exchange
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 items-center justify-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Resources
            </Link>
            <button
              onClick={() => router.push('/#about')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </button>
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => router.push('/#contact')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* User Section */}
          {user && (
            <div className="hidden lg:flex items-center space-x-6">
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
          )}
        </header>

        {/* Main content */}
        <div className="flex-1 p-10">
          {children}
        </div>

        {/* Dashboard footer */}
        <footer className="border-t p-4 text-center text-sm text-gray-600 mt-auto">
          © 2025 Campus Exchange. All rights reserved.
        </footer>
      </div>
    </SidebarProvider>
  )
}
