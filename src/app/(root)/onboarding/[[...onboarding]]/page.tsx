"use client";
import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Onboarding = () => {
  const { organization } = useOrganization();
  const router = useRouter();
  useEffect(() => {
    if (organization) {
      router.push(`/organization/${organization.slug}`);
    }
  }, [organization, router]);
  return (
    <div>
      <OrganizationList />
    </div>
  );
};

export default Onboarding;
