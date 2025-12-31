"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'; // Import axios

// --- Import shadcn/ui components (Ensure these are installed) ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, User, LoaderCircle, Layers, Image as ImageIcon, AlertTriangle, XCircle } from "lucide-react";
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

// --- Constants ---
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const API_ROUTE_URL = '/api/profile/update';

// Default/mock data for initial form state (Replace with actual data fetched from API)
const mockUserData = {
  _id: "65e21919865a781b22579b76", // IMPORTANT: Use a valid MongoDB ID for testing
  name: "Jane Doe",
  email: "jane.doe@example.com",
  profilePicture: "/images/pexels-eneminess-9418435.jpg", // Existing URL/Path
  branch: "Computer Science",
  year: 3,
  semester: 1,
};

// Select options
const yearOptions = [1, 2, 3, 4];
const semesterOptions = [1, 2];
const branchOptions = ["CSE", "CSE-AI", "ECE", "EE", "ME", "CE-Civil",];


export function UpdateProfileForm({ currentUserData }) {
  
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataToSubmit, setDataToSubmit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme } = useTheme();

  // State to hold the confirmed URL string for display purposes, initialized with current user data
  const [currentPictureUrl, setCurrentPictureUrl] = useState(currentUserData.profilePicture);

  // Use useMemo for stable and predictable default values to avoid re-renders and `isDirty` issues
  const defaultFormValues = useMemo(() => ({
    _id: currentUserData._id, // Include _id for API identification
    name: currentUserData.name,
    email: currentUserData.email,
    branch: currentUserData.branch,
    year: String(currentUserData.year),
    semester: String(currentUserData.semester),
    password: "", // Always start empty
    profilePicture: null, // CRITICAL: Initialize to null for file input
  }), [currentUserData]);


  const form = useForm({
    defaultValues: defaultFormValues, 
    mode: "onChange",
  });

  const { 
    handleSubmit, 
    control, 
    watch, 
    setError, 
    clearErrors, 
    formState,
    reset 
  } = form; 
  
  const { isDirty, isValid, errors } = formState;

  // Submit button is disabled if submitting, no changes made, or form is invalid
  const isSubmitDisabled = isSubmitting || !isDirty || !isValid;

  // Watch the file input (this will be a File object or null)
  const profilePictureFile = watch("profilePicture");

  // Determine the live preview URL for the Avatar
  const profilePicturePreviewUrl = useMemo(() => {
    if (profilePictureFile instanceof File) {
      return URL.createObjectURL(profilePictureFile);
    }
    return currentPictureUrl;
  }, [profilePictureFile, currentPictureUrl]);

  // Cleanup for object URL to avoid memory leaks when new files are selected or component unmounts
  useEffect(() => {
    return () => {
      if (profilePictureFile instanceof File && profilePicturePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(profilePicturePreviewUrl);
      }
    };
  }, [profilePictureFile, profilePicturePreviewUrl]);


  // Handler to intercept submission and open dialog
  const onFormSubmit = useCallback((data) => {
    // When submitting, include _id and manage profilePicture
    const submissionData = {
        ...data,
        _id: currentUserData._id, // Ensure _id is part of the data being prepared
        // profilePicture will be a File object (if new file) or null (if cleared/untouched)
        // We handle sending the currentPictureUrl to the API in handleUpdateConfirmed if no file is chosen.
    };
    
    if (!isValid || !isDirty) return; 
    setDataToSubmit(submissionData);
    setIsDialogOpen(true);
  }, [isValid, isDirty, currentUserData._id]); 

  // ShowToast Function
  const showToast = (message, type = 'info') => {
    toast(message, { type, position: "bottom-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: theme, });
  }

  // Function executed AFTER confirmation (sends data to API)
  const handleUpdateConfirmed = useCallback(async () => {
    if (!dataToSubmit) return;

    setIsSubmitting(true);
    setIsDialogOpen(false); 

    const formData = new FormData();

    // Append all fields to FormData
    formData.append('_id', dataToSubmit._id);
    formData.append('name', dataToSubmit.name);
    formData.append('email', dataToSubmit.email);
    formData.append('branch', dataToSubmit.branch);
    formData.append('year', dataToSubmit.year);
    formData.append('semester', dataToSubmit.semester);
    if (dataToSubmit.password) {
      formData.append('password', dataToSubmit.password);
    }
    
    // Handle profile picture:
    if (dataToSubmit.profilePicture instanceof File) {
        // If a new file was selected, append the file itself
        formData.append('profilePicture', dataToSubmit.profilePicture); 
    } else if (profilePictureFile === null && currentPictureUrl !== null && currentPictureUrl !== '/images/profile.svg') {
        // This is the "clear existing picture" scenario.
        // If profilePicture in form state is null, AND we *had* a picture URL,
        // and it's not the default placeholder, then send 'null' to explicitly clear.
        formData.append('profilePicture', 'null'); 
    } else {
        // If no new file, and not explicitly clearing, send the current valid URL string
        // so the backend knows to keep it.
        formData.append('profilePicture', currentPictureUrl || ''); 
    }


    try {
      const response = await axios.put(API_ROUTE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for sending FormData
        },
      });
      
      showToast(response.data.message || "Profile updated successfully!", 'success');
      
      // Update the currentPictureUrl state with the URL returned by the API
      // This ensures the displayed image is always in sync with the backend
      setCurrentPictureUrl(response.data.newProfilePictureUrl || null);

      // Reset the form to its new, clean state
      reset({
        ...dataToSubmit, // Use the submitted data (excluding password)
        password: "", // Clear password field
        profilePicture: null, // Clear the file input
        year: String(dataToSubmit.year),
        semester: String(dataToSubmit.semester),
      });

    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
      setDataToSubmit(null);
    }
  }, [dataToSubmit, reset, showToast, currentPictureUrl, profilePictureFile, currentUserData._id]);


  // Custom handler for the File input with client-side validation
  const handleFileChange = useCallback((event, field) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("profilePicture", { type: "manual", message: "Image size must be less than 3MB." });
        field.onChange(null); 
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError("profilePicture", { type: "manual", message: "Only JPG, JPEG, PNG, or WEBP formats are allowed." });
        field.onChange(null);
        return;
      }
      clearErrors("profilePicture");
      field.onChange(file); // Set the File object to the form state
    } else {
      // If the user clears the file input, set the form value to null
      field.onChange(null); 
      clearErrors("profilePicture");
    }
  }, [setError, clearErrors]);


  // Handler to clear the selected profile picture (both preview and form state)
  const handleClearProfilePicture = useCallback(() => {
    form.setValue("profilePicture", null, { shouldDirty: true }); // Set to null and mark as dirty
    form.trigger("profilePicture"); // Trigger validation
  }, [form]);


  return (
    <>
      <Card className="w-[95%] xl:w-full max-w-[95vw] md:max-w-2xl mx-auto shadow-lg border-2 mb-10 mt-2 md:mt-0">
        <ToastContainer />
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <User className="w-6 h-6 mr-2 text-primary" />
            Update Your Profile
          </CardTitle>
          <CardDescription>
            Review and update your personal and academic details. Click &apos;Update Profile&apos; to confirm the changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">

              {/* --- 1. Profile Picture Field --- */}
              <FormField
                control={control}
                name="profilePicture"
                render={({ field: { onChange, value, ...restField } }) => (
                  <FormItem className="flex flex-col items-center space-y-3">
                    <FormLabel className="text-lg font-semibold">Profile Picture</FormLabel>
                    <div className="relative">
                      <Avatar className="w-24 h-24 ring-4 ring-primary ring-offset-2 hover:opacity-90 transition-opacity">
                        <AvatarImage src={profilePicturePreviewUrl} alt="Current Profile" />
                        <AvatarFallback><ImageIcon className='w-8 h-8' /></AvatarFallback>
                      </Avatar>
                      {/* Only show clear button if there's an actual picture (not default placeholder) */}
                      {profilePicturePreviewUrl && profilePicturePreviewUrl !== '/images/profile.svg' && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="absolute top-0 right-0 -mt-2 -mr-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
                          onClick={handleClearProfilePicture}
                          disabled={isSubmitting}
                        >
                          <XCircle className="h-5 w-5 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <FormControl>
                      <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                          id="profilePicture"
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(',')}
                          onChange={(e) => handleFileChange(e, { onChange })}
                          className="cursor-pointer"
                          disabled={isSubmitting}
                          {...restField}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-center">
                      JPG, PNG, or WEBP only. Max size: 3MB. **(Optional)**
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 2. Personal Details (Name & Email) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  control={control} 
                  name="name" 
                  rules={{ required: "Name is required.", minLength: { value: 2, message: "Name must be at least 2 characters." } }} 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Full Name" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <FormField 
                  control={control} 
                  name="email" 
                  rules={{ required: "Email is required.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format." } }} 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@university.com" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>

              {/* --- 3. Password Field --- */}
              <FormField
                control={control}
                name="password"
                rules={{ 
                  validate: (value) => {
                    if (value && value.length > 0 && value.length < 6) {
                      return "Password must be at least 6 characters.";
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Leave blank to keep current password" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>
                      Min. 6 characters (if changing). Leave blank to keep current.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 4. Academic Details (Branch, Year, Semester) --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Branch */}
                <FormField 
                  control={control} 
                  name="branch" 
                  rules={{ required: "Branch is required." }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch / Specialization</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your branch" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branchOptions.map(branch => (<SelectItem key={branch} value={branch}>{branch}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                {/* Year */}
                <FormField 
                  control={control} 
                  name="year" 
                  rules={{ required: "Year is required." }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {yearOptions.map(year => (<SelectItem key={year} value={String(year)}>{year}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                {/* Semester */}
                <FormField 
                  control={control} 
                  name="semester" 
                  rules={{ required: "Semester is required." }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Semester</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Semester" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {semesterOptions.map(semester => (<SelectItem key={semester} value={String(semester)}>{semester}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>

              {/* --- 5. Submit Button --- */}
              <Button type="submit" className="w-full mt-6 text-lg" disabled={isSubmitDisabled}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Changes...</>
                ) : (
                  <span className="flex items-center"><Layers className="h-4 w-4 mr-2" /> Update Profile</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* --- Confirmation AlertDialog --- */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Confirm Profile Update
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes to your profile?
              {dataToSubmit?.password && <p className="mt-2 font-semibold text-primary">**Note:** You are also changing your password.</p>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateConfirmed} disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
              ) : (
                "Yes, Update Profile"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}