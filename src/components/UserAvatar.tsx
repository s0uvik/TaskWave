import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@prisma/client";

const UserAvatar = ({ user }: { user: User | undefined | null }) => {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Avatar className="h-6 w-6">
        {user?.imageUrl && (
          <AvatarImage
            src={user?.imageUrl}
            alt={user?.name || "user profile"}
          />
        )}
        <AvatarFallback className="capitalize">
          {user ? user.name : "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs text-gray-500">
        {user ? user.name : "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
