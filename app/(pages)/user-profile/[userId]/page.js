"use client"

import * as React from "react"
import {
    LoaderCircle, Filter, Download, BookOpen, Search,
    ArrowUp, ArrowDown, MessageSquare, FileText, Send,
    Mail, GraduationCap, Building2, Calendar, BookOpenCheck,
    UserPlus, UserCheck, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight,
    UserX,
    ArrowLeft,
    Link
} from "lucide-react"
import {
    getCoreRowModel, useReactTable,
} from "@tanstack/react-table"

// --- UI Imports ---
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from "next/navigation"
import { decodeJWT } from "@/lib/actions/jwt_token"
import { findMongoUserById, findUserById, updateUser } from "@/lib/actions/userActions"
import { GeneralAlert } from "@/components/GeneralAlert"
import { findFiles } from "@/lib/actions/fileActions"
import FileCard from "@/components/UploadedFilesList"
import UserIdSkeleton from "@/components/skeletons/userIdSkeleton"
import Home from "@/app/page"

// --- MOCK API HELPER (Replace with your actual Server Actions) ---
// Simulates fetching file details for a specific page of IDs
const mockFetchFiles = async (userId, pageIndex, pageSize, filters, sort) => {
    // SIMULATED NETWORK DELAY
    await new Promise(resolve => setTimeout(resolve, 1500));

    // GENERATE MOCK DATA (In real app, fetch from DB using userId and pagination)
    const allMockFiles = Array.from({ length: 50 }).map((_, i) => ({
        _id: `f${i}`,
        original_File_Name: `Resource_File_${i + 1}_${i % 2 === 0 ? 'Notes' : 'PYQ'}.pdf`,
        resource_type: i % 2 === 0 ? "notes" : "PYQ",
        course: "B.Tech",
        Branch: i % 3 === 0 ? "CSE" : "ECE",
        subject: i % 2 === 0 ? "Data Structures" : "Electronics",
        year: (i % 4) + 1,
        semester: (i % 8) + 1,
        secure_url: "https://example.com/pdf",
        upvotes: [],
        downvotes: [],
        uploadedAt: new Date(Date.now() - i * 86400000).toISOString(),
        comments: []
    }));

    // Simulate Server-Side Filtering
    let filtered = allMockFiles;
    if (filters.length > 0) {
        // Simple mock implementation of server filtering
        const typeFilter = filters.find(f => f.id === 'resource_type');
        const branchFilter = filters.find(f => f.id === 'Branch');
        if (typeFilter) filtered = filtered.filter(f => typeFilter.value.includes(f.resource_type));
        if (branchFilter) filtered = filtered.filter(f => branchFilter.value.includes(f.Branch));
    }

    // Simulate Server-Side Pagination
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const pageData = filtered.slice(start, end);

    return {
        data: pageData,
        totalCount: filtered.length // Important for calculating total pages
    };
};

const mockUserProfile = {
    "id": "u_001",
    "name": "Alex Rivera",
    "email": "alex.rivera@university.edu",
    "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    "college": "Stanford University",
    "course": "Computer Science",
    "year": 3,
    "enrolledCourses": ["CS101", "CS102", "MATH201"],
    "savedNotes": ["note_88", "note_92"],
    "createdAt": "2023-09-01T10:00:00Z"
}

// --- MAIN PAGE ---

export default function UserProfilePage() {
    const { userId } = useParams();

    // 1. User State
    const [loggedUser, setLoggedUser] = React.useState(null);
    const [userProfile, setUserProfile] = React.useState(null);
    const [isUserLoading, setIsUserLoading] = React.useState(true);

    // 2. Files State (Server-Side Pagination)
    const [files, setFiles] = React.useState([]);
    const [isFilesLoading, setIsFilesLoading] = React.useState(false);
    const [totalFilesCount, setTotalFilesCount] = React.useState(0);

    // 3. Follow Logic State
    const [isFollowing, setIsFollowing] = React.useState(false);
    const [followersCount, setFollowersCount] = React.useState(0);
    const [isLoadingFollow, setIsLoadingFollow] = React.useState(false);

    // 4. Table State
    const [sorting, setSorting] = React.useState([{ id: 'uploadedAt', desc: true }]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 5,
    });

    // Alert States
    const [toAlert, setToAlert] = React.useState(false);
    const [alertTitle, setAlertTitle] = React.useState("");
    const [alertMessage, setAlertMessage] = React.useState("");

    const [isFollowingDisabled, setIsFollowingDisabled] = React.useState(false);

    // --- EFFECT 1: Fetch User on Mount ---
    React.useEffect(() => {
        const initUser = async () => {
            try {
                // Fetch logged in user
                const tokenUser = await decodeJWT();
                tokenUser && setLoggedUser(tokenUser);

                // Fetch Profile User
                const user = await findUserById(userId);

                (userId === tokenUser?._id) && setIsFollowingDisabled(true);

                if (user) {
                    setUserProfile(user);
                    setFollowersCount(user.followers?.length || 0);
                    // Check follow status based on the fetched users
                    if (tokenUser && user.followers?.includes(tokenUser._id)) {
                        setIsFollowing(true);
                    }
                }
            } catch (error) {
                console.error("Failed to load user", error);
            } finally {
                setIsUserLoading(false);
            }
            // setUserProfile(mockUserProfile)
        };

        if (userId) initUser();
    }, [userId]);

    // --- EFFECT 2: Fetch Files (Triggered by User Load OR Table Changes) ---
    React.useEffect(() => {
        // Only fetch files if we have a valid user profile
        if (!userProfile) return;

        const fetchUploads = async () => {
            setIsFilesLoading(true);
            try {
                // Here we pass the user ID and the current pagination/filter state to the backend
                // In a real app: await getFilesByUserId(userProfile._id, pagination.pageIndex, pagination.pageSize, ...)

                // const response = await mockFetchFiles(
                //     userProfile._id,
                //     pagination.pageIndex,
                //     pagination.pageSize,
                //     columnFilters,
                //     sorting
                // );

                const fetchedFiles = await findFiles({ uploadedByUser: userId });

                // setFiles(response.data);
                // setTotalFilesCount(response.pageCount);
                setFiles(fetchedFiles);
                setTotalFilesCount(fetchedFiles.length);
            } catch (error) {
                console.error("Failed to fetch uploads", error);
            } finally {
                setIsFilesLoading(false);
            }
        };

        fetchUploads();

    }, [userProfile, pagination, columnFilters, sorting, userId]); // Dependencies ensure progressive fetching


    // --- HANDLERS ---
    const handleFollowToggle = async () => {
        if (!loggedUser) {
            setAlertTitle("Not Logged In!");
            setAlertMessage(`You must login to follow ${userProfile?.name}.`)
            setToAlert(true);
            return null
        };
        setIsLoadingFollow(true);

        try {
            const author = await findUserById(userProfile._id);

            if (!isFollowing) {
                updateUser({ _id: author._id },
                    { $addToSet: { followers: loggedUser._id } });
                updateUser({ _id: loggedUser._id },
                    { $addToSet: { following: author._id } });
            } else {
                updateUser({ _id: author._id },
                    { $pull: { followers: loggedUser._id } });
                updateUser({ _id: loggedUser._id },
                    { $pull: { following: author._id } });
            }

            // Optimistic Update
            const newStatus = !isFollowing;
            setIsFollowing(newStatus);
            setFollowersCount(prev => newStatus ? prev + 1 : prev - 1);
        } catch (error) {
            console.error("Error occured while following: ", error)
        } finally {
            setIsLoadingFollow(false);
        }
    };

    // --- TABLE CONFIGURATION ---
    const columns = React.useMemo(() => [
        { accessorKey: "original_File_Name" },
        { accessorKey: "resource_type" },
        { accessorKey: "course" },
        { accessorKey: "Branch" },
        { accessorKey: "uploadedAt" },
    ], []);

    const table = useReactTable({
        data: files,
        columns,
        pageCount: Math.ceil(totalFilesCount / pagination.pageSize), // Tell table how many pages exist total
        manualPagination: true, // IMPORTANT: We are handling pagination server-side
        manualFiltering: true,  // IMPORTANT: We are handling filtering server-side
        manualSorting: true,    // IMPORTANT: We are handling sorting server-side
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        state: { sorting, columnFilters, pagination },
    });

    // Helper options for dropdowns (hardcoded or fetched separately in real app)
    const uniqueBranches = ["CSE", "ECE", "ME", "CE"];
    const uniqueTypes = ["notes", "PYQ", "assignment"];

    const getFilter = (key) => table.getColumn(key)?.getFilterValue() || [];
    const handleFilterChange = (key, value) => {
        table.getColumn(key)?.setFilterValue(value);
        // Reset to page 0 when filtering changes to avoid empty pages
        table.setPageIndex(0);
    };

    // --- RENDER: LOADING STATE (User) ---
    if (isUserLoading) {
        return <UserIdSkeleton />;
    }

    // --- RENDER: NOT FOUND STATE ---
    if (!userProfile) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center bg-background px-4 text-center animate-in fade-in duration-500">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                    <UserX className="h-10 w-10 text-muted-foreground" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Profile Not Found
                </h2>

                <p className="mt-2 max-w-[400px] text-muted-foreground">
                    The user profile you are looking for doesn&apos;t exist or may have been moved.
                    Please check the URL or try searching for another student.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>

                    <Button
                        asChild
                    >
                        <Link className="flex items-center justify-center gap-3" href="/">
                            <Home className="h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    // --- RENDER: MAIN CONTENT ---
    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Alert Dialog */}
            <GeneralAlert
                open={toAlert}
                onOpenChange={() => setToAlert(!toAlert)}
                title={alertTitle}
                description={alertMessage}
            />

            {/* 1. HERO / PROFILE SECTION */}
            <div className="w-full bg-muted/30 border-b animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Avatar */}
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
                            <AvatarImage src={userProfile.profilePicture} className="object-cover" />
                            <AvatarFallback className="text-4xl">{userProfile.name?.[0]}</AvatarFallback>
                        </Avatar>

                        {/* Details */}
                        <div className="flex-1 text-center md:text-left space-y-4 w-full">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">{userProfile.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-1">
                                        <Mail className="h-4 w-4" />
                                        <span>{userProfile.email}</span>
                                    </div>
                                    <div className="mt-2 text-sm font-medium text-muted-foreground">
                                        {followersCount} Followers • {userProfile.following?.length || 0} Following
                                    </div>
                                </div>

                                <Button
                                    onClick={handleFollowToggle}
                                    disabled={isLoadingFollow || isFollowingDisabled}
                                    variant={isFollowing ? "outline" : "default"}
                                    className={`min-w-[120px] transition-all ${isFollowing ? "border-primary text-primary hover:bg-primary/5" : "shadow-md hover:scale-105"}`}
                                >
                                    {isLoadingFollow ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                    ) : isFollowing ? (
                                        <>
                                            <UserCheck className="h-4 w-4 mr-2" /> Following
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4 mr-2" /> Follow
                                        </>
                                    )}
                                </Button>
                            </div>

                            <Separator className="hidden md:block my-4" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-sm">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">College</p>
                                        <p className="font-semibold text-sm text-wrap max-w-[150px]" title={userProfile.college}>{userProfile.college}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-sm">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Course</p>
                                        <p className="font-semibold text-sm">{userProfile.course} : {userProfile.branch}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-sm">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Year - Sem</p>
                                        <p className="font-semibold text-sm">Year {userProfile.year} - Sem {userProfile.semester}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-sm">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Total Uploads</p>
                                        <p className="font-semibold text-sm">{totalFilesCount} Files</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. UPLOADS SECTION */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Uploaded Resources</h2>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-2 z-10 bg-background/95 backdrop-blur py-2 rounded-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search files..."
                            value={(table.getColumn("original_File_Name")?.getFilterValue() ?? "")}
                            onChange={(e) => handleFilterChange("original_File_Name", e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-dashed">
                                    <Filter className="mr-2 h-4 w-4" /> Type
                                    {getFilter("resource_type").length > 0 && (
                                        <Badge variant="secondary" className="ml-2 h-5 px-1">{getFilter("resource_type").length}</Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {uniqueTypes.map((type) => (
                                    <DropdownMenuCheckboxItem
                                        key={type}
                                        checked={getFilter("resource_type").includes(type)}
                                        onCheckedChange={(checked) => {
                                            const current = getFilter("resource_type");
                                            const next = checked ? [...current, type] : current.filter((t) => t !== type);
                                            handleFilterChange("resource_type", next);
                                        }}
                                        className="capitalize"
                                    >
                                        {type}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-dashed">
                                    Branch
                                    {getFilter("Branch").length > 0 && (
                                        <Badge variant="secondary" className="ml-2 h-5 px-1">{getFilter("Branch").length}</Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {uniqueBranches.map((branch) => (
                                    <DropdownMenuCheckboxItem
                                        key={branch}
                                        checked={getFilter("Branch").includes(branch)}
                                        onCheckedChange={(checked) => {
                                            const current = getFilter("Branch");
                                            const next = checked ? [...current, branch] : current.filter((t) => t !== branch);
                                            handleFilterChange("Branch", next);
                                        }}
                                    >
                                        {branch}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {(columnFilters.length > 0) && (
                            <Button variant="ghost" onClick={() => {
                                setColumnFilters([]);
                                table.resetGlobalFilter();
                                table.setPageIndex(0);
                            }}>
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* File List / Loading State */}
                <div className="space-y-4">
                    {isFilesLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm">Fetching resources...</p>
                        </div>

                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <FileCard
                                key={row.original._id}
                                file={row.original}
                                user={userProfile}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
                            <p className="text-muted-foreground">No resources found matching your filters.</p>
                        </div>
                    )}
                </div>

                {/* --- PAGINATION CONTROLS --- */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t">
                    <div className="flex-1 text-sm text-muted-foreground text-center md:text-left">
                        Showing {pagination.pageIndex * pagination.pageSize + 1} to {" "}
                        {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalFilesCount)} of {" "}
                        {totalFilesCount} files
                    </div>

                    <div className="flex flex-col sm:flex-row items-center space-x-2 gap-2">
                        {/* Rows per page selector */}
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[5, 10, 20, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Pagination Buttons */}
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage() || isFilesLoading}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage() || isFilesLoading}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </div>

                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage() || isFilesLoading}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage() || isFilesLoading}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}