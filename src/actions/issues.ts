"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { $Enums, IssuePriority, IssueStatus } from "@prisma/client";

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

export const getIssuesForSprint = async (sprintId: string) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const issues = await prisma.issue.findMany({
    where: { sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
};

export const updateIssueOrder = async (
  updatedIssues: { status: IssueStatus; order: number; id: string }[]
) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Start a transaction
  await prisma.$transaction(async (prisma) => {
    // Update each issue
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
};

export const deleteIssue = async (issueId: string) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (
    issue.reporterId !== user.id &&
    !issue.project.adminIds.includes(user.id)
  ) {
    throw new Error("You don't have permission to delete this issue");
  }

  await prisma.issue.delete({ where: { id: issueId } });

  return { success: true };
};

export const updateIssue = async (
  issueId: string,
  data: { status: IssueStatus; priority: IssuePriority }
) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error updating issue: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while updating the issue.");
    }
  }
};
