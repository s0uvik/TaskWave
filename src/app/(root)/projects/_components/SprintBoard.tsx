"use client";

import { $Enums, IssueStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";
import SprintManager from "./SprintManager";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { status } from "@/constant";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateIssue from "./CreateIssue";

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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | null>(
    null
  );

  const handleAddIssue = (status: IssueStatus) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const onDragEnd = () => {};
  const handleIssueCreated = () => {};

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
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {status.map((item) => (
            <Droppable key={item.key} droppableId={item.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-slate-800 p-4 rounded-lg"
                >
                  <h2 className="text-lg font-semibold text-center">
                    {item.name}
                  </h2>

                  {/* issue */}
                  {provided.placeholder}
                  {item.key === "TODO" &&
                    currentSprint?.status !== "COMPLETED" && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => handleAddIssue(item.key)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <CreateIssue
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint?.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;
