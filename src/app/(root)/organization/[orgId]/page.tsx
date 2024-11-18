import React from "react";

const page = async ({ params }: { params: Promise<{ orgId: string }> }) => {
  const { orgId } = await params;
  return <div>{orgId}</div>;
};

export default page;
