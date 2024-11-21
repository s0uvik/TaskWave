import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/OrgSwitcher";
import React from "react";
import ProjectList from "./_components/ProjectList";

const page = async ({ params }: { params: Promise<{ orgId: string }> }) => {
  const { orgId } = await params;
  const organization = await getOrganization(orgId);

  if (!organization) return <div>Organization not found</div>;

  console.log(organization);

  return (
    <div className=" container mx-auto">
      <section className=" flex mb-4 fex-col sm:flex-row justify-between items-start">
        <h1 className=" text-3xl sm:text-4xl font-semibold pb-2 gradient-title ">
          {organization.name}&apos;s Projects
        </h1>

        <OrgSwitcher />
      </section>
      <section>
        <ProjectList orgId={organization.id} />
      </section>
      <section></section>
    </div>
  );
};

export default page;
