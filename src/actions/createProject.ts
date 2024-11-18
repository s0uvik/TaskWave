"use server";

import prisma from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";

type Data = { key: string; name: string; description?: string | undefined };

export const createProject = async (formData: Data) => {
  const { userId, orgId } = await auth();

  if (!userId) throw new Error("User not authenticated");
  if (!orgId) throw new Error("Organization not found");

  const { data: membership } = await (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const userMembership = membership.find(
    (member) => member?.publicUserData?.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only admins can create projects");
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: formData.name,
        key: formData.key,
        description: formData.description || null, // Handle optional fields
        organizationId: orgId,
      },
    });

    return project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
};
