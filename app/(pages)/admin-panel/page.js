"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
    Users,
    FileText,
    Search,
    Mail,
    Trash2,
    ExternalLink,
    Download,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { findFileById, findFiles } from "@/lib/actions/fileActions";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "next-themes";
import { deleteUser, updateUser, findUserById, findUsers } from "@/lib/actions/userActions";
import { LoaderCircle } from "lucide-react";
import { sendEmailAction } from "@/lib/actions/emailActions";
import Link from "next/link";

// --- CUSTOM DATE FORMATTER ---
const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

// --- MOCK DATA GENERATORS (Moved outside to simulate DB) ---
const generateMockUsers = () => Array.from({ length: 25 }).map((_, i) => ({
    _id: `user-${i}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@university.edu`,
    role: i === 0 ? "admin" : "user",
    course: "Btech",
    year: (i % 4) + 1,
    college: "University of Lucknow",
    profilePicture: "/images/placeholder.jpg",
    upvotes: Array(Math.floor(Math.random() * 50)).fill("id"),
    downvotes: Array(Math.floor(Math.random() * 5)).fill("id"),
    comments: Array(Math.floor(Math.random() * 20)).fill({}),
    reportsCount: Math.floor(Math.random() * 3),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
}));

const generateMockFiles = () => Array.from({ length: 25 }).map((_, i) => ({
    _id: `file-${i}`,
    original_File_Name: `Engineering_Maths_Unit_${i + 1}.pdf`,
    subject: "Engineering Mathematics",
    resource_type: i % 2 === 0 ? "notes" : "PYQ",
    secure_url: "https://cloudinary.com/sample.pdf",
    course: "Btech",
    uploadedByUser: { _id: `user-${i}`, name: `Student ${i + 1}` },
    upvotes: Array(Math.floor(Math.random() * 100)).fill("id"),
    downvotes: Array(Math.floor(Math.random() * 2)).fill("id"),
    comments: Array(Math.floor(Math.random() * 10)).fill({}),
    reports: Array(Math.floor(Math.random() * 5)).fill({}),
    uploadedAt: new Date("2024-02-15"),
}));

export default function AdminDashboard() {
    // Theme
    const { theme } = useTheme();

    // -- Data States --
    const [users, setUsers] = useState([]);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // -- UI States --
    const [activeTab, setActiveTab] = useState("users");
    const [searchTerm, setSearchTerm] = useState("");
    const [isExporting, setIsExporting] = useState(false);

    // -- Pagination State --
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Delete Buttons Responsiveness
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [isDeletingFile, setIsDeletingFile] = useState(false);

    // -- Dialog States --
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
    const [isDeleteFileOpen, setIsDeleteFileOpen] = useState(false);

    // Email States
    const [emailSubject, setEmailSubject] = useState("second");
    const [emailMessage, setEmailMessage] = useState("second");

    // -- Simulate Data Fetching --
    useEffect(() => {
        setIsLoading(true);

        findUsers({}).then(users => {
            setUsers(users);
            findFiles({}).then(files => {
                setFiles(files);
                setIsLoading(false);
            });
        });

        // setUsers(generateMockUsers());
        // setFiles(generateMockFiles());
    }, []);

    // -- Reset Pagination on Search or Tab Change --
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab]);

    // -- Filtering Logic --
    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFiles = files.filter((f) =>
        f.original_File_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // -- Pagination Logic --
    const getPaginatedData = (data) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return data.slice(indexOfFirstItem, indexOfLastItem);
    };

    const totalPages = (totalItems) => Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (direction, totalItems) => {
        if (direction === "next" && currentPage < totalPages(totalItems)) {
            setCurrentPage((prev) => prev + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const exportToCSV = (data, fileName) => {
        if (!data || data.length === 0) return;

        // 1. Get the headers (keys of the first object)
        const headers = Object.keys(data[0]).join(",");

        // 2. Map the data rows
        const rows = data.map((obj) => {
            return Object.values(obj)
                .map((value) => {
                    // Escape quotes and wrap strings containing commas in quotes
                    const stringValue = String(value).replace(/"/g, '""');
                    return `"${stringValue}"`;
                })
                .join(",");
        });

        // 3. Combine headers and rows
        const csvContent = [headers, ...rows].join("\n");

        // 4. Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute("download", `${fileName}.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = () => {
        setIsExporting(true)
        const dataToExport = {
            Users: users.map(user => {
                return {
                    ID: user._id,
                    Name: user.name,
                    Email: user.email,
                    College: user.college,
                    Course: user.course,
                    Year: user.year,
                    Upvotes: user.upvotes.length,
                    JoinedDate: new Date(user.createdAt).toLocaleDateString()
                };
            }),
            Files: files.map(file => {
                return {
                    ID: file._id,
                    FileName: file.original_File_Name,
                    ResourceType: file.resource_type,
                    Course: file.course,
                    Upvotes: file.upvotes.length,
                    Downvotes: file.downvotes.length,
                    JoinedDate: new Date(file.createdAt).toLocaleDateString()
                }
            })
        }

        activeTab === "users" ? exportToCSV(dataToExport.Users, uuidv4()) : exportToCSV(dataToExport.Files, uuidv4())
        setIsExporting(false)
    }

    // -- Show Toast --
    const showToast = (type, message) => {
        const config = { autoClose: 3000, position: "bottom-right", theme };

        if (type === "success") {
            toast.success(message, config);
        } else if (type === "info") {
            toast.info(message, config);
        }
        else {
            toast.error(message, config);
        }
    }

    // -- Action Handlers --
    const handleEmailUser = (user) => {
        setSelectedUser(user);
        setIsEmailOpen(true);
    };

    const handleSendEmail = async () => {
        setIsEmailOpen(false);
        try {
            const htmlContent = `<h2>Hey ${selectedUser.name}</h2> <p> ${emailMessage}</p>`;

            await sendEmailAction({ to: selectedUser.email, subject: emailSubject, htmlContent });
            showToast("success", "Email Sent successfully to " + selectedUser.email)
        } catch (error) {
            showToast("error", error.message)
            console.error(error)
        }
    };

    const confirmDeleteUser = (user) => {
        setSelectedUser(user);
        setIsDeleteUserOpen(true);
    };

    const handleDeleteUser = async (userId) => {
        setIsDeletingFile(true);

        try {
            const userToDelete = await deleteUser({ _id: userId });
            const uploads = userToDelete.uploads;

            try {
                await uploads.forEach(async (fileId) => {
                    const fileCloudinaryId = (await findFileById(fileId)).cloudinary_Public_Id;

                    const resp = await axios.delete("api/delete-pdf", {
                        data: {
                            fileId,
                            fileCloudinaryId,
                        }
                    });

                    if (resp.status !== 200) {
                        showToast("error", `Failed to delete File with FileId - ${fileId} and cloudinary Id - ${fileCloudinaryId} with Error Message - ${response.error.message}`);
                    }
                });

                setFiles(prevFiles => prevFiles.filter(file => !uploads.includes(file._id)));
            } catch (er) {
                showToast("error", `Failed to Delete Files`);
                return null
            }

            const htmlContent = `<p>We have removed your profile from FOET-Verse. If you have any complaint regarding this action, reach out to us.</p>`
            sendEmailAction({ to: userToDelete.email, subject: "Your Profile has been remove from FOET-Verse!", htmlContent });

            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));

            showToast("success", `User with Name - ${userToDelete.name} and Email - ${userToDelete.email} has been successfully deleted from the database along with his uploads!`);

        } catch (error) {
            console.error('Deletion Failed:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete User. Check console.';
            showToast("error", errorMessage)
        }
        finally {
            setIsDeletingUser(false);
            setIsDeleteUserOpen(false);
        }
    }

    const confirmDeleteFile = (file) => {
        setSelectedFile(file);
        setIsDeleteFileOpen(true);
    };

    const handleDeleteFile = async (fileId) => {
        setIsDeletingFile(true);

        try {
            const foundFile = await findFileById(fileId);
            const fileCloudinaryId = foundFile.cloudinary_Public_Id;

            const response = await axios.delete("api/delete-pdf", {
                data: {
                    fileId,
                    fileCloudinaryId,
                }
            });

            if (response.status === 200) {
                setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
                showToast("success", response.data.message || 'PDF deleted successfully!');

                const fileOwner = await findUserById(foundFile.uploadedByUser);

                const htmlContent = `<p>We have removed the file (${foundFile.original_File_Name}) from FOET-Verse. If you have any complaint regarding this action, reach out to us.</p>`;
                sendEmailAction({ to: fileOwner.email, subject: "Your File has been remove from FOET-Verse!", htmlContent });
            } else if (response.status === 400) {
                showToast("error", 'Invalid request. File ID and Cloudinary Public ID are required.');
            } else if (response.status === 404) {
                showToast("error", 'PDF not found in database.');
            } else {
                showToast("error", 'Failed to delete PDF. Please try again.');
            }

        } catch (error) {
            console.error('Deletion Failed:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete PDF. Check console.';
            toast.error(errorMessage, { autoClose: 5000 });
        }
        finally {
            setIsDeletingFile(false);
            setIsDeleteFileOpen(false);
        }
    }

    return (
        <div className="min-h-screen bg-muted/40 p-6 md:px-12 py-8 space-y-8">

            <ToastContainer />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage users, content, and system alerts.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => handleExport()} variant="outline" disabled={isLoading || isExporting}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                            <div className="text-2xl font-bold">{users.length}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                            <div className="text-2xl font-bold">{files.length}</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="users" className="space-y-4" onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                        <TabsTrigger value="users">Users Database</TabsTrigger>
                        <TabsTrigger value="files">Files & Resources</TabsTrigger>
                    </TabsList>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${activeTab}...`}
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* ---------------- USERS TAB ---------------- */}
                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>
                                View and manage registered students and operators.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <span className="ml-2 animate-pulse text-muted-foreground">Fetching users...</span>
                                </div>
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User Profile</TableHead>
                                                <TableHead>Academic Info</TableHead>
                                                <TableHead className="text-center">Stats (↑/↓/C)</TableHead>
                                                <TableHead className="hidden md:table-cell">Joined</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {getPaginatedData(filteredUsers).length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                        No users found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                getPaginatedData(filteredUsers).map((user) => (
                                                    <TableRow key={user._id} className="hover:bg-muted/50 transition-colors">
                                                        <TableCell className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9">
                                                                <AvatarImage src={user.profilePicture} alt={user.name} />
                                                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{user.name}</span>
                                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">{user.college}</span>
                                                                <span className="text-xs text-muted-foreground">{user.course} • Year {user.year}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Badge variant="secondary" className="text-green-600 bg-green-100">+{user.upvotes.length}</Badge>
                                                                <Badge variant="secondary" className="text-red-600 bg-red-100">-{user.downvotes.length}</Badge>
                                                                <Badge variant="outline">{user.comments.length}</Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                                            {formatDate(user.createdAt)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button asChild size="icon" variant="ghost" title="Visit Author">
                                                                    <Link href={`/user-profile/${user._id}`} target="_blank" rel="noreferrer">
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button size="icon" variant="ghost" onClick={() => handleEmailUser(user)}>
                                                                    <Mail className="h-4 w-4 text-blue-500" />
                                                                </Button>
                                                                <Button size="icon" variant="ghost" onClick={() => confirmDeleteUser(user)}>
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-end space-x-2 py-4">
                                        <div className="flex-1 text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages(filteredUsers.length)}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange("prev", filteredUsers.length)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" /> Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange("next", filteredUsers.length)}
                                            disabled={currentPage >= totalPages(filteredUsers.length)}
                                        >
                                            Next <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ---------------- FILES TAB ---------------- */}
                <TabsContent value="files">
                    <Card>
                        <CardHeader>
                            <CardTitle>Uploaded Resources</CardTitle>
                            <CardDescription>
                                Manage notes, papers, and syllabus files.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <span className="ml-2 text-muted-foreground">Fetching files...</span>
                                </div>
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>File Name</TableHead>
                                                <TableHead>Subject & Type</TableHead>
                                                <TableHead className="text-center">Engagement</TableHead>
                                                <TableHead className="text-center text-destructive">Reports</TableHead>
                                                <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {getPaginatedData(filteredFiles).length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                        No files found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                getPaginatedData(filteredFiles).map((file) => (
                                                    <TableRow key={file._id} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium max-w-[200px] truncate" title={file.original_File_Name}>
                                                            {file.original_File_Name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-sm">{file.subject}</span>
                                                                <Badge variant="outline" className="w-fit capitalize text-xs">
                                                                    {file.resource_type}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="text-xs space-x-1">
                                                                <span className="text-green-600 font-bold">{file.upvotes.length}↑</span>
                                                                <span className="text-muted-foreground">/</span>
                                                                <span className="text-red-600 font-bold">{file.downvotes.length}↓</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {file.reports.length > 0 ? (
                                                                <Badge variant="destructive">{file.reports.length}</Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground text-xs">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                                            {formatDate(file.uploadedAt)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button asChild size="icon" variant="ghost" title="Visit Author">
                                                                    <Link href={`/resources?fileId=${file._id}`} target="_blank" rel="noreferrer">
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button size="icon" variant="ghost" onClick={() => confirmDeleteFile(file)}>
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-end space-x-2 py-4">
                                        <div className="flex-1 text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages(filteredUsers.length)}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange("prev", filteredUsers.length)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" /> Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange("next", filteredUsers.length)}
                                            disabled={currentPage >= totalPages(filteredUsers.length)}
                                        >
                                            Next <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- DIALOGS (MODALS) --- */}

                {/* 1. Email User Dialog */}
                <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Email {selectedUser?.name}</DialogTitle>
                            <DialogDescription>
                                Send an official notification to {selectedUser?.email}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input onChange={(e) => setEmailSubject(e.target.value)} id="subject" placeholder="Warning regarding..." />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea onChange={(e) => setEmailMessage(e.target.value)} id="message" placeholder="Type your message here..." rows={4} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSendEmail}>Send Email</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* 2. Delete User Confirmation */}
                <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete User Account?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete
                                <span className="font-bold text-foreground"> {selectedUser?.name} </span>
                                and remove their data from your servers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>Cancel</Button>
                            <Button disabled={isDeletingUser} variant="destructive" onClick={() => handleDeleteUser(selectedFile?._id)}>
                                {isDeletingUser ? <div><LoaderCircle className="text-primary animate-spin" /></div>
                                    : <div>Delete Account</div>}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* 3. Delete File Confirmation */}
                <Dialog open={isDeleteFileOpen} onOpenChange={setIsDeleteFileOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Resource?</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete
                                <span className="font-bold mr-1 text-foreground"> {selectedFile?.original_File_Name}</span>?
                                This file will be removed from Cloudinary and the database.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteFileOpen(false)}>Cancel</Button>
                            <Button asChild disabled={isDeletingFile} variant="destructive" onClick={() => handleDeleteFile(selectedFile?._id)}>
                                {isDeletingFile ? <div><LoaderCircle className="text-primary animate-spin" /></div>
                                    : <div>Delete File</div>}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </Tabs>

        </div>
    );
}