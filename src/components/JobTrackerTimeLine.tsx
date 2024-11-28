import { useEffect, useState } from "react";
import { useQuery } from "react-query"; // Import useQuery from react-query
import {
  Briefcase,
  Plus,
  CheckCircle,
  XCircle,
  Send,
  Clock,
  Search,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import JobApplicationForm from "./TrackNewApplication";
import supabase from "@/utils/supabase";
import { fetchApplications } from "@/apis/applications";
import { motion } from "framer-motion"; // Import motion from framer-motion

interface IApplication {
  id: number;
  applied_on: string;
  company_name: string;
  created_at: string;
  job_platform: string;
  job_posting_url: string;
  job_title: string;
  location: string;
  method: string;
  salary: number;
  user_id: string;
  status: string;
}

const JobTrackerTimeLine = () => {
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch total applications using React Query
  const { data: totalApplications, isLoading: isLoadingTotal, refetch: refetchTotalApplications } = useQuery(
    "totalApplications",
    async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { count, error } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);

      if (error) {
        throw new Error("Error fetching total applications");
      }

      return count || 0;
    }
  );

  // Fetch recent applications using React Query
  const { data: recentApplications = [], isLoading: isLoadingRecent, refetch: refetchRecentApplications } = useQuery(
    ["recentApplications", 3],
    () => fetchApplications(3)
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "interviewing":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "offer":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const applicationsChanges = supabase
      .channel("application-change")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "applications",
        },
        (payload) => {
          // Different handling based on the event type
          switch (payload.eventType) {
            case "INSERT":
              refetchTotalApplications(); // Refetch total applications on insert
              refetchRecentApplications(); // Refetch recent applications on insert
              break;
            case "DELETE":
              refetchTotalApplications(); // Refetch total applications on delete
              refetchRecentApplications(); // Refetch recent applications on delete
              break;
            case "UPDATE":
              // Optional: Add specific update logic if needed
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(applicationsChanges);
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-700">
          Welcome, <span className="text-blue-600">Sangharsh</span>
        </h1>
        <Dialog open={isAddJobDialogOpen} onOpenChange={setIsAddJobDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" /> Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <JobApplicationForm onClose={() => setIsAddJobDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search applications by company or position"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </motion.div>

      {/* Analytics Cards */}
      <motion.div 
        className="grid grid-cols-5 gap-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">
              {totalApplications}
            </div>
          </CardContent>
        </Card>

        {/* Other analytics cards... */}
        <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">
              {totalApplications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4  space-y-0 pb-2">
            <Clock className="h-6 w-6 text-green-600" />
            <CardTitle className="text-sm font-medium text-gray-700">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">
              {jobStats.pendingApplications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <XCircle className="h-6 w-6 text-red-600" />
            <CardTitle className="text-sm font-medium text-gray-700">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">
              {jobStats.rejectedApplications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <Send className="h-6 w-6 text-purple-600" />
            <CardTitle className="text-sm font-medium text-gray-700">
              Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">
              {jobStats.interviewInvites}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            <CardTitle className="text-sm font-medium text-gray-700">
              Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">
              {jobStats.offerReceived}
            </div>
          </CardContent>
        </Card>
      </div>
      </motion.div>

      {/* Recent Applications */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingRecent ? (
                <div className="bg-gray-200 h-16 w-full rounded-md animate-pulse" />
              ) : (
                recentApplications.map((application) => (
                  <motion.div 
                    key={application.id}
                    className="flex justify-between items-center border-b pb-3 last:border-b-0"
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={`https://cdn.brandfetch.io/${application.company_name}.com/w/512/h/512?c=1idpEo1BD5Av4hqHmjD`}
                        height={64}
                        width={64}
                        alt={application.company_name}
                        className="rounded-lg"
                      />
                      <div>
                        <div className="font-medium text-gray-700">
                          {application.company_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.job_title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {application.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge
                        variant={`outline`}
                        className={`mt-1 ${getStatusBadgeColor(
                          application?.status ?? ""
                        )} hover:${getStatusBadgeColor(application.status ?? "")}`}
                      >
                        {application.status}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        Applied on {application.applied_on}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default JobTrackerTimeLine;
