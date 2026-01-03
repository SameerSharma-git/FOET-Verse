import React from 'react';
import { 
  FileUp, 
  Download, 
  Users, 
  UserPlus, 
  GraduationCap, 
  BookOpen, 
  CalendarDays, 
  Hash 
} from 'lucide-react';

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import UserProfileSkeleton from './skeletons/UserProfileSkeleton';

const UserProfileDashboard = ({ user }) => {

  // --- Loading Skeleton ---
  if (!user) return <UserProfileSkeleton />;

  // --- Helpers ---
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'UN';
  };

  const formatCount = (arr) => (arr ? arr.length : 0);

  // Configuration for Activity Metrics to make mapping cleaner
  const metricsConfig = [
    { 
      label: 'Uploads', 
      count: formatCount(user.uploads), 
      icon: FileUp, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10" 
    },
    { 
      label: 'Downloads', 
      count: formatCount(user.downloads), 
      icon: Download, 
      color: "text-green-500", 
      bg: "bg-green-500/10" 
    },
    { 
      label: 'Following', 
      count: formatCount(user.following), 
      icon: UserPlus, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10" 
    },
    { 
      label: 'Followers', 
      count: formatCount(user.followers), 
      icon: Users, 
      color: "text-orange-500", 
      bg: "bg-orange-500/10" 
    },
  ];

  // Configuration for Academic Details
  const academicDetails = [
    { label: "Course", value: user.course, icon: GraduationCap },
    { label: "Branch", value: user.branch || 'N/A', icon: BookOpen },
    { label: "Year", value: user.year, icon: CalendarDays },
    { label: "Semester", value: user.semester, icon: Hash },
  ];

  return (
    <div className="container max-w-5xl mx-auto p-4 md:p-10 space-y-10">
      
      {/* -------------------- Header Section -------------------- */}
      <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
        
        {/* Avatar with Ring */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
          <Avatar className="relative w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl">
            <AvatarImage src={user.profilePicture} alt={user.name} className="object-cover" />
            <AvatarFallback className="text-3xl font-bold bg-muted text-muted-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Text Info */}
        <div className="flex-1 text-center md:text-left space-y-2 mb-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {user.name}
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            {user.email}
          </p>
          
          <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
            <Badge 
              variant={user.role === 'admin' ? "destructive" : "secondary"} 
              className="px-3 py-1 text-sm capitalize"
            >
              {user.role === "admin" ? "Admin" : "Student Member"}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* -------------------- Academic Details Grid -------------------- */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-foreground/80">Academic Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {academicDetails.map((item, index) => (
            <Card key={index} className="border-none shadow-sm bg-muted/40 hover:bg-muted/60 transition-colors">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <item.icon className="w-5 h-5 text-primary/70 mb-1" />
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  {item.label}
                </span>
                <span className="text-lg font-bold text-foreground">
                  {item.value}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* -------------------- Activity Metrics -------------------- */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-foreground/80">Platform Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsConfig.map((metric) => (
            <Card key={metric.label} className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <div className={`p-2 rounded-full ${metric.bg}`}>
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  lifetime stats
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
};

export default UserProfileDashboard;