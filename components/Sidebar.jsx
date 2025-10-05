"use client"
import { Home, Package, TrendingUp, MessageCircle, Users, Settings, LogOut } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: Package,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: TrendingUp,
    },
    {
      title: "Messages",
      url: "/dashboard/messages",
      icon: MessageCircle,
    },
  ],
}

export function AppSidebar({ user, ...props }) {
  const pathname = usePathname()
  const router = useRouter();
  const { logout } = useAuth();
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
    <Sidebar collapsible="icon" className="border-r-0 shadow-sm z-50" {...props}>
      <SidebarContent className="gap-0">
        <div className="flex h-12 items-center justify-center border-b px-2">
          <img 
            src="/icon.png" 
            alt="Campus Exchange" 
            className="size-8 rounded-lg"
          />
        </div>

        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2 py-2">
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-10 w-10 group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:w-10"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" />
                      <span className="group-data-[collapsible=icon]/sidebar-wrapper:sr-only">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-2 py-2">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <div className="flex items-center justify-center group-data-[collapsible=icon]/sidebar-wrapper:px-0 px-2 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-indigo-600 text-white text-xs cursor-pointer" onClick={()=>router.push("/profile")}>
                  {user?.profile?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2 grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                <span className="truncate font-medium text-xs">
                  {user?.profile?.name || user?.email?.split("@")[0] || "User"}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Sign Out"
              className="h-8 w-8 group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:w-8"
            >
              <button onClick={handleLogout} className="flex items-center gap-2 w-full">
                <LogOut className="size-4" />
                <span className="group-data-[collapsible=icon]/sidebar-wrapper:sr-only text-xs">Sign Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
