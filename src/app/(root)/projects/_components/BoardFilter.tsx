"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Issue, User } from "@prisma/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define priority levels for filtering
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

// Extend the Issue type to include the `assignee` relation
type IssueWithAssignee = Issue & {
  assignee: User | null; // Assignee can be null
};

type Props = {
  issues: IssueWithAssignee[]; // Issues data with assignee relation
  onFilterChange: (issues: Issue[]) => void; // Callback to return filtered issues
};

export default function BoardFilter({ issues, onFilterChange }: Props) {
  // State for search term, selected assignees, and priority filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState("");

  // Extract unique assignees from issues
  const assignees = issues
    .map((issue) => issue.assignee)
    .filter(
      (item, index, self) =>
        item !== null && index === self.findIndex((t) => t?.id === item?.id)
    );

  // Effect to filter issues whenever filters change
  useEffect(() => {
    const filteredIssues = issues.filter(
      (issue) =>
        // Filter by search term
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        // Filter by selected assignees
        (selectedAssignees.length === 0 ||
          (issue.assignee?.id &&
            selectedAssignees.includes(issue.assignee.id))) &&
        // Filter by priority
        (selectedPriority === "" || issue.priority === selectedPriority)
    );
    // Update filtered issues via callback
    onFilterChange(filteredIssues);
  }, [searchTerm, selectedAssignees, selectedPriority, issues]);

  // Toggle assignee selection for filtering
  const toggleAssignee = (assigneeId: string) => {
    setSelectedAssignees(
      (prev) =>
        prev.includes(assigneeId)
          ? prev.filter((id) => id !== assigneeId) // Deselect if already selected
          : [...prev, assigneeId] // Add to selection if not already selected
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
  };

  // Check if any filters are applied
  const isFiltersApplied =
    searchTerm !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== "";

  return (
    <div className="space-y-4">
      {/* Search and filter inputs */}
      <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6">
        {/* Search bar for issue titles */}
        <Input
          className="w-full sm:w-72"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Assignee filter using avatars */}
        <div className="flex-shrink-0">
          <div className="flex gap-2 flex-wrap">
            {assignees.map((assignee, i) => {
              const selected = selectedAssignees.includes(assignee?.id ?? "");

              return (
                <div
                  key={assignee?.id}
                  className={`rounded-full ring ${
                    selected ? "ring-blue-600" : "ring-black"
                  } ${i > 0 ? "-ml-6" : ""}`}
                  style={{
                    zIndex: i, // Stack avatars
                  }}
                  onClick={() => assignee?.id && toggleAssignee(assignee.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={assignee?.imageUrl || ""} />
                    <AvatarFallback>{assignee?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority filter dropdown */}
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters button */}
        {isFiltersApplied && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
