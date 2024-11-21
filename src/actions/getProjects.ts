"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export const getProjects = async (orgId: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  const projects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
};
