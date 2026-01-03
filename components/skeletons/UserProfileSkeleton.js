import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const UserProfileSkeleton = () => {
  return (
    <div className="container max-w-5xl mx-auto p-4 md:p-10 space-y-10 animate-pulse">
      
      {/* --- Header Section Skeleton --- */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
        {/* Avatar Skeleton */}
        <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-xl" />

        {/* Text Info Skeleton */}
        <div className="flex-1 space-y-3 flex flex-col items-center md:items-start mb-2">
          <Skeleton className="h-10 w-64 md:w-80" /> {/* Name */}
          <Skeleton className="h-5 w-48 md:w-60" />  {/* Email */}
          <div className="pt-2">
            <Skeleton className="h-7 w-28 rounded-full" /> {/* Badge */}
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* --- Academic Details Grid Skeleton --- */}
      <section>
        <Skeleton className="h-6 w-40 mb-4" /> {/* Section Title */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none bg-muted/40">
              <CardContent className="p-4 flex flex-col items-center justify-center space-y-3">
                <Skeleton className="h-5 w-5 rounded-full" /> {/* Icon */}
                <Skeleton className="h-3 w-12" />             {/* Label */}
                <Skeleton className="h-6 w-20" />             {/* Value */}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* --- Activity Metrics Skeleton --- */}
      <section>
        <Skeleton className="h-6 w-40 mb-4" /> {/* Section Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-4 w-20" /> {/* Metric Label */}
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Icon Box */}
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-9 w-12" /> {/* Count */}
                <Skeleton className="h-3 w-24" /> {/* Subtext */}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default UserProfileSkeleton;