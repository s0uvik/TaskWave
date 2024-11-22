"use client";

import React, { Dispatch, useEffect, useState } from "react";
import { Sprint } from "./SprintBoard";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/useFetch";
import { updateSprintStatus } from "@/actions/sprint";
import { SprintStatus } from "@prisma/client";
import { BarLoader } from "react-spinners";

type Props = {
  sprint: Sprint | undefined;
  setCurrentSprint: Dispatch<React.SetStateAction<Sprint | undefined>>;
  sprints: Sprint[];
  projectId: string;
};
const SprintManager = ({
  sprint,
  setCurrentSprint,
  sprints,
  projectId,
}: Props) => {
  const [status, setStatus] = useState(sprint?.status);

  const {
    loading,
    data,
    fn: updateSprintStatusFn,
  } = useFetch({ cb: updateSprintStatus });
  console.log(projectId);

  const handleStatusChange = async (status: SprintStatus) => {
    await updateSprintStatusFn(sprint?.id || "", status);
  };
  useEffect(() => {
    if (data?.success) {
      setStatus(data.sprint.status);

      if (sprint && sprint.status !== data.sprint.status) {
        // Only update if the sprint's status has changed
        setCurrentSprint({
          ...sprint,
          status: data.sprint.status,
        });
      }
    }
  }, [data, setCurrentSprint, sprint]);

  const startDate = sprint ? new Date(sprint.startDate) : "";
  const endDate = sprint ? new Date(sprint.endDate) : "";
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
  const canEnd = status === "ACTIVE";

  const handleSprintChange = (value: unknown) => {
    const selectedSprint = sprints.find((spr) => spr.id === value);
    if (selectedSprint) {
      setCurrentSprint(selectedSprint);
      setStatus(selectedSprint.status);
    }
  };

  const getStatusText = () => {
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return ` Overdue by ${formatDistanceToNow(endDate)}`;
    }

    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Sprint Start in ${formatDistanceToNow(startDate)}`;
    }
    if (status === "COMPLETED") {
      return "Sprint End";
    }
  };
  return (
    <>
      <div className=" flex justify-between items-center gap-4">
        <Select value={sprint?.id} onValueChange={handleSprintChange}>
          <SelectTrigger className=" bg-slate-900 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints?.map((spr) => (
              <SelectItem value={spr.id} key={spr.id}>
                {spr.name} (
                {format(new Date(spr.startDate || ""), "MMM d, yyyy")}) to (
                {format(new Date(spr.endDate || ""), "MMM d, yyyy")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {canStart && (
          <Button
            className=" bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            className=" bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
          >
            End Sprint
          </Button>
        )}
      </div>
      {loading && (
        <BarLoader width={100} className=" mt-2" color="steel-blue" />
      )}
      {getStatusText() && (
        <Badge className=" mt-3 ml-1 self-start">{getStatusText()}</Badge>
      )}
    </>
  );
};

export default SprintManager;
