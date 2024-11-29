import { useEffect, useState } from "react";
import { useQuery } from "react-query"; // Import useQuery from react-query
import {
  CheckCircle,
  Clock,
  Plus,
  Send,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import JobApplicationForm from "./TrackNewApplication";
import supabase from "@/utils/supabase";
import { fetchApplications } from "@/apis/applications";
import { motion } from "framer-motion"; // Import motion from framer-motion
import MetricCard from "./metric-card";
import JobTrackingTable from "./ApplicationsTable";
import RecentApplications from "./ApplicationsCard";

// interface IApplication {
//   id: number;
//   applied_on: string;
//   company_name: string;
//   created_at: string;
//   job_platform: string;
//   job_posting_url: string;
//   job_title: string;
//   location: string;
//   method: string;
//   salary: number;
//   user_id: string;
//   status: string;
// }

interface IApplicationByStatus {
  applied: string;
  interviewing: string;
  rejected: string;
  offer: string;
}

interface StatusConfig {
  icon: JSX.Element;
  title: string;
  iconColor: string;
  value: string | undefined
}

const JobTrackerTimeLine = () => {
  const [isAddJobSheetOpen, setIsAddJobSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [applicationByStatus, setApplicationByStatus] = useState<
    IApplicationByStatus
  >();

  // Fetch total applications using React Query
  const {
    data: totalApplications,
    refetch: refetchTotalApplications,
  } = useQuery(
    "totalApplications",
    async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        const { count, error } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (error) {
          throw new Error("Error fetching total applications");
        }

        return count || 0;
      } else {
        throw new Error("User ID is undefined");
      }
    },
  );

  // Fetch recent applications using React Query
  const {
    data: recentApplications = [],
    isLoading: isLoadingRecent,
    refetch: refetchRecentApplications,
  } = useQuery(
    ["recentApplications", 4],
    () => fetchApplications(4),
  );

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
        },
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(applicationsChanges);
    };
  }, []);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      const { data, error } = await supabase.rpc("get_status_counts");
      if (error) {
        console.log(`Error supabase postgres call`);
      } else setApplicationByStatus(data);
    };
    fetchStatusCounts();
  }, []);

  const statusConfigs: Record<string, StatusConfig> = {
    Total: {
      icon: <Clock className="h-6 w-6" />,
      title: "Total",
      iconColor: "text-blue-600",
      value: totalApplications?.toString(),
    },
    applied: {
      icon: <Clock className="h-6 w-6" />,
      title: "Applied",
      iconColor: "text-green-600",
      value: applicationByStatus?.applied || "0",
    },
    rejected: {
      icon: <XCircle className="h-6 w-6" />,
      title: "Rejected",
      iconColor: "text-red-600",
      value: applicationByStatus?.rejected || "0",
    },
    interviewing: {
      icon: <Send className="h-6 w-6" />,
      title: "Interviews",
      iconColor: "text-purple-600",
      value: applicationByStatus?.interviewing || "0",
    },
    offer: {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Offers",
      iconColor: "text-emerald-600",
      value: applicationByStatus?.offer || "0",
    },
  };

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
        <Sheet open={isAddJobSheetOpen} onOpenChange={setIsAddJobSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" /> Add Application
            </Button>
          </SheetTrigger>
          <SheetContent style={{ maxWidth: '30vw' }}>
            <JobApplicationForm onClose={() => setIsAddJobSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </motion.div>



      {/* Analytics Cards */}
      <motion.div
        className="grid grid-cols-5 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Other analytics cards... */}
        {Object.keys(statusConfigs).map((status) => (
          <MetricCard
            key={status}
            title={statusConfigs[status].title}
            value={statusConfigs[status].value}
            icon={statusConfigs[status].icon}
            iconColor={statusConfigs[status].iconColor}
          />
        ))}
      </motion.div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >

            <div className="flex space-x-12 overflow-x-auto">
              {isLoadingRecent
                ? (
                  <div className="bg-gray-200 h-16 w-full rounded-md animate-pulse" />
                )
                : (
                  <RecentApplications applications={recentApplications} />
                )}
            </div>
      </motion.div>

      <JobTrackingTable />
    </div>
  );
};

export default JobTrackerTimeLine;
