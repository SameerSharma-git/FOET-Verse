import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card";

const ResourceLibrarySkeleton = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen">
    
            {/* --- HEADER SKELETON --- */}
            <div className="mb-8 space-y-2">
                <Skeleton className="h-10 w-64" /> {/* Title */}
                <Skeleton className="h-5 w-96 max-w-full" /> {/* Subtitle */}
            </div>
    
            {/* --- CONTROLS BAR SKELETON --- */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6 bg-card p-4 rounded-lg border shadow-sm">
    
                {/* Search Bar Skeleton */}
                <div className="relative w-full lg:w-96">
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
    
                {/* Filters Group Skeleton */}
                <div className="flex flex-wrap flex-1 gap-2 items-center">
                    <Skeleton className="h-9 w-24 rounded-md" /> {/* Type Filter */}
                    <Skeleton className="h-9 w-24 rounded-md" /> {/* Branch Filter */}
                    <Skeleton className="h-9 w-28 rounded-md" /> {/* Year Select */}
                </div>
    
                {/* Sort Control Skeleton */}
                <div className="shrink-0">
                    <Skeleton className="h-9 w-40 rounded-md" />
                </div>
            </div>
    
            {/* --- LIST AREA SKELETON --- */}
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border border-border/50 shadow-sm overflow-hidden">
                        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
    
                            {/* File Icon Skeleton */}
                            <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
    
                            {/* Text Content Skeleton */}
                            <div className="flex-1 space-y-3 w-full">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-3/4 md:w-1/2" /> {/* File Name */}
                                        <div className="flex gap-2">
                                            <Skeleton className="h-4 w-20" /> {/* Metadata 1 */}
                                            <Skeleton className="h-4 w-20" /> {/* Metadata 2 */}
                                        </div>
                                    </div>
                                    <Skeleton className="h-6 w-16 rounded-full shrink-0" /> {/* Badge */}
                                </div>
    
                                {/* Bottom Row: User & Stats */}
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-6 w-6 rounded-full" /> {/* Avatar */}
                                        <Skeleton className="h-4 w-24" /> {/* Username */}
                                    </div>
                                    <div className="flex gap-3">
                                        <Skeleton className="h-4 w-8" /> {/* Votes */}
                                        <Skeleton className="h-4 w-8" /> {/* Comments */}
                                    </div>
                                </div>
                            </div>
    
                            {/* Action Buttons Skeleton */}
                            <div className="flex md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                                <Skeleton className="h-9 w-full md:w-28 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
    
            {/* --- PAGINATION SKELETON --- */}
            <div className="flex items-center justify-end space-x-2 py-8">
                <div className="flex-1">
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
  )
}

export default ResourceLibrarySkeleton
