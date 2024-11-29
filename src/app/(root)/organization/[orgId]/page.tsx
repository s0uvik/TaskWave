import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/OrgSwitcher";
import React from "react";
import ProjectList from "./_components/ProjectList";
import UserIssues from "./_components/UserIssues";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ orgId: string }> }) => {
  const { orgId } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const organization = await getOrganization(orgId);

  if (!organization) return <div>Organization not found</div>;

  console.log(organization);

  return (
    <div className=" container mx-auto">
      <section className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className=" text-3xl sm:text-4xl font-semibold pb-2 gradient-title ">
          {organization.name}&apos;s Projects
        </h1>

        <OrgSwitcher />
      </section>
      <section>
        <ProjectList orgId={organization.id} />
      </section>
      <section>
        <UserIssues userId={userId} />
      </section>
    </div>
  );
};

export default page;
