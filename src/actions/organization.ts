"use server";

import prisma from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const getOrganization = async (slug: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("user not exist");

  const organization = await (
    await clerkClient()
  ).organizations.getOrganization({
    slug,
  });
  if (!organization) throw new Error("Organization not found");

  const { data: membership } = await (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: organization.id,
  });

  const useMembership = membership.find(
    (member) => member?.publicUserData?.userId === userId
  );

  if (!useMembership) throw new Error("Unauthorized");

  return organization;
};

export async function getOrganizationUsers(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const organizationMemberships = await (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const userIds = organizationMemberships.data
    .map((membership) => membership?.publicUserData?.userId)
    .filter((userId): userId is string => userId !== undefined); // Filter out undefined values

  const users = await prisma.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  return users;
}
