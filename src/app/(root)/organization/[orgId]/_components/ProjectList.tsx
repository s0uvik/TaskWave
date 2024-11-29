import React from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getProjects } from "@/actions/getProjects";
import DeleteProject from "./DeleteProject";

type Props = {
  orgId: string;
};

const ProjectList = async ({ orgId }: Props) => {
  const projects = await getProjects(orgId);

  if (projects.length === 0) {
    return (
      <div>
        <p>No projects found</p>
        <Link
          className=" underline underline-offset-2 text-blue-300"
          href="/projects/create"
        ></Link>
      </div>
    );
  }

  return (
    <div className=" grid gap-8 grid-cols-1 md:grid-cols-2">
      {projects.map((project) => (
        <Card key={project.id} className=" flex flex-col justify-between">
          <CardHeader className="flex flex-row justify-between items-center -mt-3">
            <CardTitle>{project.name}</CardTitle>
            <DeleteProject projectId={project.id} />
          </CardHeader>
          <CardContent className=" -mt-3">
            <p className="text-gray-500 mb-4 text-xs md:text-sm line-clamp-3">
              {project.description}
            </p>
            <Link
              href={`/projects/${project.id}`}
              className="text-blue-300 mt-auto"
            >
              View Project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
