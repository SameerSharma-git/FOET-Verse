"use client";

import { useState, useMemo, useEffect } from 'react';
import {
    FileText,
    Trash2,
    ArrowUpCircle,
    ArrowDownCircle,
    LoaderCircle,
    AlertTriangle,
    CalendarDays,
    Search, // Added for search bar
    Filter // Added for filter dropdown
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Imported Input for search
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'; // Imported Select for filter
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { findFiles } from '@/lib/actions/fileActions';

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from 'next-themes';
import { updateUser } from '@/lib/actions/userActions';


// Define the available resource types for the filter
const RESOURCE_TYPES = ['all', 'notes', 'PYQ', 'DPP', 'syllabus', 'marking-scheme', 'prev-year-paper', 'other'];

/**
 * Helper component for displaying metadata items.
 */
const InfoItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
};

/**
 * Helper component for displaying engagement statistics.
 */
const StatItem = ({ icon, count, label, className = "" }) => (
    <div className={`flex items-center gap-1.5 ${className}`}>
        {icon}
        <span className="font-semibold text-foreground">{count}</span>
        <span className="text-sm">{label}</span>
    </div>
);


// --- Example Data for Testing (as provided in the request) ---
const exampleUploads = [
    {
        _id: "65e648f583f7c1d7638d1721",
        original_File_Name: "Advanced Calculus Midterm Review (Fall 2024).pdf",
        secure_url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
        course: "B.Tech",
        Branch: "CSE",
        subject: "Mathematics-III",
        year: 2,
        semester: 3,
        resource_type: "notes",
        comments: [{}, {}],
        upvotes: [1, 2, 3, 4, 5],
        downvotes: [1],
        reports: [],
        uploadedAt: "2025-10-20T10:30:00Z",
    },
    {
        _id: "65e648f583f7c1d7638d1722",
        original_File_Name: "Operating Systems PYQ 2023.docx",
        secure_url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
        course: "B.Tech",
        Branch: "ECE",
        subject: "Operating Systems",
        year: 3,
        semester: 5,
        resource_type: "PYQ",
        comments: [],
        upvotes: [1, 2],
        downvotes: [1, 2, 3],
        reports: [{}, {}],
        uploadedAt: "2025-09-15T14:00:00Z",
    },
    {
        _id: "65e648f583f7c1d7638d1723",
        original_File_Name: "Data Structures DPP Set 5.pdf",
        secure_url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
        course: "B.Tech",
        Branch: "CSE",
        subject: "Data Structures",
        year: 2,
        semester: 4,
        resource_type: "DPP",
        comments: [],
        upvotes: [10],
        downvotes: [0],
        reports: [],
        uploadedAt: "2025-11-01T08:00:00Z",
    },
];


export default function UserUploadsTable({ user }) { // Using exampleUploads for demonstration
    const [uploads, setUploads] = useState([])
    const [triggerRefresh, setTriggerRefresh] = useState(1)
    const [isDeleting, setIsDeleting] = useState(false)
    const { theme } = useTheme();

    useEffect(() => {
        findFiles({ uploadedByUser: user._id }).then(files => {
            if (files) {
                setUploads(files)
            }
        })
    }, [triggerRefresh, user?._id])

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Handler for the delete operation (Placeholder)
    const handleDelete = async (fileId, fileCloudinaryId) => {
        setIsDeleting(true);

        try {
            const response = await axios.delete("api/delete-pdf", {
                data: {
                    fileId,
                    fileCloudinaryId,
                }
            });

            if (response.status === 200) {
                updateUser({ _id: user._id }, { uploads: uploads.filter(id => id !== fileId) })
                toast.success(response.data.message || 'PDF deleted successfully!', { autoClose: 3000, position: "bottom-right", theme: theme });
            } else if (response.status === 400) {
                toast.error('Invalid request. File ID and Cloudinary Public ID are required.', { autoClose: 3000, position: "bottom-right", theme: theme });
            } else if (response.status === 404) {
                toast.error('PDF not found in database.', { autoClose: 3000, position: "bottom-right", theme: theme });
            } else {
                toast.error('Failed to delete PDF. Please try again.', { autoClose: 3000, position: "bottom-right", theme: theme });
            }

        } catch (error) {
            console.error('Deletion Failed:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete PDF. Check console.';
            toast.error(errorMessage, { autoClose: 5000 });
        }
        finally {
            setIsDeleting(false);
            setTriggerRefresh(triggerRefresh + 1)
        }
    };

    // --- Filtering and Searching Logic (Optimized with useMemo) ---
    const filteredUploads = useMemo(() => {
        let currentList = uploads;

        // 1. Apply Resource Type Filter
        if (filterType !== 'all') {
            currentList = currentList.filter(file => file.resource_type === filterType);
        }

        // 2. Apply Search Query Filter
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            currentList = currentList.filter(file =>
                file.original_File_Name.toLowerCase().includes(lowerCaseQuery) ||
                file.subject.toLowerCase().includes(lowerCaseQuery) ||
                file.resource_type.toLowerCase().includes(lowerCaseQuery) ||
                file.Branch.toLowerCase().includes(lowerCaseQuery)
            );
        }

        return currentList;
    }, [uploads, filterType, searchQuery]);


    // --- Empty State (Combined) ---
    const showEmptyState = uploads.length === 0;
    const showNoResults = uploads.length > 0 && filteredUploads.length === 0;

    // --- Component Render ---
    return (
        // Max-width constraint for professionalism on large screens (max-w-7xl)
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 md:pt-8 pb-8">
            <ToastContainer />

            <h2 className="text-3xl font-bold tracking-tight mb-6">Your Uploaded Resources 📚</h2>

            {/* --- Search and Filter Header --- */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">

                {/* Search Input */}
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by file name, subject, or branch..."
                        className="pl-10 h-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Select */}
                <div className="flex items-center space-x-2 w-full md:w-56 flex-shrink-0">
                    <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {RESOURCE_TYPES.map(type => (
                                <SelectItem key={type} value={type} className="capitalize">
                                    {type === 'all' ? 'All Types' : type.replace('-', ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- Empty State/No Results Message --- */}
            {showEmptyState && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-16 text-center text-muted-foreground shadow-sm">
                    <FileText className="h-12 w-12" />
                    <h3 className="mt-4 text-xl font-semibold">No Uploads Yet</h3>
                    <p className="mt-2 text-sm">
                        Start contributing resources, and they will appear here.
                    </p>
                </div>
            )}

            {showNoResults && (
                <div className="text-center p-12 rounded-lg border border-dashed text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-3" />
                    <p className="text-xl font-semibold">No Results Found</p>
                    <p>Try adjusting your search query or changing the filter.</p>
                </div>
            )}

            {/* --- Uploads List (The Cards) --- */}
            <div className="grid gap-6">
                {filteredUploads.map((file) => (
                    <Card key={file._id} className="overflow-hidden shadow-md transition-all hover:shadow-lg">
                        <div className="grid md:grid-cols-[250px_1fr]">

                            {/* Column 1: Iframe Preview */}
                            <div className="w-full h-64 md:h-auto bg-gray-50 border-r overflow-hidden">
                                <iframe
                                    src={file.secure_url}
                                    title={file.original_File_Name}
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    sandbox="allow-scripts allow-same-origin"
                                />
                            </div>

                            {/* Column 2: File Details */}
                            <div className="flex flex-col mt-5 md:mt-0">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <CardTitle className="text-xl font-semibold leading-tight">
                                                {file.original_File_Name}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-1.5 pt-2">
                                                <CalendarDays className="h-4 w-4" />
                                                {/* Displaying the uploadedAt field */}
                                                **Uploaded on** {new Date(file.uploadedAt).toLocaleDateString()} at {new Date(file.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="capitalize text-sm flex-shrink-0">
                                            {file.resource_type}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-grow space-y-4">
                                    {/* Academic Metadata */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                                        <InfoItem label="Course" value={file.course} />
                                        <InfoItem label="Branch" value={file.Branch} />
                                        <InfoItem label="Subject" value={file.subject} />
                                        <InfoItem label="Year" value={file.year} />
                                        <InfoItem label="Semester" value={file.semester} />
                                    </div>

                                    {/* Engagement Stats */}
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-muted-foreground">
                                        <StatItem
                                            icon={<ArrowUpCircle className="h-5 w-5 text-green-500" />}
                                            count={file.upvotes.length}
                                            label="Upvotes"
                                        />
                                        <StatItem
                                            icon={<ArrowDownCircle className="h-5 w-5 text-red-500" />}
                                            count={file.downvotes.length}
                                            label="Downvotes"
                                        />
                                        {/*  Comments icon */}
                                        {/* <StatItem
                                            icon={<MessageSquare className="h-5 w-5 text-blue-500" />}
                                            count={file.comments.length}
                                            label="Comments"
                                        /> */}
                                        {file.reports.length > 0 && (
                                            <StatItem
                                                icon={<AlertTriangle className="h-5 w-5 text-orange-500 animate-pulse" />}
                                                count={file.reports.length}
                                                label="Reports"
                                                className="text-orange-600 font-semibold"
                                            />
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="flex justify-end mt-4 p-4 border-t">
                                    {/* Delete Button with Confirmation Dialog */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button disabled={isDeleting} asChild variant="destructive" size="sm">
                                                {isDeleting ? (
                                                    <div><LoaderCircle className='animate-spin h-5 w-5' /></div>
                                                ) : (
                                                    <div>
                                                        <Trash2 className="h-4 w-4 mr-1.5" />
                                                        Delete
                                                    </div>
                                                )}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently remove
                                                    <strong className="block truncate my-2">
                                                        {file.original_File_Name}
                                                    </strong>
                                                    from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-red-600 hover:bg-red-700"
                                                    onClick={() => handleDelete(file._id, file.cloudinary_Public_Id)}
                                                >
                                                    Yes, Delete File
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}