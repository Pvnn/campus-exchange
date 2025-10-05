"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardLayout({ children }) {
  const { user } = useAuth()

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} />
      <SidebarInset>
        {/* Mobile sidebar trigger - only shows on small screens */}
        <div className="flex lg:hidden items-center gap-2 px-4 py-3 border-b bg-white">
          <SidebarTrigger className="h-8 w-8" />
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 flex-col gap-6 p-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
