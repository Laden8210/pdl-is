// Updated columns definition for cell assignments
import type { ColumnDef } from "@tanstack/react-table";
import type { CellAssignment } from "@/types";
import { TransferCell } from "./transfer-cell";

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
    accessorKey: "pdl_classification",
    header: "PDL Classification",
    cell: ({ row }) => row.original.pdl_classification.replace(/\b\w/g, c => c.toUpperCase()),
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
        <div className="flex items-center space-x-2">
          <TransferCell assignment={assignment} />
        </div>
      );
    },
  },
];
