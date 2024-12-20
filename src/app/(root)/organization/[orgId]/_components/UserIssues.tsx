import React, { Suspense } from "react";
import { Issue } from "@prisma/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "@/app/(root)/projects/_components/IssueCard";
import { getUserIssues } from "@/actions/issues";

const UserIssues = async ({ userId }: { userId: string | null }) => {
  const issues = await getUserIssues(userId || "");

  if (issues.length === 0) {
    return null;
  }

  const assignedIssues = issues.filter(
    (issue) => issue.assignee?.clerkUserId === userId
  );
  const reportedIssues = issues.filter(
    (issue) => issue.reporter.clerkUserId === userId
  );
  return (
    <>
      <h1 className=" text-3xl font-semibold gradient-title my-4">My Issues</h1>
      <Tabs defaultValue="assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">Assigned to you</TabsTrigger>
          <TabsTrigger value="reported">Reported by you</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={assignedIssues} />
          </Suspense>
        </TabsContent>
        <TabsContent value="reported">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={reportedIssues} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
};

function IssueGrid({ issues }: { issues: Issue[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
}

export default UserIssues;
