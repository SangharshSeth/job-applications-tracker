"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Briefcase, Globe, DollarSign, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import "@fontsource-variable/dm-sans";
import { createApplication } from "../apis/applications";
import { Tables } from "@/types/supabase";
import React from "react";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  applicationDate: z.date(),
  jobPostingUrl: z.string().url("Invalid URL").optional(),
  jobLocation: z.string(),
  salary: z.string().min(1, "Salary is required"),
  jobPlatform: z.string().optional(),
  applicationStage: z.enum(["applied", "interviewing", "offer", "rejected"]),
});

type FormValues = z.infer<typeof formSchema>;
export type Application = FormValues;

type JobApplicationFormProps = {
  onClose: () => void;
};

export default function JobApplicationForm({ onClose }: JobApplicationFormProps) {
  const [date, setDate] = React.useState<Date>()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      applicationDate: new Date(),
      jobPostingUrl: "",
      jobLocation: "",
      salary: "",
      jobPlatform: "",
      applicationStage: "applied",
    },
  });

  async function onSubmit(data: FormValues) {
    const application_object: Omit<Tables<'applications'>, 'created_at' | 'id' | 'user_id'> = {
      applied_on: data.applicationDate.toISOString(),
      company_name: data.companyName,
      job_platform: data.jobPlatform || "",
      job_posting_url: data.jobPostingUrl || "",
      job_title: data.jobTitle,
      location: data.jobLocation,
      salary: data.salary,
      status: data.applicationStage
    };

    try {
      const result = await createApplication(application_object);
      if (result.length > 0) {
        console.log("Success", result);
        onClose();
      }
    } catch (error) {
      console.log(error);
    } 
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <h2 className="text-xl font-bold mb-4">New Job Application</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-right">Company Name</label>
          <input
            placeholder="Enter company name"
            className="flex-grow border p-2 rounded"
            {...form.register("companyName")}
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-right">Job Title</label>
          <input
            placeholder="Enter job title"
            className="flex-grow border p-2 rounded"
            {...form.register("jobTitle")}
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-right">Application Date</label>
          <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-right">Application Stage</label>
          <select
            className="flex-grow border p-2 rounded"
            {...form.register("applicationStage")}
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Got Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-right">Job Location</label>
          <input
            placeholder="Enter job location"
            className="flex-grow border p-2 rounded"
            {...form.register("jobLocation")}
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-right">Salary</label>
          <input
            placeholder="Enter salary (e.g., $75,000)"
            className="flex-grow border p-2 rounded"
            {...form.register("salary")}
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-right">Job Platform</label>
          <input
            placeholder="Where did you find about the job"
            className="flex-grow border p-2 rounded"
            {...form.register("jobPlatform")}
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-right">Job Posting URL</label>
          <input
            type="url"
            placeholder="https://..."
            className="flex-grow border p-2 rounded"
            {...form.register("jobPostingUrl")}
          />
        </div>

        <div className="flex justify-center">
          <button type="submit" className="text-white bg-slate-950 w-full max-w-md p-2 rounded">
            Add Application
          </button>
        </div>
      </form>
    </motion.div>
  );
}