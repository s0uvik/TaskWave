"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import { Issue } from "@prisma/client";
import IssueDetailsDialog from "./IssueDetailsDialog";

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

type Props = {
  issue: Issue;
  showStatus?: boolean;
  onDelete?: (...params: any) => void;
  onUpdate?: (...params: any) => void;
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler = (...params) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params) => {
    router.refresh();
    onUpdate(...params);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow my-4"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader
          className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`}
        >
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />

          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      )}
    </>
  );
}
