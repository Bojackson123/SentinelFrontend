import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, CpuIcon, BellRingIcon, Settings2Icon, CircleHelpIcon, ShieldIcon } from "lucide-react"
import { useAuth } from "@/stores/auth-store"
import { Link } from "@tanstack/react-router"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isInternal, isCompanyUser } = useAuth();

  const navMain = React.useMemo(() => {
    const items = [
      {
        title: "Dashboard",
        url: "/",
        icon: <LayoutDashboardIcon />,
      },
      {
        title: "Devices",
        url: "/devices",
        icon: <CpuIcon />,
      },
      {
        title: "Alarms",
        url: "/alarms",
        icon: <BellRingIcon />,
      },
    ];
    return items;
  }, []);

  const navSecondary = React.useMemo(() => {
    const items: { title: string; url: string; icon: React.ReactNode }[] = [
      {
        title: "Help",
        url: "#",
        icon: <CircleHelpIcon />,
      },
      {
        title: "Settings",
        url: "#",
        icon: <Settings2Icon />,
      },
    ];
    return items;
  }, []);

  const displayUser = {
    name: user
      ? `${user.firstName} ${user.lastName}`.trim() || user.email
      : "User",
    email: user?.email ?? "",
    avatar: "",
  };

  const roleBadge = isInternal ? "Internal" : isCompanyUser ? "Company" : "Homeowner";

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/">
                <ShieldIcon className="size-5!" />
                <span className="text-base font-semibold">Sentinel</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} roleBadge={roleBadge} />
      </SidebarFooter>
    </Sidebar>
  )
}
