"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrganizationList, useOrganization } from "@clerk/nextjs";

const Onboarding = () => {
  const { organization } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (organization) {
      router.push(`/organization/${organization.slug}`);
    }
  }, [organization, router]);

  return (
    <div className=" flex justify-center items-center pt-12">
      <OrganizationList hidePersonal />
    </div>
  );
};

export default Onboarding;
