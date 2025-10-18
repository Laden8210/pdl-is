import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EyeIcon, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { router } from "@inertiajs/react";
import { DeleteCourtOrder } from "@/features/pdl-management/delete-court-order";

export type CourtOrder = {
  court_order_id: number;
  order_type: string;
  order_date: string;
  received_date: string;
  remarks: string;
  document_type: string;
  document_path: string;
  court_branch: string;
  pdl_id: number;
  pdl?: {
    fname: string;
    lname: string;
  };
};



export const court_order_columns: ColumnDef<CourtOrder>[] = [
  {
    accessorKey: "order_type",
    header: "Order Type",
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">


        {row.original.order_type.replace(/_/g, ' ').charAt(0).toUpperCase() + row.original.order_type.replace(/_/g, ' ').slice(1)}
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

    cell: ({ row }) => {
      const handleDocumentPreview = (document_path: string) => {

        window.open(`/storage/${document_path}`, '_blank');

      };
      return (
      <Button variant="outline"
      onClick={() => row.original.document_type && handleDocumentPreview(row.original.document_path)}>
       Preview
      </Button>
    );
    },
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
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.visit(route('court-orders.edit', order.court_order_id))}
              >
                Edit
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteCourtOrder order={order} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
