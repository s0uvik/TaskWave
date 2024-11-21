"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import useFetch from "@/hooks/useFetch";
import { deleteProject } from "@/actions/deleteProject";

const DeleteProject = ({ projectId }: { projectId: string }) => {
  const { membership } = useOrganization();
  const router = useRouter();

  const isAdmin = membership?.role === "org:admin";

  const {
    data,
    loading,
    error,
    fn: deleteProjectFn,
  } = useFetch({ cb: deleteProject });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectFn(projectId);
    }
  };

  if (error) toast.error(error.message);

  useEffect(() => {
    if (data?.success) {
      toast.success("Project deleted successfully");
      router.refresh();
    }
  }, [data, router]);

  if (!isAdmin) return null;
  return (
    <Button disabled={loading} variant="ghost" onClick={handleDelete}>
      {" "}
      <Trash />
    </Button>
  );
};

export default DeleteProject;
