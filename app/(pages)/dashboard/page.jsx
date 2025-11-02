'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import PdfUploader from "@/components/PdfUploader"
import UserProfileDashboard from "@/components/UserProfileDashboard"
import { decodeJWT } from "@/lib/actions/jwt_token"
import UserUploadsTable from "@/components/UserUploadsTable"
import { UpdateProfileForm } from "@/components/UpdateProfileForm"

export default function Page() {
  const [firstSelect, setFirstSelect] = useState(null)
  const [secondSelect, setSecondSelect] = useState("Profile")
  const [user, setUser] = useState(null)

  useEffect(() => {
    decodeJWT().then((data) => {
      setUser(data)
      console.log("User is: ", data)
    })
  }, [])

  const dummyUser = {
    name: "John Doe",
    email: "sameersharm1234@gmail.com",
    avatar: "/avatars/shadcn.jpg",
    college: "university of delhi",
    course: "B.Tech Computer Science",
    year: "3rd Year",
    semester: "6th Semester",
    uploads: ["file1.pdf", "file2.pdf", "file3.pdf"],
    downloads: ["fileA.pdf", "fileB.pdf"],
    upvotes: ["fileX.pdf", "fileY.pdf", "fileZ.pdf", "fileW.pdf"],
    downvotes: ["fileM.pdf"],
    reports: ["fileR.pdf", "fileS.pdf"],
  }

  return (
    <SidebarProvider>
      <AppSidebar setFirstSelect={setFirstSelect} setSecondSelect={setSecondSelect} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {firstSelect || "Dashboard"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{secondSelect}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}

        {secondSelect === "Profile" && (
          <UserProfileDashboard user={user} />
        )}

        {secondSelect === "Upload A File" && (
          <section>
            <div className="min-h-screen pt-10 transition-colors duration-500">
              <main className="w-full pb-12 mx-auto px-4 max-w-2xl">
                <PdfUploader />
              </main>
            </div>
          </section>
        )}

        {secondSelect === "Your Uploads" && (
          <UserUploadsTable user={user} />
        )}

        {secondSelect === "Update Your Profile" && (
          <UpdateProfileForm currentUserData={user} />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
