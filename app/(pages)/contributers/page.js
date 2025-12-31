"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UploadCloud,
  Users,
  Trophy,
  Search,
  ExternalLink,
  Loader2
} from "lucide-react";
import Link from 'next/link';
import { findUsers } from '@/lib/actions/userActions';

/**
 * MOCK DATA
 * Following your userSchema structure
 */
const MOCK_USERS = [
  { _id: '1', name: 'Aryan Sharma', course: 'Btech', branch: 'CSE', uploads: new Array(15), followers: new Array(42), profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan', college: "University of Lucknow" },
  { _id: '2', name: 'Isha Gupta', course: 'Btech', branch: 'IT', uploads: new Array(8), followers: new Array(21), profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isha', college: "University of Lucknow" },
  { _id: '3', name: 'Vikram Singh', course: 'Btech', branch: 'ME', uploads: new Array(24), followers: new Array(105), profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', college: "University of Lucknow" },
  { _id: '4', name: 'Ananya Rai', course: 'Btech', branch: 'EE', uploads: new Array(5), followers: new Array(12), profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya', college: "University of Lucknow" },
  { _id: '5', name: 'Rohan Verma', course: 'Btech', branch: 'Civil', uploads: new Array(12), followers: new Array(30), profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan', college: "University of Lucknow" },
  { _id: '6', name: 'Sanya Mirza', course: 'Btech', branch: 'CSE', uploads: new Array(7), followers: new Array(54), profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanya', college: "University of Lucknow" },
  { _id: '7', name: 'Kabir Das', course: 'Btech', branch: 'IT', uploads: new Array(19), followers: new Array(88), profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir', college: "University of Lucknow" },
  { _id: '8', name: 'Meera Bai', course: 'Btech', branch: 'CSE', uploads: new Array(3), followers: new Array(15), profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera', college: "University of Lucknow" },
];

export default function ContributorsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Simulate Async Fetching from MongoDB
  useEffect(() => {
    findUsers({}).then(data => {
      data && setUsers(data);
      setLoading(false);
    });
    // setUsers(MOCK_USERS);
  }, []);

  // Filter & Pagination Logic
  const filteredUsers = useMemo(() => {
  
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);
  
  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);
  const paginatedUsers = filteredUsers?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  return (
    <div className="min-h-screen px-6 md:p-12">
      <div className="max-w-7xl mx-auto">

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold tracking-tight">
              <Trophy className="w-5 h-5" />
              <span>COMMUNITY RECOGNITION</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              Our Contributors
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md">
              Meet the scholars helping fellow students by sharing high-quality notes and resources.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or branch..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* --- Loading State --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-none shadow-md overflow-hidden">
                <div className="h-24 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <CardHeader className="flex flex-col items-center -mt-12">
                  <Skeleton className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-950" />
                  <Skeleton className="h-5 w-32 mt-4" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="col-span-full flex justify-center py-10 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Fetching from University Database...</span>
            </div>
          </div>
        ) : users?.length === 0 ? (
          <div className="p-10 h-[35vh] flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-4xl font-bold">No User Found</h2>
            <p className="text-muted-foreground">Double check url. Please check back later or try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {/* --- Grid Section --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <Card key={user._id} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-zinc-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity" />

                    <CardHeader className="flex flex-col items-center -mt-12 pt-0 space-y-3">
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-105 transition-transform duration-300">
                          <AvatarImage src={user.profilePicture} alt={user.name} />
                          <AvatarFallback className="text-xl font-bold bg-slate-100">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-1 right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900" />
                      </div>

                      <div className="text-center">
                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{user.college}</p>
                      </div>

                      <Badge variant="secondary" className="font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-none">
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                        {user.branch} • {user.course}
                      </Badge>
                    </CardHeader>

                    <CardContent className="pt-6 border-t border-slate-50 dark:border-slate-800/50">
                      <div className="flex justify-between items-center px-2">
                        <div className="text-center">
                          <p className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center">
                            <UploadCloud className="w-4 h-4 mr-1 text-blue-500" />
                            {user.uploads.length}
                          </p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Uploads</p>
                        </div>
                        <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                        <div className="text-center">
                          <p className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center">
                            <Users className="w-4 h-4 mr-1 text-green-500" />
                            {user.followers.length}
                          </p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Followers</p>
                        </div>
                      </div>

                      <Button asChild className="w-full mt-6 rounded-xl font-bold group/btn shadow-md hover:shadow-primary/20 transition-all">
                        <Link href={`/user-profile/${user._id}`}>View Profile</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-400 text-lg font-medium">No contributors found for &quot;{searchTerm}&quot;</p>
                </div>
              )}
            </div>

            {/* --- Pagination Controls --- */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center mt-16 gap-4">
                <div className="flex items-center bg-white dark:bg-zinc-900 p-1 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="px-4 flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${currentPage === i + 1
                            ? "bg-primary text-white dark:text-black shadow-lg shadow-primary/30"
                            : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}