"use client";

import { $Enums, IssueStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { status } from "@/constant";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import SprintManager from "./SprintManager";
import IssueCard from "./IssueCard";
import CreateIssue from "./CreateIssue";
import BoardFilter from "./BoardFilter";

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

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const SprintBoard = ({ sprints, projectId, orgId }: Props) => {
  const [currentSprint, setCurrentSprint] = useState<Sprint | undefined>(
    undefined
  );

  useEffect(() => {
    setCurrentSprint(
      sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
    );
  }, [sprints]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | null>(
    null
  );
  const {
    loading: issuesLoading,
    error: isIssueError,
    fn: fetchIssues,
    data: issues,
    setData: setIssue,
  } = useFetch({ cb: getIssuesForSprint });
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const handleFilter = (newFilter) => {
    setFilteredIssues(newFilter);
  };

  useEffect(() => {
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
  }, [currentSprint]);

  const handleAddIssue = (status: IssueStatus) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch({ cb: updateIssueOrder });

  const onDragEnd = (result) => {
    if (currentSprint?.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }
    if (currentSprint?.status === "COMPLETED") {
      toast.warning("Can not update the board after sprint end");
      return;
    }
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newOrderedData = [...issues];

    // source and destination list
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );

    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(
        sourceList,
        source.index,
        destination.index
      );

      reorderedCards.forEach((card, i) => {
        card.order = i;
      });
    } else {
      // remove card from the source list
      const [movedCard] = sourceList.splice(source.index, 1);

      // assign the new list id to the moved card
      movedCard.status = destination.droppableId;

      // add new card to the destination list
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => {
        card.order = i;
      });

      // update the order for each card in destination list
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssue(newOrderedData, sortedIssues);

    updateIssueOrderFn(sortedIssues);
  };
  const handleIssueCreated = () => {
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
  };

  return (
    <div className=" w-full">
      {/* sprint manager */}
      <SprintManager
        sprint={currentSprint}
        setCurrentSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !issuesLoading && (
        <BoardFilter issues={issues} onFilterChange={handleFilter} />
      )}

      {issuesLoading && (
        <BarLoader className=" mt-4" width={"100%"} color="#36d7b7" />
      )}

      {updateIssuesError && (
        <p className="text-red-500 mt-2">{updateIssuesError.message}</p>
      )}
      {(updateIssuesLoading || issuesLoading) && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
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

                  {filteredIssues
                    ?.filter((issue) => issue.status === item.key)
                    .map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssuesLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard issue={issue} />
                          </div>
                        )}
                      </Draggable>
                    ))}

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
