import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin } from 'lucide-react'

interface Application {
    applied_on: string;
    company_name: string;
    created_at: string;
    id: number;
    job_platform: string;
    job_posting_url: string;
    job_title: string;
    location: string;
    method: string;
    salary: number;
    status: string | null;
    user_id: string;
}

interface RecentApplicationsProps {
    applications: Application[];
}

const statusColors = {
    rejected: "bg-red-100 text-red-800",
    applied: "bg-blue-100 text-blue-800",
    interviewing: "bg-yellow-100 text-yellow-800",
    offer: "bg-green-100 text-green-800"
}

function ApplicationCard({ application }: { application: Application }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-lg">{application.company_name}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {application.job_title}
                        </p>
                    </div>
                    <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                        {application.status ? `${application.status.charAt(0).toLocaleUpperCase()}${application.status.slice(1)}` : ''}
                    </Badge>
                </div>
                <p className="text-sm text-gray-500 flex items-center mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {application.location}
                </p>
                <p className="text-xs text-gray-400 mt-2">Applied on {application.applied_on}</p>
            </CardContent>
        </Card>
    )
}

export default function RecentApplications({ applications }: RecentApplicationsProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 grid-cols-2">
                    {applications.map((app, index) => (
                        <ApplicationCard key={index} application={app} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

