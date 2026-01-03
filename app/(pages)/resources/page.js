"use client"

export const dynamic = "force-dynamic";

import * as React from "react"
import { Suspense } from "react";
import {
    LoaderCircle, Filter, Download, BookOpen, Search,
    ArrowUp, ArrowDown, MessageSquare, FileText, Send,
    ChevronLeft, ChevronRight,
    Flag
} from "lucide-react"
import {
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel, useReactTable,
} from "@tanstack/react-table"

// --- UI Imports (shadcn/ui) ---
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import FileCard from "@/components/UploadedFilesList"

import { findFileById, findFiles } from "@/lib/actions/fileActions"
import { decodeJWT } from "@/lib/actions/jwt_token"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import ResourceLibrarySkeleton from "@/components/skeletons/ResourceLibrarySkeleton";

// --- CONSTANTS ---
const RESOURCE_TYPES = ['notes', 'PYQ', 'DPP', 'syllabus', 'marking-scheme', 'prev-year-paper', 'other'];

// --- DUMMY DATA (Matching your Mongoose Schema) ---
const DUMMY_DATA = [
    {
        _id: "65f2a1b3c9e7890012a1b2c3",
        original_File_Name: "Data_Structures_Unit1_Notes.pdf",
        cloudinary_Public_Id: "notes/ds_unit1_xyz123",
        secure_url: "https://res.cloudinary.com/demo/image/upload/v1680000000/sample.pdf",
        course: "B.Tech",
        Branch: "CSE",
        subject: "Data Structures",
        year: 2,
        semester: 3,
        resource_type: "notes",
        uploadedByUser: "65f111111111111111111111",
        uploadedAt: "2024-02-15T10:30:00.000Z",
        upvotes: ["u1", "u2", "u3", "u4"], // Array of user IDs
        downvotes: [],
        comments: [
            {
                _id: "c1",
                text: "The diagram on page 4 explains the linked list concept perfectly.",
                createdAt: "2024-02-16T09:00:00.000Z",
                user: {
                    _id: "u2",
                    name: "Rohan Das",
                    profilePicture: "https://i.pravatar.cc/150?img=11",
                    branch: "CSE",
                    year: 2
                }
            }
        ],
        reports: []
    },
    {
        _id: "65f2a1b3c9e7890012a1b2c4",
        original_File_Name: "Engineering_Physics_2023_PYQ.pdf",
        cloudinary_Public_Id: "pyq/phy_2023_abc456",
        secure_url: "https://res.cloudinary.com/demo/image/upload/v1680000000/sample_doc.pdf",
        course: "B.Tech",
        Branch: "EEE",
        subject: "Engineering Physics",
        year: 1,
        semester: 1,
        resource_type: "PYQ",
        uploadedByUser: "65f999999999999999999999",
        uploadedAt: "2023-11-10T14:20:00.000Z",
        upvotes: ["u1", "u5", "u6", "u7", "u8", "u9"],
        downvotes: ["u10"],
        comments: [],
        reports: []
    },
    {
        _id: "65f2a1b3c9e7890012a1b2c5",
        original_File_Name: "Microprocessors_Lab_Manual_Final.docx",
        cloudinary_Public_Id: "other/mp_lab_manual_789",
        secure_url: "#", // No preview
        course: "B.Tech",
        Branch: "ECE",
        subject: "Microprocessors",
        year: 3,
        semester: 5,
        resource_type: "other",
        uploadedByUser: "65f888888888888888888888",
        uploadedAt: "2024-01-05T16:45:00.000Z",
        upvotes: ["u1"],
        downvotes: [],
        comments: [
            {
                _id: "c2",
                text: "Is this the updated 2024 syllabus version?",
                createdAt: "2024-01-06T10:00:00.000Z",
                user: {
                    _id: "u5",
                    name: "Priya K",
                    profilePicture: "https://i.pravatar.cc/150?img=5",
                    branch: "ECE",
                    year: 3
                }
            },
            {
                _id: "c3",
                text: "Yes, professor confirmed it yesterday.",
                createdAt: "2024-01-06T12:30:00.000Z",
                user: {
                    _id: "u8",
                    name: "Amit Singh",
                    profilePicture: "https://i.pravatar.cc/150?img=3",
                    branch: "ECE",
                    year: 3
                }
            }
        ],
        reports: []
    },
    {
        _id: "65f2a1b3c9e7890012a1b2c6",
        original_File_Name: "Chemistry_DPP_Solutions_Set4.pdf",
        downloads: 5,
        cloudinary_Public_Id: "dpp/chem_set4_sol",
        secure_url: "https://res.cloudinary.com/demo/image/upload/v1680000000/chem.pdf",
        course: "B.Tech",
        Branch: "CSE-AI",
        subject: "Organic Chemistry",
        year: 1,
        semester: 2,
        resource_type: "DPP",
        uploadedByUser: "65f777777777777777777777",
        uploadedAt: "2024-03-01T08:15:00.000Z",
        upvotes: Array(15).fill("id"),
        downvotes: Array(2).fill("id"),
        comments: [],
        reports: []
    }
];

// --- UTILITY HOOKS ---
function useUniqueValues(data, key) {
    return React.useMemo(() => {
        if (!data) return [];
        return Array.from(new Set(data.map(item => item[key]).filter(Boolean))).sort();
    }, [data, key]);
}

// --- TABLE COLUMNS CONFIGURATION ---
const columns = [
    { accessorKey: "_id" },
    { accessorKey: "original_File_Name" },
    { accessorKey: "resource_type", filterFn: "arrIncludes" },
    { accessorKey: "course", filterFn: "arrIncludes" },
    { accessorKey: "Branch", filterFn: "arrIncludes" },
    {
        accessorKey: "year",
        filterFn: (row, id, value) => (value ? row.getValue(id) === parseInt(value) : true)
    },
    {
        accessorKey: "semester",
        filterFn: (row, id, value) => (value ? row.getValue(id) === parseInt(value) : true)
    },
    { accessorKey: "uploadedAt" },
    // Custom Accessors for Array Lengths
    {
        id: "upvotes",
        accessorFn: (row) => row.upvotes ? row.upvotes.length : 0,
    },
    {
        id: "comments",
        accessorFn: (row) => row.comments ? row.comments.length : 0,
        sortingFn: (rowA, rowB) => {
            const lenA = rowA.original.comments?.length || 0;
            const lenB = rowB.original.comments?.length || 0;
            return lenA - lenB;
        }
    }
];


// --- MAIN PAGE COMPONENT ---
function ResourceLibraryContent() {
    // 1. DATA STATE
    const [data, setData] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const router = useRouter();

    React.useEffect(() => {
        findFiles({}).then(files => {
            if (files) setData(files);
            setIsLoading(false);
        });
        decodeJWT().then((payload) => {
            setUser(payload)
        });
    }, []);

    // 2. TABLE STATE
    const [sorting, setSorting] = React.useState([{ id: 'uploadedAt', desc: true }]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const pageSize = 5; // Show 5 items per page

    const filterFns = {
        arrIncludes: (row, id, value) => value.includes(row.getValue(id)),
    };

    const table = useReactTable({
        data,
        columns,
        filterFns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
    sorting,
    columnFilters,
  },
  initialState: {
    pagination: {
      pageSize: 5,
    },
  },
        // We let the table manage pagination state internally for simplicity,
        // but we could lift it out if needed.
    });

    // 3. FILTER UTILS
    const uniqueCourses = useUniqueValues(data, 'course');
    const uniqueBranches = useUniqueValues(data, 'Branch');
    const uniqueYears = useUniqueValues(data, 'year');
    const uniqueSemesters = useUniqueValues(data, 'semester');

    // Helper to get current filter arrays
    const getFilter = (key) => table.getColumn(key)?.getFilterValue() || [];

    // Helper to set filters
    const handleFilterChange = (key, value, isMulti) => {
        if (isMulti) {
            table.getColumn(key)?.setFilterValue(value);
        } else {
            const val = value === 'all' ? '' : value;
            table.getColumn(key)?.setFilterValue(val);
        }
    };

    const clearFilters = () => {
        setColumnFilters([]);
        table.resetGlobalFilter();
    };

    const searchParams = useSearchParams();

    React.useEffect(() => {
        const searchFileId = searchParams.get('fileId');
        async function async() {
            if (searchFileId) {
                const file = await findFileById(searchFileId);
                !file && router.push('/resources')

                setData([file]);
                table.getColumn("original_File_Name")?.setFilterValue((file?.original_File_Name) ? file?.original_File_Name : "")
            } else {
                table.getColumn("original_File_Name")?.setFilterValue("")
                table.getColumn("_id")?.setFilterValue("");
            }
        }
        async()
    }, [searchParams, router, table])


    // 4. RENDER
    if (isLoading) return <ResourceLibrarySkeleton />

    if (data?.length === 0 && isLoading) {
        return <div className="p-10 h-[90vh] flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-4xl font-bold">No Resources Found</h2>
            <p className="text-muted-foreground">It seems there are no resources available at the moment. Please check back later or try adjusting your filters.</p>
        </div>
    }

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen">

            <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Resource Library</h1>
                <p className="text-muted-foreground">Browse notes, papers, and study materials uploaded by peers.</p>
            </div>

            {/* --- CONTROLS BAR --- */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6 bg-card p-4 rounded-lg border shadow-sm">

                {/* Search */}
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by file name..."
                        value={(table.getColumn("original_File_Name")?.getFilterValue() ?? "")}
                        onChange={(e) => table.getColumn("original_File_Name")?.setFilterValue(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap flex-1 gap-2 items-center">

                    {/* TYPE Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="border-dashed">
                                <Filter className="mr-2 h-4 w-4" />
                                Type
                                {getFilter("resource_type").length > 0 && (
                                    <Badge variant="secondary" className="ml-2 px-1 rounded-sm h-5">{getFilter("resource_type").length}</Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {RESOURCE_TYPES.map((type) => (
                                <DropdownMenuCheckboxItem
                                    key={type}
                                    checked={getFilter("resource_type").includes(type)}
                                    onCheckedChange={(checked) => {
                                        const current = getFilter("resource_type");
                                        const next = checked ? [...current, type] : current.filter((t) => t !== type);
                                        handleFilterChange("resource_type", next, true);
                                    }}
                                >
                                    {type.toUpperCase()}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* BRANCH Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="border-dashed">
                                Branch
                                {getFilter("Branch").length > 0 && (
                                    <Badge variant="secondary" className="ml-2 px-1 rounded-sm h-5">{getFilter("Branch").length}</Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {uniqueBranches.map((branch) => (
                                <DropdownMenuCheckboxItem
                                    key={branch}
                                    checked={getFilter("Branch").includes(branch)}
                                    onCheckedChange={(checked) => {
                                        const current = getFilter("Branch");
                                        const next = checked ? [...current, branch] : current.filter((b) => b !== branch);
                                        handleFilterChange("Branch", next, true);
                                    }}
                                >
                                    {branch}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* YEAR Select */}
                    <Select
                        value={table.getColumn("year")?.getFilterValue() || "all"}
                        onValueChange={(val) => handleFilterChange("year", val, false)}
                    >
                        <SelectTrigger className="w-[110px] h-9 text-sm">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {uniqueYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    {/* Clear Button */}
                    {columnFilters.length > 0 && (
                        <Button variant="outline" size="sm" onClick={clearFilters} className="ml-auto lg:ml-0">
                            Reset
                        </Button>
                    )}
                </div>

                {/* Sort Control */}
                <div className="">
                    <Select
                        value={sorting[0]?.id}
                        onValueChange={(val) => setSorting([{ id: val, desc: true }])}
                    >
                        <SelectTrigger className="w-[160px] h-9 text-sm">
                            <span className="text-muted-foreground mr-1">Sort by:</span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="uploadedAt">Newest</SelectItem>
                            <SelectItem value="upvotes">Most Upvoted</SelectItem>
                            <SelectItem value="comments">Most Discussed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- LIST AREA --- */}
            <div className="space-y-4">
                {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                        <FileCard key={row.original._id} file={row.original} user={user} />
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
                        <p className="text-muted-foreground">No files found matching your criteria.</p>
                        <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
                    </div>
                )}
            </div>

            {searchParams.get('fileId') && <Button asChild><Link href={'/resources'}>Go Back to Resources</Link></Button>}

            {/* --- PAGINATION --- */}
            {table.getRowModel().rows.length > 0 && (
                <div className="flex items-center justify-end space-x-2 py-8">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function UserUploadsPage() {
    return (
        <Suspense fallback={<ResourceLibrarySkeleton />}>
            <ResourceLibraryContent />
        </Suspense>
    );
}
