import React, { ReactNode, Suspense } from "react";

const ProjectLayout = async ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<p>Loading project...</p>}>{children}</Suspense>;
};

export default ProjectLayout;
