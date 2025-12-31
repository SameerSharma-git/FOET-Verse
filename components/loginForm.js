"use client"; // This component needs client-side interactivity
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Corrected import for useRouter in App Router
import Link from 'next/link';


import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, EyeOff } from 'lucide-react';

import { useForm, Controller } from 'react-hook-form';
import { useTheme } from 'next-themes';

// --- Login Page Component ---
const LoginPage = () => {
    const { theme } = useTheme();
    const router = useRouter(); // Initialize useRouter
    const pathname = usePathname()

    // Initialize react-hook-form with the field names that match your backend schema
    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            // 🔑 ADD DEFAULT VALUES FOR YOUR SELECT FIELDS HERE
            branch: '',
            year: '',
            semester: '',
        },
    });

    // State for managing loading status during form submission
    const [isLoading, setIsLoading] = useState(false);
    // State for displaying a general error message (e.g., from API)
    const [errorMessage, setErrorMessage] = useState('');
    // State for displaying a success message
    const [successMessage, setSuccessMessage] = useState('');
    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Handle form submission
    // The 'data' parameter here will NOW include 'branch', 'year', and 'semester'
    const onSubmit = async (data) => {
        setIsLoading(true); // Start loading
        setErrorMessage(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        try {
            const response = await fetch(pathname.endsWith('/signup') ? '/api/auth/signup' : "/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // <-- THIS IS CRUCIAL
                },
                body: JSON.stringify(data), // <-- Use 'data' from react-hook-form directly
            });
            const responseData = await response.json();

            if (response.status === 201) {
                pathname.endsWith('/signup') ? setSuccessMessage('Account created successfully! Redirecting...') : setSuccessMessage('Loggedin successfully! Redirecting...')
                router.push('/dashboard');
                router.refresh();
            } else {
                setErrorMessage(responseData.error);
            }

        } catch (error) {
            console.error('Network error:', error);
            setErrorMessage('Network error. Please check your internet connection.');
        } finally {
            setIsLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300">
            {/* Replaced outer div with Card component for structure and styling */}
            <Card className="login-form-bg p-10 md:mt-6 md:mb-28 rounded-xl shadow-2xl w-full max-w-lg border border-[var(--light-text-color-tertiary)] dark:border-[var(--dark-text-color-tertiary)] transform transition-all duration-300 hover:shadow-3xl">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-3xl font-bold text-center text-[var(--light-text-color-primary)] dark:text-[var(--dark-text-color-primary)]">
                        {pathname.endsWith('/signup') ? "Create Account" : "Log In to FOET-Verse"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Display general error message using Alert */}
                    {errorMessage && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription className="text-center">{errorMessage}</AlertDescription>
                        </Alert>
                    )}
                    {/* Display success message using Alert */}
                    {successMessage && (
                        <Alert className="mb-4 border-green-400 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-300">
                            <AlertDescription className="text-center">{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Input */}
                        {pathname.endsWith('/signup') && (
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-[var(--light-text-color-secondary)] dark:text-[var(--dark-text-color-secondary)]">
                                    Name
                                </Label>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{
                                        required: 'Name is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Name must be at least 3 characters',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            id="name"
                                            placeholder="your name"
                                        // Removed redundant/conflicting custom classes like 'mt-1 block w-full...'
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                                )}
                            </div>
                        )}


                        {/* Email Input */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-[var(--light-text-color-secondary)] dark:text-[var(--dark-text-color-secondary)]">
                                Email Address
                            </Label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                        message: 'Email must end with @gmail.com',
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="email"
                                        id="email"
                                        placeholder="your.email@gmail.com"
                                    />
                                )}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        {/* SELECT INPUTS - CONVERTED TO SHADCN SELECT */}
                        {pathname.endsWith('/signup') && (
                            <div className={`select-container flex flex-col gap-4 items-start justify-center border outline-none rounded-md shadow-sm ${theme === "dark" ? "border-white" : "border-black"} p-6`}>

                                {/* Branch Select */}
                                <div className="flex flex-col space-y-1 w-full">
                                    <Label htmlFor="branch" className='font-semibold'>Choose Your Branch:</Label>
                                    <Controller
                                        name="branch"
                                        control={control}
                                        rules={{ required: 'Branch is required' }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            // The Select component handles the UI, setting the ID on SelectTrigger
                                            >
                                                <SelectTrigger id="branch" className='w-full'>
                                                    <SelectValue placeholder="-- Please select --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {/* 🔑 Note: SelectItems handle the value; a placeholder SelectItem isn't needed. */}
                                                    <SelectItem value="CSE">CSE</SelectItem>
                                                    <SelectItem value="CSE-AI">CSE - AI</SelectItem>
                                                    {/* <SelectItem value="BCA">BCA</SelectItem>
                                                    <SelectItem value="MCA">MCA</SelectItem> */}
                                                    <SelectItem value="ECE">ECE</SelectItem>
                                                    <SelectItem value="EE">EE</SelectItem>
                                                    <SelectItem value="ME">ME</SelectItem>
                                                    <SelectItem value="CE-Civil">CE - civil</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.branch && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.branch.message}</p>}
                                </div>

                                {/* Year Select */}
                                <div className="flex flex-col space-y-1 w-full">
                                    <Label htmlFor="year" className='font-semibold'>Choose Your Year:</Label>
                                    <Controller
                                        name="year"
                                        control={control}
                                        rules={{ required: 'Year is required' }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger id="year" className='w-full'>
                                                    <SelectValue placeholder="-- Please select --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">1st</SelectItem>
                                                    <SelectItem value="2">2nd</SelectItem>
                                                    <SelectItem value="3">3rd</SelectItem>
                                                    <SelectItem value="4">4th</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.year && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.year.message}</p>}
                                </div>

                                {/* Semester Select */}
                                <div className="flex flex-col space-y-1 w-full">
                                    <Label htmlFor="semester" className='font-semibold'>Choose Your Semester:</Label>
                                    <Controller
                                        name="semester"
                                        control={control}
                                        rules={{ required: 'Semester is required' }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger id="semester" className='w-full'>
                                                    <SelectValue placeholder="-- Please select --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">1</SelectItem>
                                                    <SelectItem value="2">2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.semester && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.semester.message}</p>}
                                </div>
                            </div>
                        )}
                        {/* END OF SELECT INPUTS */}

                        {/* Password Input with Eye Button */}
                        <div className="space-y-1 relative">
                            <Label htmlFor="password" className="text-[var(--light-text-color-secondary)] dark:text-[var(--dark-text-color-secondary)]">
                                Password
                            </Label>
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            placeholder="xyz!@@323mkdir"
                                        // Input is now nested inside a relative div to correctly position the eye button
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost" // Use the ghost variant for a minimal button
                                            size="sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 h-full px-3 text-[var(--light-text-color-secondary)] dark:text-[var(--dark-text-color-secondary)] hover:bg-transparent"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {/* Use Lucide icons */}
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                )}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button with Loading Indicator */}
                        <Button
                            type="submit"
                            className="w-full py-5 px-4 text-lg font-semibold transition duration-300 transform hover:scale-[1.01]" // Kept size/hover classes
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                pathname.endsWith('/signup') ? "Create Account" : "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Signup/Login Link */}
                    <p className="mt-6 text-center text-sm text-[var(--light-text-color-secondary)] dark:text-[var(--dark-text-color-secondary)]">
                        {pathname.endsWith('/signup') ? (
                            <>
                                Already have an account?
                                <Link href="/login" className="font-medium mx-2 text-blue-600 hover:text-blue-500 cursor-pointer">
                                    Login
                                </Link>
                            </>
                        ) : (
                            <>
                                Don&apos;t have an account?
                                <Link href="/signup" className="font-medium mx-2 text-blue-600 hover:text-blue-500 cursor-pointer">
                                    Signup
                                </Link>
                            </>
                        )}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;