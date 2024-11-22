"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { SprintStatus } from "@prisma/client";

type TData = {
  name: string;
  startDate: Date;
  endDate: Date;
};

export const createSprint = async (projectId: string, data: TData) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project || project.organizationId !== orgId)
    throw new Error("Project not found");

  const sprint = await prisma.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      projectId: projectId,
      status: "PLANNED",
    },
  });

  if (!sprint) throw new Error("Sprint not created");

  return sprint;
};

export const updateSprintStatus = async (
  sprintId: string,
  status: SprintStatus
) => {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) throw new Error("User not authenticated");

  try {
    const sprint = await prisma.sprint.findUnique({
      where: {
        id: sprintId,
      },
      include: { project: true },
    });

    if (!sprint) throw new Error("Sprint not found");
    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }
    if (orgRole !== "org:admin")
      throw new Error("Only admin can make this change");

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (status === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Can not start sprint outside of its date range");
    }
    if (status === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Sprint already completed");
    }

    const project = await prisma.project.findUnique({
      where: {
        id: sprint.projectId,
      },
    });

    if (!project || project.organizationId !== orgId)
      throw new Error("Project not found");

    const updatedSprint = await prisma.sprint.update({
      where: {
        id: sprintId,
      },
      data: {
        status: status,
      },
    });

    if (!updatedSprint) throw new Error("Sprint not updated");

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    throw new Error(error as string);
  }
};
