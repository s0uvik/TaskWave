"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import React from "react";
import { BarLoader } from "react-spinners";

const UserLoader = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  if (!isLoaded && !isUserLoaded) {
    return <BarLoader className=" mb-4" width={"100%"} color="steel-blue" />;
  } else <></>;
};
export default UserLoader;
