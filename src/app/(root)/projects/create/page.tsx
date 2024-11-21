"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import OrgSwitcher from "@/components/OrgSwitcher";

import useFetch from "@/hooks/useFetch";
import { createProject } from "@/actions/createProject";
import { projectSchema } from "@/lib/validation";
import { Textarea } from "@/components/ui/textarea";

type Project = {
  id: string;
  name: string;
  key: string;
  description: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function CreateProjectPage() {
  const router = useRouter();
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  type FormType = z.infer<typeof projectSchema>;

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const {
    loading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch<Project, [{ name: string; key: string; description?: string }]>({
    cb: createProject,
  });

  const form = useForm<FormType>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: FormType) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }

    createProjectFn(data);
  };

  useEffect(() => {
    if (project) router.push(`/projects/${project.id}`);
  }, [loading, router, project]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create New Project
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full md:w-2/3 mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-950"
                    placeholder="Enter your project name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project key</FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-950"
                    placeholder="Project key (Ex: RCYT)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-slate-950"
                    placeholder="Project Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-red-500">Failed to create project</p>}
          <Button disabled={loading} type="submit" className=" w-full">
            {loading ? "Creating Project..." : "Create Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
