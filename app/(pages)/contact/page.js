"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Loader2, Send } from "lucide-react";

import { ToastContainer, toast } from 'react-toastify';
// NOTE: You must also import the CSS file for react-toastify in your main layout:
// import 'react-toastify/dist/ReactToastify.css';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendEmailAction } from "@/lib/actions/emailActions";
import { useTheme } from "next-themes";

// --- Zod Schema Definition ---
const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  category: z.string({ required_error: "Please select a category." }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(20, {
    message: "Message must be at least 20 characters.",
  }),
  resourceIdentifier: z.string().optional(),
}).superRefine((data, ctx) => {
  // Custom validation check: If the user selects 'note-issue', the identifier should be required
  if (data.category === 'note-issue' && (!data.resourceIdentifier || data.resourceIdentifier.trim().length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide the name or URL of the resource.",
      path: ['resourceIdentifier'],
    });
  }
});


export default function ContactPage() {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      category: "",
      subject: "",
      message: "",
      resourceIdentifier: "",
      name: "",
    },
  });

  // Access the watch function to conditionally render the resource identifier field
  const selectedCategory = form.watch("category");

  // 2. Define the submit handler
  async function onSubmit(values) {
    setIsSubmitting(true);
    console.log("values are: ", values)
    const emailMessage = `<h1>User with email - ${values.email} has sent a feedback!</h1>
    <p>Name: ${values.name? values.name : "Not Given"}</p> <p>Category: ${values.category? values.category : "Not Given"}</p> <p>Message is :-</p>
    <div>${values.message}</div>`
 
    const sendEmail = await sendEmailAction({
      to: "sameersharm1234@gmail.com",
      subject: values.subject,
      htmlContent: emailMessage,
    })
    console.log("Email: ", sendEmail)

    if (sendEmail.success) {
      toast.success("Feedback Sent! 🚀 Thank you for your message. We'll get back to you soon.", {
        position: "top-right",
        autoClose: 5000,
      });
      form.reset();
    } else {
      toast.error("Uh oh! Something went wrong. There was a problem sending your message.", {
        position: "top-right",
        autoClose: 5000,
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 100);
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      {/* 1. Add the ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // or "dark" or "colored"
      />
      {/* End ToastContainer */}

      <Card className={`shadow-lg border ${theme==="dark"? "border-white": "border-black"}`}>
        <CardHeader className="text-center">
          <Mail className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-bold tracking-tight mt-4">
            Share Your Valuable Feedback
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Let us know what's on your mind—whether it's a bug, a feature request, or an issue with an existing resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* --- Name (Optional) --- */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Email (Required) --- */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@university.edu" {...field} />
                    </FormControl>
                    <FormDescription>
                      We need a valid email to respond to your inquiry.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Category (Required) --- */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value} // Controlled component
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason for contacting us" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general-feedback">General Feedback / Compliment</SelectItem>
                        <SelectItem value="bug-report">Bug Report</SelectItem>
                        <SelectItem value="feature-request">Feature Request / Suggestion</SelectItem>
                        <SelectItem value="note-issue">Issue with a Note/Resource (e.g., wrong content, bad quality)</SelectItem>
                        <SelectItem value="account-issue">Account or Upload Issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- CONDITIONAL FIELD (Appears based on category) --- */}
              {selectedCategory === 'note-issue' && (
                <FormField
                  control={form.control}
                  name="resourceIdentifier"
                  render={({ field }) => (
                    <FormItem className="rounded-lg border-2 border-primary/50 bg-primary/5 p-4 transition-all duration-300">
                      <FormLabel className="font-bold text-primary">Resource Identifier (Required for Issue)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Advanced Calculus Midterm Review' or the URL" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please provide the exact name or the link (URL) of the resource in question.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* --- Subject (Required) --- */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Search bar is not working correctly" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Message (Required) --- */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Detailed Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide specific details, steps to reproduce a bug, or a clear explanation of your feature idea..."
                        rows={7}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Submit Button --- */}
              <Button type="submit" className="w-full h-11 text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Feedback
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}