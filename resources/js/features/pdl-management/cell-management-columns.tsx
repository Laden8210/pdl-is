
import type { ColumnDef } from "@tanstack/react-table";
import { ViewCellActivityLog } from "@/features/pdl-management/view-cell-activity-log";
import { Badge } from "@/components/ui/badge";
import { UpdateCellInformation } from "@/features/pdl-management/edit-cell-information";
import { Cells } from "@/types";

export const cell_management_columns: ColumnDef<Cells>[] = [
  {
    accessorKey: "cell_name",
    header: "Cell Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description || <span className="text-muted-foreground">N/A</span>,
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <Badge variant={row.original.gender === 'male' ? 'default' : 'secondary'}>
        {row.original.gender.charAt(0).toUpperCase() + row.original.gender.slice(1)}
      </Badge>
    ),
  },
  {
    id: "occupied",
    header: "Occupied",
    cell: ({ row }) => row.original.assignments_count ?? 0,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'destructive'}>
        {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const cell = row.original;

    return (
        <div className="flex gap-2">
            <UpdateCellInformation cell={{
                ...cell,
                description: cell.description ?? ""
            }} />
            <ViewCellActivityLog cell={cell} />
        </div>
    );
    },
  },
];
