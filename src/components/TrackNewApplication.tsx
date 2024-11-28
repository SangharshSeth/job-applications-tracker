"use client";

import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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
import { CalendarIcon, Briefcase, Globe, DollarSign, Send, Plus, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import "@fontsource-variable/dm-sans"
import {createApplication} from "../apis/applications"
import { Tables } from "@/types/supabase";
import { useState } from "react";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  applicationDate: z.date(),
  jobPostingUrl: z.string().url("Invalid URL"),
  applicationMethod: z.enum(["direct", "recruiter", "referral"]),
  jobLocation: z.string(),
  salary: z.number().min(1, "Salary is required"),
  currency: z.string().min(1, "Currency is required"),
  jobPlatform: z.string(),
  applicationStage: z.enum(["applied", "interviewing", "offer", "rejected"]),
});

type FormValues = z.infer<typeof formSchema>;
export type Application = FormValues;

type JobApplicationFormProps = {
  onClose: () => void;
};

export default function JobApplicationForm({ onClose }: JobApplicationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      applicationDate: new Date(),
      jobPostingUrl: "",
      applicationMethod: "direct",
      jobLocation: "",
      salary: undefined,
      currency: "USD",
      applicationStage: "applied",
    },
  });
  const [toastData, setToastData] = useState("")

  async function onSubmit(data: FormValues) {
    console.log(data)
     const application_object: Omit<Tables<'applications'>, 'created_at' | 'id' | 'user_id'> = {
      applied_on: data.applicationDate.toISOString(),
      company_name: data.companyName,
      job_platform: data.jobPlatform,
      job_posting_url: data.jobPostingUrl,
      job_title: data.jobTitle,
      location: data.jobLocation,
      method: data.applicationMethod,
      salary: data.salary,
      status: data.applicationStage
    }
    try {
      const data = await createApplication(application_object)
      if(data.length > 0){
        console.log("Success", data)
        onClose()
      }
    } catch (error) {
      console.log(error)
    } 
  }

  return (
    <div className="flex justify-center items-center w-full" style={{fontFamily: "DM Sans Variable"}}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>New Job Application</CardTitle>
          <CardDescription>
            Enter the details of your job application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter company name"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="applicationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Application Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationMethod"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <FormLabel>Application Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select application method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="direct">Direct</SelectItem>
                          <SelectItem value="recruiter">Recruiter</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jobLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder=""
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Stage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select application stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="interviewing">
                            Interviewing
                          </SelectItem>
                          <SelectItem value="offer">Got Offer</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Enter salary"
                            className="pl-8"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jobPlatform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Platform</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Where did you found about the job"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobPostingUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Posting URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="url"
                            placeholder="https://..."
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="text-white bg-gray-700 w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Application
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
