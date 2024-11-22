"use client";

import { $Enums } from "@prisma/client";
import React, { useEffect, useState } from "react";
import SprintManager from "./SprintManager";

export type Sprint = {
  projectId: string;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  status: $Enums.SprintStatus;
};

type Props = {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
};

const SprintBoard = ({ sprints, projectId, orgId }: Props) => {
  const [currentSprint, setCurrentSprint] = useState<Sprint | undefined>(
    undefined
  );
  console.log(orgId);
  useEffect(() => {
    setCurrentSprint(
      sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
    );
  }, [sprints]);

  return (
    <div>
      {/* sprint manager */}
      <SprintManager
        sprint={currentSprint}
        setCurrentSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />
      {/* kanban board */}
    </div>
  );
};

export default SprintBoard;
