import { currentUser } from "@clerk/nextjs/server";
import prisma from "./db";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  try {
    const loggedInUser = await prisma?.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    } else {
      const name = `${user.firstName} ${user.lastName}`;
      const newUser = await prisma?.user.create({
        data: {
          clerkUserId: user.id,
          name,
          email: user.emailAddresses[0].emailAddress,
          imageUrl: user.imageUrl,
        },
      });

      return newUser;
    }
  } catch (error) {
    console.error(error);
  }
};
