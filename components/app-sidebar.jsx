"use client"

import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
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
import Image from "next/image"
import { Skeleton } from "./ui/skeleton"

export function AppSidebar({
  user,
  setFirstSelect,
  secondSelect,
  setSecondSelect,
  ...props
}) {

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
      // {
      //   title: "Navigation",
      //   url: "#",
      //   icon: Navigation,
      //   items: [
      //     {
      //       title: "General",
      //       url: "#",
      //     },
      //     {
      //       title: "Team",
      //       url: "#",
      //     },
      //     {
      //       title: "Billing",
      //       url: "#",
      //     },
      //     {
      //       title: "Limits",
      //       url: "#",
      //     },
      //   ],
      // },
    ],
    navSecondary: [
      // {
      //   title: "Support",
      //   url: "#",
      //   icon: LifeBuoy,
      // },
      {
        title: "Feedback",
        url: "/contact",
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
                  className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* <Command className="size-4" /> */}
                  <Image
                    alt=""
                    src="/icon.png"
                    width={40}
                    height={40}
                    className="rounded-full"
                    priority
                  />
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
        {!user ? (
          <div className="grid gap-4 w-[90%] mx-auto mt-5">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden border border-border/40 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">

                  {/* 2. Content Area */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      {/* Title */}
                      <Skeleton className="h-5 w-1/3" />
                    </div>

                    {/* Description/Subtitle */}
                    <Skeleton className="h-4 w-2/3" />

                  </div>

                  {/* 3. Trailing Action (e.g., Download Button) */}
                  <Skeleton className="h-8 w-8 rounded-md shrink-0 ml-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <NavMain secondSelect={secondSelect} setFirstSelect={setFirstSelect} setSecondSelect={setSecondSelect} items={data.navMain} />
            <NavSecondary className={"mt-auto"} setFirstSelect={setFirstSelect} setSecondSelect={setSecondSelect} items={data.navSecondary} />
          </>
        )}

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar >
  );
}