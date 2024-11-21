"use server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function deleteProject(projectId: string) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete projects");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}
