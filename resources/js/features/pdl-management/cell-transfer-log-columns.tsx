import type { ColumnDef } from "@tanstack/react-table";

interface CellTransferLog {
  id: number;
  assignment_id: number;
  pdl_name: string;
  pdl_gender: string;
  from_cell: string;
  to_cell: string;
  transferred_by: string;
  reason: string;
  transferred_at: string;
}

export const cell_transfer_log_columns: ColumnDef<CellTransferLog>[] = [
  {
    accessorKey: "assignment_id",
    header: "Assignment ID",
  },
  {
    accessorKey: "pdl_name",
    header: "PDL Name",
  },
  {
    accessorKey: "pdl_gender",
    header: "PDL Gender",
  },
  {
    accessorKey: "from_cell",
    header: "From Cell",
  },
  {
    accessorKey: "to_cell",
    header: "To Cell",
  },
  {
    accessorKey: "transferred_by",
    header: "Transferred By",
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.original.reason}>
        {row.original.reason}
      </div>
    ),
  },
  {
    accessorKey: "transferred_at",
    header: "Transferred At",
    cell: ({ row }) => {
      const date = new Date(row.original.transferred_at);
      return (
        <div>
          <div>{date.toLocaleDateString()}</div>
          <div className="text-sm text-gray-500">{date.toLocaleTimeString()}</div>
        </div>
      );
    },
  },
];
