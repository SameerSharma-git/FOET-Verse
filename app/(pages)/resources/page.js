"use client"

import * as React from "react"
import {
    // Icons for filters and cards
    ChevronDownIcon, Filter, Download, BookOpen, Search,
    ArrowUp, ArrowDown, MessageSquare, // Icons for stats
    FileText, // Icon for preview fallback
    Send, // Icon for comment input
} from "lucide-react"
import {
    // We still use the core hook for state management (filtering, sorting, pagination)
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel, useReactTable,
} from "@tanstack/react-table"

// --- UI Imports (from shadcn/ui) ---
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
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
// Import Card components for the new layout
import {
    Card, CardContent,
} from "@/components/ui/card"
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
// New imports for comment section
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { findFiles } from "@/lib/actions/fileActions"
import { set } from "mongoose"


const RESOURCE_TYPES = ['notes', 'PYQ', 'DPP', 'syllabus', 'marking-scheme', 'prev-year-paper', 'other'];

// --- DUMMY USER DATA (for comments) ---
const DUMMY_USER_1 = {
    _id: "u1",
    name: "Aarav Sharma",
    profilePicture: "https://i.pravatar.cc/150?img=12",
    branch: "CSE",
    year: 3,
    semester: 6
};

/** @type {CommentUserData} */
const DUMMY_USER_2 = {
    _id: "u2",
    name: "Priya Singh",
    profilePicture: "https://i.pravatar.cc/150?img=5",
    branch: "ECE",
    year: 2,
    semester: 4
};


/** @type {FileData[]} */
const DUMMY_DATA = [
    {
        file_id: "f123456",
        original_File_Name: "CS-401_Operating_Systems_Module_1_Notes.pdf",
        course: "B.Tech",
        Branch: "CSE",
        subject: "Operating Systems",
        year: 3,
        semester: 6,
        secure_url: "https://picsum.photos/id/1018/800/600",
        resource_type: "notes",
        uploadedAt: new Date("2024-05-10T10:00:00Z"),
        upvotesCount: 45,
        downvotesCount: 2,
        comments: [
            { _id: "c1", user: DUMMY_USER_1, text: "These notes are fantastic! Really saved me for the midterm.", createdAt: new Date("2024-05-11T08:00:00Z") },
            { _id: "c2", user: DUMMY_USER_2, text: "Module 3 is a bit confusing, but this helps. Thanks!", createdAt: new Date("2024-05-11T09:30:00Z") },
        ],
    },
    {
        file_id: "f123457",
        original_File_Name: "Applied_Maths_PYQ_2020-2023.zip",
        course: "B.Tech",
        Branch: "ECE",
        subject: "Applied Mathematics",
        year: 1,
        semester: 2,
        secure_url: "https://picsum.photos/id/1020/800/600",
        resource_type: "PYQ",
        uploadedAt: new Date("2023-11-20T10:00:00Z"),
        upvotesCount: 120,
        downvotesCount: 5,
        comments: [
            { _id: "c3", user: DUMMY_USER_2, text: "The 2022 paper is missing, otherwise this is a great collection.", createdAt: new Date("2023-11-21T14:00:00Z") },
        ],
    },
    {
        file_id: "f123458",
        original_File_Name: "BBA_Financial_Accounting_Syllabus.docx",
        course: "BBA",
        Branch: "Finance",
        subject: "Financial Accounting",
        year: 2,
        semester: 3,
        secure_url: "https://picsum.photos/id/1021/800/600",
        resource_type: "syllabus",
        uploadedAt: new Date("2024-01-15T10:00:00Z"),
        upvotesCount: 5,
        downvotesCount: 0,
        comments: [], // <-- Empty comments array
    },
    {
        file_id: "f123459",
        original_File_Name: "Chemistry_DPP_Set_05.pdf",
        course: "B.Sc",
        Branch: "Chemistry",
        subject: "Organic Chemistry",
        year: 1,
        semester: 1,
        secure_url: "https://picsum.photos/id/1031/800/600",
        resource_type: "DPP",
        uploadedAt: new Date("2024-04-01T10:00:00Z"),
        upvotesCount: 88,
        downvotesCount: 10,
        comments: [],
    },
    {
        file_id: "f123460",
        original_File_Name: "Digital_Logic_Design_Prev_Year_Paper_2022.pdf",
        course: "B.Tech",
        Branch: "CSE",
        subject: "Digital Logic",
        year: 2,
        semester: 4,
        secure_url: "#", // No preview URL
        resource_type: "prev-year-paper",
        uploadedAt: new Date("2023-09-28T10:00:00Z"),
        upvotesCount: 201,
        downvotesCount: 15,
        comments: [
            { _id: "c4", user: DUMMY_USER_1, text: "This paper was tough! Good find.", createdAt: new Date("2023-09-29T11:00:00Z") },
            { _id: "c5", user: DUMMY_USER_1, text: "Anyone have the solutions for this?", createdAt: new Date("2023-09-29T11:05:00Z") },
            { _id: "c6", user: DUMMY_USER_2, text: "I have some, will upload them separately.", createdAt: new Date("2023-10-01T16:20:00Z") },
        ],
    },
    {
        file_id: "f123461",
        original_File_Name: "Advanced_Algorithms_Quick_Ref_Guide.txt",
        course: "M.Tech",
        Branch: "IT",
        subject: "Algorithms",
        year: 1,
        semester: 1,
        secure_url: "https://picsum.photos/id/1039/800/600",
        resource_type: "other",
        uploadedAt: new Date("2024-05-01T10:00:00Z"),
        upvotesCount: 15,
        downvotesCount: 1,
        comments: [
            { _id: "c7", user: DUMMY_USER_1, text: "Quick and to the point. Perfect.", createdAt: new Date("2024-05-02T11:00:00Z") },
        ],
    },
];


function useUniqueValues(data, key) {
    return React.useMemo(() => {
        return Array.from(new Set(data.map(item => item[key]).filter(Boolean))).sort();
    }, [data, key]);
}

/**
 * Document Preview Component (uses Dialog)
 * This is the *large* preview when you click the preview button.
 */
const DocumentPreviewDialog = ({ file_name, secure_url }) => {
    const isPreviewable = secure_url && secure_url !== '#';

    return (
        isPreviewable ? (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1000px] h-[90vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle>Preview: {file_name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 grow w-full h-auto mt-2 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        {/* <img
                            src={secure_url}
                            alt={`Preview of ${file_name}`}
                            className="max-h-full max-w-full object-contain shadow-xl border border-gray-300 rounded-lg"
                        /> */}
                        {/* FOR REAL PDFs, USE THIS INSTEAD OF <img>: */}
                        <iframe
                            src={secure_url}
                            title={`Preview of ${file_name}`}
                            className="w-full h-full border-0"
                        />

                    </div>
                </DialogContent>
            </Dialog>
        ) : (
            <Button variant="outline" size="sm" title="No Preview Available" disabled={true} className="w-full md:w-auto">
                <BookOpen className="mr-2 h-4 w-4" />
                No Preview
            </Button>
        )
    );
};

// --- NEW COMMENT COMPONENTS ---

const Comment = ({ comment }) => {
    const { user, text, createdAt } = comment;

    // Helper to format user metadata
    const userMeta = [
        user.branch,
        user.year ? `Year ${user.year}` : null,
        user.semester ? `Sem ${user.semester}` : null
    ].filter(Boolean).join(' • '); // e.g., "CSE • Year 3 • Sem 6"

    return (
        <div className="flex items-start space-x-3 py-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex flex-wrap items-baseline space-x-2">
                    <span className="font-semibold text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{userMeta}</span>
                </div>
                <p className="text-sm text-foreground mt-1">{text}</p>
                <span className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                    {new Date(createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

const CommentSection = ({ comments }) => {
    // State for the new comment input
    const [newComment, setNewComment] = React.useState("");

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        // --- API Call ---
        // In a real app, you'd call your API here to submit the comment
        console.log("Submitting comment:", newComment);
        // await api.post('/api/comments', { fileId: '...', text: newComment });

        // Optimistically update or refetch. For now, just clear the input.
        setNewComment("");
    };

    return (
        <div className="bg-muted/50 dark:bg-black/50 px-4 md:px-6 py-4">
            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 pb-3">
                <Avatar className="h-8 w-8">
                    {/* This should be the *current* logged-in user's avatar */}
                    <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Your profile" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-background"
                />
                <Button type="submit" size="icon" disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>

            {/* Comment List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <Comment key={comment._id} comment={comment} />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Be the first to comment.
                    </p>
                )}
            </div>
        </div>
    );
};

// Upvote/Downvote CLick Handler
const handleUp_DownVoteClick = () => {

}


const FileCard = ({ file }) => {
    const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);

    const isPreviewable = file.secure_url && file.secure_url !== '#';
    const formattedType = file.resource_type
        ? file.resource_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'N/A';
    const formattedDate = new Date(file.uploadedAt).toLocaleDateString();

    return (
        // The Card component is now the root
        <Card className="w-full shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className="flex flex-col md:flex-row">

                {/* 1. Preview Pane (iframe) */}
                <div className="w-full md:w-1/4 lg:w-1/5 xl:w-1/6 bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-center relative aspect-video md:aspect-auto">
                    {isPreviewable ? (
                        <iframe
                            src={file.secure_url}
                            title={`Preview of ${file.original_File_Name}`}
                            className="w-full h-full border-0 rounded-md"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-gray-100 dark:bg-gray-900 rounded-md p-4">
                            <FileText className="h-12 w-12" />
                            <span className="mt-2 text-xs text-center">No Preview Available</span>
                        </div>
                    )}
                </div>

                {/* 2. Main Info Pane */}
                <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                    <div>
                        {/* Top Section: Title & Type */}
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg md:text-xl text-primary leading-tight" title={file.original_File_Name}>
                                {file.original_File_Name}
                            </h3>
                            <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700 ml-3 flex-shrink-0">
                                {formattedType}
                            </Badge>
                        </div>

                        {/* Middle Section: Course, Branch, Sem, etc. */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge variant="secondary" className="font-mono">{file.course}</Badge>
                            <Badge variant="outline" className="capitalize">{file.Branch || 'N/A'}</Badge>
                            {file.year && (
                                <span className="text-sm text-muted-foreground">Year {file.year}</span>
                            )}
                            {file.semester && (
                                <span className="text-sm text-muted-foreground">Sem {file.semester}</span>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                            Subject: <span className="font-semibold text-foreground">{file.subject}</span>
                        </p>
                    </div>

                    {/* Bottom Section: Stats & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Stats */}
                        <TooltipProvider delayDuration={100}>
                            <div className="flex items-center space-x-4 text-muted-foreground">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center space-x-1 cursor-default">
                                            <ArrowUp onClick={() => handleUp_DownVoteClick("upvote")} className="h-4 w-4 transition-all hover:h-5 hover:w-5 text-green-500" />
                                            <span className="text-sm font-medium text-foreground">{file.upvotesCount}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Upvotes</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center space-x-1 cursor-default">
                                            <ArrowDown onClick={() => handleUp_DownVoteClick("downvote")} className="h-4 w-4 transition-all hover:h-5 hover:w-5 text-red-500" />
                                            <span className="text-sm font-medium text-foreground">{file.downvotesCount}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Downvotes</TooltipContent>
                                </Tooltip>

                                {/* --- MODIFIED COMMENT BUTTON --- */}
                                
                                {/* <Tooltip>
                                    <TooltipTrigger asChild>
                                        // This is now a button to toggle the state
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="flex items-center space-x-1 h-auto px-1 py-1"
                                            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                                        >
                                            <MessageSquare className={`h-4 w-4 ${isCommentsOpen ? 'text-primary' : 'text-blue-500'}`} />
                                            <span className="text-sm font-medium text-foreground">
                                                {file.comments.length}
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{isCommentsOpen ? 'Hide comments' : 'Show comments'}</TooltipContent>
                                </Tooltip> */}
                            </div>
                        </TooltipProvider>

                        {/* Actions (Preview Button & Date) */}
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <span className="text-xs text-muted-foreground order-last md:order-first" suppressHydrationWarning={true}>
                                Uploaded: {formattedDate}
                            </span>
                            <div className="flex flex-col gap-1.5">
                                <DocumentPreviewDialog
                                    file_name={file.original_File_Name}
                                    secure_url={file.secure_url}
                                />
                                <div>
                                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* This section will appear/disappear based on the state */}
            {/* {isCommentsOpen && (
                <>
                    <Separator className="dark:bg-gray-700" />
                    <CommentSection comments={file.comments} />
                </>
            )} */}
        </Card>
    )
}


// --- 3. COLUMN DEFINITIONS (FOR STATE MANAGEMENT) ---
// We still need this to tell useReactTable what data exists
// and what accessor keys to use for filtering and sorting.
/** @type {import('@tanstack/react-table').ColumnDef<FileData>[]} */
const columns = [
    { accessorKey: "original_File_Name" },
    {
        accessorKey: "resource_type",
        filterFn: "arrIncludes", // Multi-select filter
    },
    {
        accessorKey: "course",
        filterFn: "arrIncludes", // Multi-select filter
    },
    {
        accessorKey: "Branch",
        filterFn: "arrIncludes", // Multi-select filter
    },
    {
        accessorKey: "year",
        // Single-select filter
        filterFn: (row, id, value) => (value ? row.getValue(id) === parseInt(value) : true),
    },
    {
        accessorKey: "semester",
        // Single-select filter
        filterFn: (row, id, value) => (value ? row.getValue(id) === parseInt(value) : true),
    },
    { accessorKey: "uploadedAt" },
    { accessorKey: "upvotesCount" },
    { accessorKey: "downvotesCount" },
    {
        accessorKey: "comments",
        // Add a custom sort fn for comments array length
        sortingFn: (rowA, rowB, id) => {
            return rowA.original.comments.length - rowB.original.comments.length;
        },
        // We add an accessorFn so sorting/filtering knows to use the length
        accessorFn: (row) => row.comments.length,
    },
]

// --- 4. MAIN COMPONENT (Default Export for the Page) ---
/**
 * @param {object} props
 * @param {FileData[]} [props.Data] - The array of file objects passed from the server.
 */
export default function UserUploadsPage() {
    const [data, setData] = React.useState(null)

    React.useEffect(() => {
      findFiles({}).then(files => { setData(files); console.log("Fetched files for resources page:", files); })
    }, [])
    
    if (!data) {
        return (<p className="text-center h-[60vh] pt-14">Loading...</p>)
    }

    const DEFAULT_PAGE_SIZE = 10;

    // State initialization
    const [sorting, setSorting] = React.useState([{ id: 'uploadedAt', desc: true }])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);

    // Custom filter function for multi-select
    const filterFns = {
        arrIncludes: (row, id, value) => value.includes(row.getValue(id)),
    }

    const table = useReactTable({
        data: data,
        columns,
        filterFns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex: 0,
                pageSize,
            },
        },
        manualPagination: false, // We're using client-side pagination
    })

    // --- Filter Utilities ---
    const uniqueCourses = useUniqueValues(data, 'course');
    const uniqueBranches = useUniqueValues(data, 'Branch');
    const uniqueYears = useUniqueValues(data, 'year');
    const uniqueSemesters = useUniqueValues(data, 'semester');
    const uniqueResourceTypes = RESOURCE_TYPES;

    // Get Filter Values for badge count
    const resourceTypeFilterValue = table.getColumn("resource_type")?.getFilterValue() || [];
    const courseFilterValue = table.getColumn("course")?.getFilterValue() || [];
    const branchFilterValue = table.getColumn("Branch")?.getFilterValue() || [];

    // Function to set single-value filters (Year, Semester)
    const setSingleFilter = (key, value) => {
        const filterValue = value === 'all' ? '' : value;
        table.getColumn(key)?.setFilterValue(filterValue);
    }

    const clearAllFilters = () => {
        setColumnFilters([]);
        table.getColumn("original_File_Name")?.setFilterValue("");
    }

    // --- Sort By Controls ---
    const currentSortId = sorting[0]?.id || 'uploadedAt';
    const currentSortDesc = sorting[0]?.desc || true;

    const handleSortChange = (newId) => {
        setSorting([{ id: newId, desc: currentSortDesc }]);
    };

    const toggleSortDirection = () => {
        setSorting([{ id: currentSortId, desc: !currentSortDesc }]);
    };


    return (
        <div className="container mx-auto md:mt-5 mb-14 p-4 md:p-0">

            {/* ---------------------------------------------------- */}
            {/* Filter, Search, and Sort Bar */}
            {/* ---------------------------------------------------- */}
            <div className="flex flex-wrap items-center py-4 gap-3">
                {/* Global Search */}
                <div className="relative flex items-center max-w-sm">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search file name..."
                        value={(table.getColumn("original_File_Name")?.getFilterValue() ?? "")}
                        onChange={(event) =>
                            table.getColumn("original_File_Name")?.setFilterValue(event.target.value)
                        }
                        className="pl-9 w-[250px]"
                    />
                </div>

                {/* --- FILTERS GROUP --- */}
                <div className="flex flex-wrap gap-3 ml-auto">

                    {/* 1. Resource Type Multi-Select Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Type
                                {resourceTypeFilterValue.length > 0 &&
                                    <Badge variant="default" className="ml-2 h-5 w-5 justify-center p-0">{resourceTypeFilterValue.length}</Badge>
                                }
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {uniqueResourceTypes.map((type) => (
                                <DropdownMenuCheckboxItem
                                    key={type}
                                    checked={resourceTypeFilterValue.includes(type)}
                                    onCheckedChange={(checked) => {
                                        const newFilter = checked
                                            ? [...resourceTypeFilterValue, type]
                                            : resourceTypeFilterValue.filter((t) => t !== type);
                                        table.getColumn("resource_type")?.setFilterValue(newFilter);
                                    }}
                                >
                                    {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* 2. Course Multi-Select Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Course
                                {courseFilterValue.length > 0 &&
                                    <Badge variant="default" className="ml-2 h-5 w-5 justify-center p-0">{courseFilterValue.length}</Badge>
                                }
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {uniqueCourses.map((course) => (
                                <DropdownMenuCheckboxItem
                                    key={course}
                                    checked={courseFilterValue.includes(course)}
                                    onCheckedChange={(checked) => {
                                        const newFilter = checked
                                            ? [...courseFilterValue, course]
                                            : courseFilterValue.filter((c) => c !== course);
                                        table.getColumn("course")?.setFilterValue(newFilter);
                                    }}
                                >
                                    {course}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* 3. Branch Multi-Select Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Branch
                                {branchFilterValue.length > 0 &&
                                    <Badge variant="default" className="ml-2 h-5 w-5 justify-center p-0">{branchFilterValue.length}</Badge>
                                }
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {uniqueBranches.map((branch) => (
                                <DropdownMenuCheckboxItem
                                    key={branch}
                                    checked={branchFilterValue.includes(branch)}
                                    onCheckedChange={(checked) => {
                                        const newFilter = checked
                                            ? [...branchFilterValue, branch]
                                            : branchFilterValue.filter((b) => b !== branch);
                                        table.getColumn("Branch")?.setFilterValue(newFilter);
                                    }}
                                >
                                    {branch}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* 4. Year Select Filter */}
                    <Select
                        onValueChange={(value) => setSingleFilter('year', value)}
                        value={table.getColumn('year')?.getFilterValue() || "all"}
                    >
                        <SelectTrigger className="w-[100px] text-sm" aria-label="Filter by Year">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {uniqueYears.map(year => (
                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* 5. Semester Select Filter */}
                    <Select
                        onValueChange={(value) => setSingleFilter('semester', value)}
                        value={table.getColumn('semester')?.getFilterValue() || "all"}
                    >
                        <SelectTrigger className="w-[120px] text-sm" aria-label="Filter by Semester">
                            <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Semesters</SelectItem>
                            {uniqueSemesters.map(semester => (
                                <SelectItem key={semester} value={String(semester)}>Sem {semester}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Clear Filters Button */}
                    {(columnFilters.length > 0 || table.getColumn("original_File_Name")?.getFilterValue()) && (
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} title="Clear all active filters">
                            Clear All
                        </Button>
                    )}

                    {/* Sort By Control */}
                    <div className="flex gap-1">
                        <Select onValueChange={handleSortChange} value={currentSortId}>
                            <SelectTrigger className="w-[150px] text-sm" aria-label="Sort by">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uploadedAt">Upload Date</SelectItem>
                                <SelectItem value="upvotesCount">Upvotes</SelectItem>
                                <SelectItem value="comments">Comments</SelectItem>
                                <SelectItem value="original_File_Name">File Name</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={toggleSortDirection} title={currentSortDesc ? "Sort Ascending" : "Sort Descending"}>
                            {currentSortDesc ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                        </Button>
                    </div>

                </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* Card List */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-4 py-4">
                {data.length === 0 ? (
                    <Card>
                        <CardContent className="h-24 flex items-center justify-center text-muted-foreground">
                            No files loaded. Check the server connection or add data.
                        </CardContent>
                    </Card>
                ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <FileCard key={row.original.file_id} file={row.original} />
                    ))
                ) : (
                    <Card>
                        <CardContent className="h-24 flex items-center justify-center text-muted-foreground">
                            No files found matching your criteria.
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* Footer and Pagination */}
            {/* ---------------------------------------------------- */}
            <div className="flex items-center justify-end space-x-6 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Viewing <span className="font-semibold">{table.getRowModel().rows.length}</span> of <span className="font-semibold">{data.length}</span> total files.
                </div>

                {/* Page Size Control (Show items per page) */}
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page:</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            setPageSize(Number(value));
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Page Index Display */}
                <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    {/* Pagination Buttons */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}