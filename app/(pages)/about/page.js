"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Users, 
  Zap, 
  MessageSquare, 
  ShieldCheck, 
  Rocket, 
  Info,
  Scale,
  BookOpen,
  EyeOff,
  AlertCircle
} from "lucide-react";

// Professional Section Divider using Shadcn border colors
const SectionDivider = () => (
  <div className="relative py-16 md:py-24">
    <div className="absolute inset-0 flex items-center" aria-hidden="true">
      <div className="w-full border-t border-border"></div>
    </div>
  </div>
);

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-6xl">
                
                {/* --- Header Section --- */}
                <header className="text-center mb-10 md:mb-4">
                    <Badge variant="outline" className="mb-4 px-4 py-1 text-primary border-primary/20 bg-primary/5 rounded-full uppercase tracking-widest text-[10px] font-bold">
                        Our Mission & Story
                    </Badge>
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                        Powering Collaborative <br /> 
                        <span className="text-primary">University Learning</span>
                    </h1>
                </header>

                <SectionDivider />

                {/* --- Section 1: Our Core Mission (Motto) --- */}
                <section className="mb-14">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                        <div className="mb-10 lg:mb-0 relative aspect-video w-full rounded-2xl shadow-2xl overflow-hidden border border-border group">
                            <Image
                                src="/images/shared-success.jpg"
                                alt="Students finding shared success"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-primary/5"></div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold flex items-center gap-3 text-primary">
                                <Zap className="w-8 h-8" /> Our Central Motto
                            </h2>
                            <p className="text-xl leading-relaxed text-muted-foreground">
                                <strong className="text-foreground">Empowering Every Student:</strong> Our platform was built on the simple, powerful motto that <strong className="text-foreground">no student should struggle alone</strong> due to a lack of resources.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We facilitate peer-to-peer resource sharing—notes, guides, and past papers—to create a unified, easily accessible study ecosystem. We believe that when students succeed collectively, the entire community benefits.
                            </p>
                        </div>
                    </div>
                </section>

                <SectionDivider />

                {/* --- Section 2: Future Vision & Discussion Forum --- */}
                <section className="mb-20">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                        <div className="space-y-6 lg:order-2">
                            <h2 className="text-3xl font-bold flex items-center gap-3 text-primary">
                                <Rocket className="w-8 h-8" /> Our Future Vision
                            </h2>
                            <p className="text-xl leading-relaxed text-muted-foreground">
                                Our vision is to evolve from a notes repository into a <strong className="text-foreground">comprehensive academic hub</strong>. This means expanding beyond documents to include video lectures and organized study groups.
                            </p>
                            <Card className="shadow-lg border-l-4 border-l-primary bg-secondary/30 border-y-border border-r-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <MessageSquare className="w-5 h-5 text-primary" /> Next Step: Discussion Forums
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground text-base pt-2">
                                        We plan to incorporate a healthy, moderated discussion forum. This will allow students to ask complex questions, get real-time clarification, and engage in constructive academic debate.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>

                        <div className="mt-10 lg:mt-0 relative aspect-video w-full rounded-2xl shadow-2xl overflow-hidden lg:order-1 border border-border">
                            <Image
                                src="/images/future-vision.jpg"
                                alt="Illustration of a growing, connected community"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-primary/5"></div>
                        </div>
                    </div>
                </section>

                <SectionDivider />

                {/* --- Section 3: Technical Constraints & Community Commitment --- */}
                <section className="mb-20">
                    <Card className="border-border shadow-xl overflow-hidden">
                        <CardHeader className="bg-secondary/20 border-b">
                            <CardTitle className="text-2xl italic flex items-center gap-2">
                                <Scale className="w-6 h-6 text-primary" /> A Note on Technical Constraints & Ethics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
                                
                                {/* Technical Constraints */}
                                <div className="p-8 md:w-1/3 space-y-4 bg-muted/30">
                                    <h3 className="font-bold flex items-center gap-2 text-primary">
                                        <Info className="w-4 h-4" /> Relying on Free Services
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Currently, this platform operates using <strong className="text-foreground">free-tier services</strong> for hosting, databases, and storage. While this keeps the platform 100% accessible, it means we face limitations on speed and bandwidth.
                                    </p>
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border">
                                        <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                                        <p className="text-[11px] text-muted-foreground font-medium">Load times may vary during peak exam seasons.</p>
                                    </div>
                                </div>

                                {/* Ethical Conduct */}
                                <div className="p-8 md:w-2/3 space-y-6">
                                    <h3 className="font-bold text-lg text-primary">Your Essential Role: Ethical Conduct</h3>
                                    <p className="text-sm text-muted-foreground">
                                        To maintain this resource for everyone, we kindly but firmly ask all users to uphold a professional and ethical academic environment:
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <ShieldCheck className="w-4 h-4 text-primary" /> Respect Copyright
                                            </div>
                                            <p className="text-[12px] text-muted-foreground">Only share materials you have created or have the right to distribute.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <BookOpen className="w-4 h-4 text-primary" /> Academic Honesty
                                            </div>
                                            <p className="text-[12px] text-muted-foreground">Use resources to supplement your learning, never for plagiarism.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <Users className="w-4 h-4 text-primary" /> Professionalism
                                            </div>
                                            <p className="text-[12px] text-muted-foreground">Keep all interactions academic, respectful, and constructive.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <EyeOff className="w-4 h-4 text-primary" /> Data Privacy
                                            </div>
                                            <p className="text-[12px] text-muted-foreground">Avoid sharing sensitive personal information in your documents.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <div className="bg-primary/5 p-4 text-center border-t border-border">
                            <p className="text-sm font-bold">
                                Your responsible usage is what allows us to keep this service free and available to the university community.
                            </p>
                        </div>
                    </Card>
                </section>

                {/* Final CTA */}
                <div className="text-center pt-10">
                    <Button size="lg" asChild className="px-10 py-6 text-lg rounded-full group shadow-xl shadow-primary/20">
                        <Link href="/signup">
                            Join Our Community Today 
                            <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

            </div>
        </div>
    );
}