import React, { useState, useMemo, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Tables } from '@/types/supabase';
import { fetchApplications } from '@/apis/applications';

// Enum for job application statuses
const JobStatus = {
  APPLIED: 'applied',
  INTERVIEWING: 'interviewing',
  REJECTED: 'rejected',
  OFFER: 'offer'
};

// Function to render status badges with different colors
const getStatusBadge = (status: string | null) => {
  switch(status) {
    case JobStatus.APPLIED:
      return <Badge variant="secondary">Applied</Badge>;
    case JobStatus.INTERVIEWING:
      return <Badge variant="outline">Interviewing</Badge>;
    case JobStatus.REJECTED:
      return <Badge variant="destructive">Rejected</Badge>;
    case JobStatus.OFFER:
      return <Badge variant="default">Offer</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const JobTrackingTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [jobApplications, setJobApplications] = useState<Tables<"applications">[]>()

  const fetchAllApplications = async () => {
    try {
      const data = await fetchApplications()
      setJobApplications(data)
    } catch (error) {
      console.error(`Error in fetching all applications`)
      console.log(error)
      return;
    }
  }

  useEffect(() => {
    fetchAllApplications()
  })


  // Filtering logic
  const filteredApplications = useMemo(() => {
    return jobApplications?.filter(job => 
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobApplications, searchTerm]);

  // Pagination logic
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage]);

  // Total pages calculation
  const totalPages = Math.ceil((filteredApplications?.length || 0) / itemsPerPage);

  return (
    <div className="p-4 w-full  mx-0">
      <h2 className="text-2xl font-bold mb-4">Job Application Tracking</h2>
      
      {/* Search Input */}
      <div className="mb-4">
        <Input 
          type="text" 
          placeholder="Search by company, position, or status..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
          className="w-full"
        />
      </div>

      {/* Table with Border */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial No</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications?.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.company_name}</TableCell>
                <TableCell>{job.job_title}</TableCell>
                <TableCell>{job.salary}</TableCell>
                <TableCell>
                  {getStatusBadge(job.status)}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  />
                ) : (
                  <span className="disabled">Previous</span> // Render a disabled state
                )}
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                {currentPage < totalPages ? (
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  />
                ) : (
                  <span className="disabled">Next</span> // Render a disabled state
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default JobTrackingTable;