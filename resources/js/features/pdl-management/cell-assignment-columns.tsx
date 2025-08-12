// Updated columns definition for cell assignments
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { CellAssignment } from "@/types";

export const cell_assignment_columns: ColumnDef<CellAssignment>[] = [
  {
    accessorKey: "assignment_id",
    header: "Assignment ID",
  },
  {
    accessorKey: "cell_number",
    header: "Cell Number",
  },
  {
    accessorKey: "cell_id",
    header: "Cell ID",
  },
  {
    accessorKey: "pdl_id",
    header: "PDL ID",
  },
  {
    accessorKey: "pdl_name",
    header: "PDL Name",
  },
  {
    accessorKey: "assigned_date",
    header: "Assigned Date",
    cell: ({ row }) => new Date(row.original.assigned_date).toLocaleDateString()
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const assignment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => console.log("Edit assignment", assignment.assignment_id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete assignment", assignment.assignment_id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
