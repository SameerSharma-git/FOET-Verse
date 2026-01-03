"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { sendEmailAction } from "@/lib/actions/emailActions";
import { updateFile } from "@/lib/actions/fileActions";
import { toast, ToastContainer } from "react-toastify"

export function ReportFileDialog({ open, setOpen, loggedUserId, loggedUserEmail, reportedFileId, reportedFileName }) {
    const [formData, setFormData] = useState({
        concern: "",
        message: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loggedUserEmail) return null;

        try {
            await updateFile({ _id: reportedFileId }, { $push: { reports: loggedUserId } });

            const htmlContent = `<h2>User with email - ${loggedUserEmail} has reported file with fileId - ${reportedFileId} and filename - ${reportedFileName}</h2> <p>Message is : ${formData.message}</p>`

            // Handle your submission logic here (e.g., API call)
            sendEmailAction({
                to: "sameersharm1234@gmail.com",
                subject: formData.concern,
                htmlContent
            })
            toast.info("Feedback sent successfully. We will catch you later.", { autoClose: 3000, position: "bottom-right", theme })
        } catch (error) {
            console.error("Error occured while reporting: ", error.message);
        }

        // Close dialog and reset form
        setOpen(false);
        setFormData({ concern: "", message: "" });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <ToastContainer />
            {/* <DialogTrigger asChild>
                <Button variant="outline">Report an Issue</Button>
            </DialogTrigger> */}

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submit a Concern</DialogTitle>
                    <DialogDescription>
                        Let us know what&apos;s wrong. We&apos;ll get back to you as soon as possible.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="concern">Concern</Label>
                        <Input
                            id="concern"
                            placeholder="e.g., Missing notes, App bug"
                            value={formData.concern}
                            onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Input
                            id="message"
                            placeholder="Describe your issue in detail..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}