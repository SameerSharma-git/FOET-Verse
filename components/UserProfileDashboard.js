import React from 'react';
// Assuming these are imported from your shadcn/ui components folder
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from 'next-themes';


const UserProfileDashboard = ({ user }) => {
  const { theme } = useTheme();

  // Simple check in case user data is loading or missing
  if (!user) {
    return <div className="p-4 flex items-center justify-center text-gray-500">Loading user data...</div>;
  }

  // Helper to get initials for the Avatar Fallback
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Helper function to format count for arrays
  const formatCount = (arr) => (arr ? arr.length : 0);

  // Data for the 'Activity Metrics' Card
  const activityMetrics = [
    { label: 'Uploads', count: formatCount(user.uploads), variant: 'default' },
    { label: 'Downloads', count: formatCount(user.downloads), variant: 'secondary' },
    { label: 'Following', count: formatCount(user.following), variant: 'success' }, // Assuming you have a custom 'success' badge or using a primary/default one
    { label: 'Followers', count: formatCount(user.followers), variant: 'destructive' },
  ];

  return (
    <div className="p-6 md:py-8 md:px-14 space-y-8 container mx-auto">
      
      {/* -------------------- Main Profile Card -------------------- */}
      <Card className={`shadow-2xl border-t-4 ${ theme==="dark"? "border-white": "border-black"}`}>
        <CardHeader className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-6">
          
          {/* Avatar and Picture */}
          <Avatar className={`w-24 h-24 border-4 ${ theme==="dark"? "border-white": "border-black"} shadow-lg`}>
            <AvatarImage src={user.profilePicture} alt={`${user.name}'s profile`} />
            <AvatarFallback className="text-xl">
              {getInitials(user.name || 'NN')}
            </AvatarFallback>
          </Avatar>
          
          {/* Name and Email */}
          <div className="flex-1 text-center md:text-left">
            <CardTitle className="text-3xl font-extrabold">
              {user.name}
            </CardTitle>
            <p className="text-md font-medium mt-1">
              {user.email}
            </p>
          </div>
          
          {/* Status Badge (Example) */}
          <Badge variant="outline" className="text-sm font-semibold px-4 py-1.5 text-green-700 border-green-300">
            Active Member
          </Badge>
        </CardHeader>
        
        <Separator />

        {/* User Details */}
        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* Detail Item */}
          <div className="flex flex-col space-y-1 items-center">
            <span className="text-xs font-medium uppercase">Course</span>
            <span className="text-base font-semibold">{user.course}</span>
          </div>
          
          {/* Detail Item */}
          <div className="flex flex-col space-y-1 items-center">
            <span className="text-xs font-medium uppercase">Branch</span>
            <span className="text-base font-semibold">{user.branch || 'N/A'}</span>
          </div>

          {/* Detail Item */}
          <div className="flex flex-col space-y-1 items-center">
            <span className="text-xs font-medium uppercase">Year</span>
            <span className="text-base font-semibold">{user.year}</span>
          </div>
          
          {/* Detail Item */}
          <div className="flex flex-col space-y-1 items-center">
            <span className="text-xs font-medium uppercase">Semester</span>
            <span className="text-base font-semibold">{user.semester}</span>
          </div>

        </CardContent>
      </Card>

      {/* -------------------- Activity Metrics Card -------------------- */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Activity Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activityMetrics.map((metric) => (
              <div key={metric.label} className="p-4 rounded-lg text-center border border-gray-200">
                <p className="text-3xl font-bold mb-1">{metric.count}</p>
                <p className="text-sm font-medium">{metric.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default UserProfileDashboard;