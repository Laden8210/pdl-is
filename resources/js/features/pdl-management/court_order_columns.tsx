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
import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";

export type CourtOrder = {
  court_order_id: number;
  court_order_number: string;
  order_type: string;
  order_date: string;
  received_date: string;
  remarks: string;
  document_type: string;
  court_branch: string;
  pdl_id: number;
  pdl?: {
    fname: string;
    lname: string;
  };
};

export const court_order_columns: ColumnDef<CourtOrder>[] = [
  {
    accessorKey: "court_order_number",
    header: "Court Order Number",
  },
  {
    accessorKey: "order_type",
    header: "Order Type",
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.order_type}
      </Badge>
    ),
  },
  {
    accessorKey: "order_date",
    header: "Order Date",
    cell: ({ row }) => format(new Date(row.original.order_date), "MMM dd, yyyy"),
  },
  {
    accessorKey: "received_date",
    header: "Received Date",
    cell: ({ row }) => format(new Date(row.original.received_date), "MMM dd, yyyy"),
  },
  {
    accessorKey: "document_type",
    header: "Document Type",
  },
  {
    accessorKey: "court_branch",
    header: "Court Branch",
  },
  {
    id: "pdl",
    header: "PDL",
    cell: ({ row }) => {
      const pdl = row.original.pdl;
      return pdl ? `${pdl.fname} ${pdl.lname}` : `ID: ${row.original.pdl_id}`;
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => row.original.remarks || <span className="text-muted-foreground">N/A</span>,
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;

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
            <DropdownMenuItem asChild>
              {/* <UpdateCourtOrder order={order} /> */}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete order", order.court_order_id)}
              className="text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
