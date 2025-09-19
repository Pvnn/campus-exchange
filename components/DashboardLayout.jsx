"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

function getBreadcrumbs(pathname) {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs = []

  if (segments.length === 1 && segments[0] === "dashboard") {
    return [{ label: "Dashboard", href: "/dashboard", isLast: true }]
  }

  breadcrumbs.push({ label: "Dashboard", href: "/dashboard", isLast: false })

  if (segments[1] === "resources") {
    breadcrumbs.push({ label: "Resources", href: "/dashboard/resources", isLast: true })
  } else if (segments[1] === "transactions") {
    breadcrumbs.push({ label: "Transactions", href: "/dashboard/transactions", isLast: true })
  } else if (segments[1] === "messages") {
    breadcrumbs.push({ label: "Messages", href: "/dashboard/messages", isLast: true })
  }

  return breadcrumbs
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-14 mb-8 shrink-0 items-center gap-2 border-b bg-white/50 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 h-8 w-8" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.href} className="flex items-center">
                    <BreadcrumbItem className="hidden md:block">
                      {breadcrumb.isLast ? (
                        <BreadcrumbPage className="text-sm font-medium">{breadcrumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={breadcrumb.href} className="text-sm text-gray-600 hover:text-gray-900">
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!breadcrumb.isLast && <BreadcrumbSeparator className="hidden md:block" />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-10 pt-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
