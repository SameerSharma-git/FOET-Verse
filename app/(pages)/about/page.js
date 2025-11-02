import Image from "next/image";
import Link from "next/link";

// Assuming these components are available in your project
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight, Users, Zap, MessageSquare } from "lucide-react";

// A simple component for visual separation
const SectionDivider = () => <div className="h-px w-full bg-gray-200 dark:bg-gray-800 my-16 md:my-24"></div>;

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-7xl">

            {/* Header Section - Target for GSAP */}
            <header className="text-center mb-16 md:mb-24">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                    Our Mission & Story
                </p>
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                    Powering Collaborative University Learning
                </h1>
            </header>

            <SectionDivider />

            {/* --- Section 1: Our Core Mission (Motto) --- */}
            <section className="mb-20 **opacity-0**">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                    {/* Image */}
                    <div className="mb-10 lg:mb-0 relative h-80 w-full rounded-xl shadow-2xl overflow-hidden">
                        <Image
                            src="/images/shared-success.jpg"
                            alt="Students finding shared success"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-blue-900/10"></div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Zap className="w-8 h-8" /> Our Central Motto
                        </h2>
                        <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                            **Empowering Every Student:** Our platform was built on the simple, powerful motto that **no student should struggle alone** due to a lack of resources. We facilitate peer-to-peer resource sharing—notes, guides, and past papers—to create a unified, easily accessible study ecosystem.
                        </p>
                        <p className="text-lg text-gray-900 dark:text-gray-100">
                            We believe that when students succeed collectively, the entire academic community benefits. It's about turning individual knowledge into communal wisdom.
                        </p>
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* --- Section 2: Future Vision & Discussion Forum Plan --- */}
            <section className="mb-20 **opacity-0**">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                    {/* Text Content */}
                    <div className="space-y-6 lg:order-2">
                        <h2 className="text-3xl font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Users className="w-8 h-8" /> Our Future Vision
                        </h2>
                        <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                            Our vision is to evolve from a notes repository into a **comprehensive academic hub**. This means expanding beyond documents to include video lectures, interactive quizzes, and organized study groups.
                        </p>
                        <Card className="shadow-lg border-l-4 border-blue-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <MessageSquare className="w-5 h-5" /> Next Step: The Discussion Forum
                                </CardTitle>
                                <CardDescription>
                                    We plan to incorporate a **healthy, moderated discussion forum**. This will allow students to ask complex questions, get real-time clarification, and engage in constructive academic debate, fostering deeper understanding and true collaboration.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Image */}
                    <div className="mt-10 lg:mt-0 relative h-80 w-full rounded-xl shadow-2xl overflow-hidden lg:order-1">
                        <Image
                            src="/images/future-vision.jpg"
                            alt="Illustration of a growing, connected community"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-green-900/10"></div>
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* --- Section 3: Technical Constraints & Community Commitment --- */}
            <section className="mb-20 **opacity-0**">
                <Card className="bg-accent shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl italic flex items-center gap-2">
                            A Note on Technical Constraints & Ethics :-
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                            <h3 className="font-semibold mb-2">Relying on Free Services</h3>
                            <p>
                                Currently, this platform operates using **free-tier services** for hosting, databases, and storage. While this keeps the platform accessible, it means we face limitations on speed, file size, and bandwidth. You might occasionally experience **slower load times** or **storage limits**.
                            </p>
                        </div>

                        <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                            <h3 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Your Essential Role: Ethical Conduct</h3>
                            <p>
                                To maintain this resource for everyone, we kindly but firmly ask all users to uphold a **professional and ethical environment**:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 pl-4">
                                <li>**Respect Copyright:** Only share materials you have the right to distribute.</li>
                                <li>**Be Professional:** Keep all interactions academic, respectful, and constructive.</li>
                                <li>**No Unauthorized Content:** Avoid sharing personal, sensitive, or harmful content.</li>
                            </ul>
                            <p className="mt-4 font-bold">
                                Your responsible usage is what allows us to keep this service **free and available** to the university community.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Final CTA */}
            <div className="text-center pt-10">
                <Button size="lg" asChild className="px-10 py-6 text-lg group">
                    <Link href="/signup" >
                        Join Our Community Today <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>

        </div>
    );
}