"use client"

import {useEffect, useState} from "react"
import {
  MoreHorizontal,
  User,
  Command,
  Upload,
  LifeBuoy,
  Navigation2,
  Navigation,
  Folder,
  Send,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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
import { Bot } from "lucide-react"
import { decodeJWT } from "@/lib/actions/jwt_token"

export function AppSidebar({
  setFirstSelect,
  setSecondSelect,
  ...props
}) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    decodeJWT().then((data) => {
      setUser(data)
    })
  }, [])

  const data = {
    navMain: [
      {
        title: "Actions",
        url: "#",
        icon: MoreHorizontal,
        isActive: true,
        items: [
          {
            title: "Profile",
            icon: User
          },
          {
            title: "Upload A File",
            icon: Upload,
          },
          {
            title: "Your Uploads",
            icon: Folder
          },
          {
            title: "Update Your Profile",
            icon: Bot
          },
        ],
      },
      {
        title: "Navigation",
        url: "#",
        icon: Navigation,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    // projects: [
    //   {
    //     name: "Design Engineering",
    //     url: "#",
    //     icon: Frame,
    //   },
    //   {
    //     name: "Sales & Marketing",
    //     url: "#",
    //     icon: PieChart,
    //   },
    //   {
    //     name: "Travel",
    //     url: "#",
    //     icon: Map,
    //   },
    // ],
  }





  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div
                  className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">FOET-Verse</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain setFirstSelect={setFirstSelect} setSecondSelect={setSecondSelect} items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary setFirstSelect={setFirstSelect} setSecondSelect={setSecondSelect} items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}