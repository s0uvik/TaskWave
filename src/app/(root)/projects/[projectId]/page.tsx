import { getProject } from "@/actions/getProject";
import { notFound } from "next/navigation";
import React from "react";
import SprintCreationForm from "../_components/SprintCreationForm";
import SprintBoard from "../_components/SprintBoard";

const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;

  const project = await getProject(projectId);

  if (!project) return notFound();

  return (
    <div className=" container mx-auto">
      {/* spring creation */}
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />

      {/* spring board */}
      {project?.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        <p className=" mt-24 text-center text-gray-400 text-lg">
          No sprint found, Create a Sprint
        </p>
      )}
    </div>
  );
};

export default page;
