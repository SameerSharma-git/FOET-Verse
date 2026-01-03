import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function UserIdSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-10 animate-pulse">
      {/* 1. HERO / PROFILE SECTION SKELETON */}
      <div className="w-full bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* Avatar Skeleton */}
            <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background shadow-xl" />

            {/* Details Skeleton */}
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-2 flex flex-col items-center md:items-start">
                  <Skeleton className="h-10 w-48 md:w-64" /> {/* Name */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-40" /> {/* Email */}
                  </div>
                  <Skeleton className="h-4 w-32 mt-2" /> {/* Followers Count */}
                </div>
                
                <Skeleton className="h-10 w-32 rounded-md" /> {/* Follow Button */}
              </div>

              <Separator className="hidden md:block my-4" />

              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-sm">
                    <Skeleton className="h-9 w-9 rounded-full" /> {/* Icon Circle */}
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-12" /> {/* Label */}
                      <Skeleton className="h-4 w-24" /> {/* Value */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. UPLOADS SECTION SKELETON */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" /> {/* Title */}
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Skeleton className="h-10 flex-1 rounded-md" /> {/* Search bar */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" /> {/* Filter 1 */}
            <Skeleton className="h-10 w-24 rounded-md" /> {/* Filter 2 */}
          </div>
        </div>

        {/* File Cards List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-l-4 border-l-muted">
              <div className="flex flex-col md:flex-row">
                {/* File Preview Thumb Skeleton */}
                <div className="w-full md:w-32 bg-muted/50 flex items-center justify-center min-h-[120px]">
                  <Skeleton className="h-10 w-10" />
                </div>
                
                {/* File Info Skeleton */}
                <div className="flex-1 p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48 md:w-72" /> {/* Filename */}
                      <Skeleton className="h-4 w-32" />        {/* Subject */}
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" /> {/* Badge */}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-24 rounded-full" /> {/* Vote Pill */}
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20 rounded-md" /> {/* Action 1 */}
                      <Skeleton className="h-8 w-20 rounded-md" /> {/* Action 2 */}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}