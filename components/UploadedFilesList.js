"use client"

import * as React from "react"
import {
    LoaderCircle, Filter, Download, BookOpen, Search,
    ArrowUp, ArrowDown, MessageSquare, FileText, Send,
    ChevronLeft, ChevronRight, DownloadIcon, Flag,
    ExternalLink
} from "lucide-react"
import {
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel, useReactTable,
} from "@tanstack/react-table"

// --- UI Imports (shadcn/ui) ---
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

import { updateUserUp_Down_comments } from "@/lib/actions/userActions"
import { useTheme } from "next-themes"
import Link from "next/link"
import { GeneralAlert } from "@/components/GeneralAlert"
import { ReportFileDialog } from "@/components/ReportFileDialog"
import { toast, ToastContainer } from "react-toastify"
import { pushFileById, updateFile } from "@/lib/actions/fileActions"

const DocumentPreviewDialog = ({ file_name, secure_url }) => {
    // Check if URL exists and is not a placeholder hash
    const isPreviewable = secure_url && secure_url !== '#' && secure_url !== '';

    return (
        isPreviewable ? (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-[95vw] sm:max-w-[1000px] h-[90vh] flex flex-col p-6">
                    <DialogHeader className="shrink-0 pb-2">
                        <DialogTitle className="truncate">Preview: {file_name}</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 w-full bg-muted rounded-md overflow-hidden border border-border">
                        <iframe
                            src={secure_url}
                            title={`Preview of ${file_name}`}
                            className="w-full h-full border-0"
                            loading="lazy"
                            allowFullScreen
                        />
                    </div>

                    {/* <PdfViewer url={secure_url} fileName={file_name} /> */}
                </DialogContent>
            </Dialog>
        ) : (
            <Button variant="outline" size="sm" disabled={true} className="w-full md:w-auto opacity-50 cursor-not-allowed">
                <BookOpen className="mr-2 h-4 w-4" />
                No Preview
            </Button>
        )
    );
};

const Comment = ({ comment }) => {
    const { user, text, createdAt } = comment;

    // Safety check if user object is missing
    if (!user) return null;

    const userMeta = [
        user.branch,
        user.year ? `Year ${user.year}` : null,
    ].filter(Boolean).join(' • ');

    return (
        <div className="flex items-start space-x-3 py-3 animate-in fade-in duration-300">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
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

export default function FileCard({ file, user }) {
    const [comment, setComment] = React.useState("");
    const { theme } = useTheme();

    const [isDownloading, setIsDownloading] = React.useState(false);

    // States for Report Feature
    const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);
    const [reportedFileId, setReportedFileId] = React.useState(null);
    const [reportedFileName, setReportedFileName] = React.useState(null);

    const [isUpvoted, setIsUpvoted] = React.useState(false);
    const [isDownvoted, setIsDownvoted] = React.useState(false);

    const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);
    React.useEffect(() => {
        if (user) {
            if (file.upvotes.includes(user._id)) {
                setIsUpvoted(true)
            } if (file.downvotes.includes(user._id)) {
                setIsDownvoted(true)
            }
        }
    }, [user, file.downvotes, file.upvotes])

    // Alert States
    const [toAlert, setToAlert] = React.useState(false);
    const [alertTitle, setAlertTitle] = React.useState("");
    const [alertMessage, setAlertMessage] = React.useState("");


    // CALCULATION: Getting lengths from arrays (Schema Match)
    const [upvoteCount, setUpvoteCount] = React.useState(file.upvotes ? file.upvotes.length : 0);
    const [downvoteCount, setDownvoteCount] = React.useState(file.downvotes ? file.downvotes.length : 0);
    const [downloadCount, setDownloadCount] = React.useState(file.downloads ? file.downloads : 0);
    const [commentCount, setCommentCount] = React.useState(file.comments ? file.comments.length : 0);
    // const upvoteCount = file.upvotes ? file.upvotes.length : 0;
    // const downvoteCount = file.downvotes ? file.downvotes.length : 0;
    // const commentCount = file.comments ? file.comments.length : 0;


    const handleUp_DownVoteClick = async (type, file_id, userId) => {
        if (!userId) {
            setAlertTitle("Not Logged In!");
            setAlertMessage(`You must login to ${type}.`)
            setToAlert(true);
            return null
        }

        if (type === "upvote" && isDownvoted) {
            setIsDownvoted(false);
            setDownvoteCount(prev => prev - 1)
            await pushFileById(file_id, "downvote", userId, true);
            await updateUserUp_Down_comments(userId, "downvote", file_id, true);
        } else if (type === "downvote" && isUpvoted) {
            setIsUpvoted(false);
            setUpvoteCount(prev => prev - 1)
            await pushFileById(file_id, "upvote", userId, true);
            await updateUserUp_Down_comments(userId, "upvote", file_id, true);
        }

        const bool = type === "upvote" ? isUpvoted : isDownvoted;
        if (type === "upvote") {
            setIsUpvoted(prev => !prev);
            bool ? setUpvoteCount(prev => prev - 1) : setUpvoteCount(prev => prev + 1);
        } else {
            setIsDownvoted(prev => !prev);
            bool ? setDownvoteCount(prev => prev - 1) : setDownvoteCount(prev => prev + 1);
        }

        pushFileById(file_id, type, userId, bool);
        updateUserUp_Down_comments(userId, type, file_id, bool);
    }

    const handleAddCommentButton = (fileId) => {
        console.log("Adding Comment")
        if (!user) {
            setAlertTitle("Not Logged In!");
            setAlertMessage(`You must login to add a comment.`)
            setToAlert(true);
            return null
        }

        const commentToAdd = {
            text: comment,
            createdAt: Date.now(),
            userId: user._id,
        }
        pushFileById(fileId, "comment", commentToAdd).then(() => {
            updateUserUp_Down_comments(user._id, "comment", commentToAdd);
        })
    }

    const handleReport = (fileId, fileName) => {
        if (!user) {
            setAlertTitle("Not Logged In!");
            setAlertMessage(`You must login to add a comment.`)
            setToAlert(true);
            return null
        }

        setReportedFileId(fileId);
        setReportedFileName(fileName);
        setIsReportDialogOpen(true);
    }

    const handleDownload = async (fileId, fileUrl, fileName = 'download') => {
        try {
            const response = await fetch(fileUrl, {
                method: 'GET',
                // Add headers here if your notes are protected/private
                // headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            setIsDownloading(true);
            const blob = await response.blob();
            setIsDownloading(false);

            // Safety check: Ensure blob has content
            if (blob.size === 0) throw new Error('The file appears to be empty.');

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', fileName); // Force download with custom name
            link.style.display = 'none'; // Ensure it's hidden

            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setDownloadCount(prev => prev + 1);
            updateFile({ _id: fileId }, { $inc: { downloads: 1 } });
        } catch (error) {
            toast.error("Download Failed!", { autoClose: 3000, position: "bottom-right", theme })
            console.error('Download error:', error.message);
        }
    };

    const shareContent = () => {
        if (navigator.share) {
            try {
                navigator.share({
                    title: "Check This File Out!",
                    text: `This is a cool pdf - ${file.original_File_Name}`,
                    url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/resources?fileId=${file._id}`
                })
            } catch (error) {
                console.error("Error occured while sharing: ", error.message);
                toast.error("Sharing not supported in this browser!", { autoClose: 3000, position: "bottom-right", theme })
            }
        }
    };

    const isPreviewable = file.secure_url && file.secure_url !== '#' && file.secure_url !== '';

    const formattedType = file.resource_type
        ? file.resource_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'File';

    const formattedDate = new Date(file.uploadedAt).toLocaleDateString();

    return (
        <Card className="p-2.5 w-full shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Alert Dialog */}
                <GeneralAlert
                    open={toAlert}
                    onOpenChange={() => setToAlert(!toAlert)}
                    title={alertTitle}
                    description={alertMessage}
                />

                {/* Report Dialog */}
                <ReportFileDialog
                    open={isReportDialogOpen}
                    setOpen={setIsReportDialogOpen}
                    loggedUserId={user?._id}
                    loggedUserEmail={user?.email}
                    reportedFileId={reportedFileId}
                    reportedFileName={reportedFileName}
                />

                <ToastContainer />

                {/* 1. Thumbnail / Preview Area */}
                <div className="w-full md:w-48 bg-muted/30 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-border/60">
                    {isPreviewable ? (
                        // Using a small div to represent the thumbnail logic
                        <div className="flex flex-col items-center justify-center text-primary/80">
                            <BookOpen className="h-10 w-10 mb-2 opacity-50" />
                            <span className="text-xs font-medium text-muted-foreground">Preview Available</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <FileText className="h-10 w-10 mb-2 opacity-50" />
                            <span className="text-xs">No Preview</span>
                        </div>
                    )}
                </div>

                {/* 2. Content Area */}
                <div className="flex-1 p-4 flex flex-col justify-between gap-4">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-lg text-primary line-clamp-1" title={file.original_File_Name}>
                                {file.original_File_Name}
                            </h3>
                            <Badge variant={file.resource_type === 'PYQ' ? 'destructive' : 'default'} className="shrink-0 capitalize">
                                {formattedType}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="secondary" className="font-mono text-xs">{file.course}</Badge>
                            {file.Branch && <Badge variant="outline" className="text-xs">{file.Branch}</Badge>}
                            {file.year && <span className="text-xs text-muted-foreground">Year {file.year}</span>}
                            {file.semester && <span className="text-xs text-muted-foreground">Sem {file.semester}</span>}
                        </div>

                        <p className="text-sm text-muted-foreground mt-2">
                            Subject: <span className="font-medium text-foreground">{file.subject}</span>
                        </p>

                        <div className="flex items-center justify-start gap-2">
                            <p className="text-sm text-muted-foreground mt-2">
                                <Link className="font-medium text-muted-foreground text-xs underline" href={`/user-profile/${file.uploadedByUser}`}>See Author</Link>
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">Uploaded on {formattedDate}</p>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">

                        {/* Stats Group */}
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                            <div className="flex items-center gap-3 bg-muted/40 px-3 py-1.5 rounded-full border">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button onClick={() => handleUp_DownVoteClick("upvote", file._id, user?._id)} className={`flex items-center cursor-pointer gap-1 ${isUpvoted && "text-green-600"} hover:text-green-600 transition-colors`}>
                                                <ArrowUp className="h-4 w-4" />
                                                <span className="text-sm font-medium">{upvoteCount}</span>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>Upvote</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <Separator orientation="vertical" className="h-4" />

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button onClick={() => handleUp_DownVoteClick("downvote", file._id, user?._id)} className={`flex items-center cursor-pointer gap-1 ${isDownvoted && "text-red-600"} hover:text-red-600 transition-colors`}>
                                                <ArrowDown className="h-4 w-4" />
                                                <span className="text-sm font-medium">{downvoteCount}</span>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>Downvote</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            {/* Comment Button */}
                            {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                                className={isCommentsOpen ? "bg-muted" : ""}
                            >
                                <MessageSquare className="h-4 w-4 mr-1.5" />
                                <span className="text-xs">{commentCount}</span>
                            </Button> */}

                            <div className="flex items-center justify-center gap-2">
                                <div className="flex items-center justify-center gap-2.5 text-accent-foreground text-sm">
                                    <DownloadIcon className="h-4 w-4" /> {downloadCount}
                                </div>
                                <div onClick={shareContent} className="ml-2">
                                    <ExternalLink className="h-4 w-4 ml-2" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReport(file._id, file.original_File_Name)}
                                    className={isReportDialogOpen && "bg-muted"}
                                >
                                    <Flag className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center flex-col md:flex-row gap-2 w-full sm:w-auto">
                            <DocumentPreviewDialog
                                file_name={file.original_File_Name}
                                secure_url={file.secure_url}
                            />
                            <Button asChild onClick={() => handleDownload(file._id, file.secure_url, file.original_File_Name)} variant="default" size="sm" disabled={isDownloading} className={`w-full sm:w-auto`}>
                                {isDownloading ? (
                                    <div>
                                        <LoaderCircle className="animate-spin h-5 w-5" />
                                    </div>
                                ) : (
                                    <div>
                                        <Download className="h-4 w-4 mr-2" /> Download
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Comments Section */}
            {isCommentsOpen && (
                <div className="bg-muted/10 border-t p-4 animate-in animate-out slide-in-from-top-2">
                    <h4 className="text-sm font-semibold mb-3">Comments ({commentCount})</h4>
                    <div className="space-y-1 max-h-[30vh] overflow-y-auto">
                        {file.comments && file.comments.length > 0 ? (
                            file.comments.map(c => <Comment key={c._id} comment={c} />)
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No comments yet.</p>
                        )}
                    </div>
                    <div className="flex w-full mt-3.5 gap-4 overflow-hidden">
                        <Input
                            className="rounded border focus-visible:ring-0"
                            placeholder="Add a comment"
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                            onClick={() => handleAddCommentButton(file._id)}
                            className="rounded cursor-pointer">
                            <Send className="h-2 w-2 hover:scale-105" />
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};