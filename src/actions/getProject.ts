"use server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const getProject = async (projectId: string) => {
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
    include: {
      sprints: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) return null;
  if (project.organizationId !== orgId) return null;

  return project;
};
