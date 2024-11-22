"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { $Enums } from "@prisma/client";

type TData = {
  status: $Enums.IssueStatus;
  sprintId: string;
  title: string;
  assigneeId: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  description?: string | undefined;
};

export const createIssue = async (projectId: string, data: TData) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");

  const lastIssue = await prisma.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await prisma.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      order: newOrder,
      projectId,
      assigneeId: data.assigneeId,
      sprintId: data.sprintId,
      reporterId: user.id,
    },
    include: {
      reporter: true,
      assignee: true,
    },
  });
  if (!issue) throw new Error("Issue not created");

  return issue;
};
