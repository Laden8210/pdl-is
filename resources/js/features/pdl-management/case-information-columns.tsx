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

export type CaseInformation = {
  case_id: number;
  case_number: string;
  crime_committed: string;
  date_committed: string;
  time_committed: string;
  case_status: string;
  case_remarks: string;
  security_classification: string;
  drug_related: boolean;
  pdl_id: number;
  pdl?: {
    fname: string;
    lname: string;
  };
};

export const case_information_columns: ColumnDef<CaseInformation>[] = [
  {
    accessorKey: "case_number",
    header: "Case Number",
  },
  {
    accessorKey: "crime_committed",
    header: "Crime Committed",
  },
  {
    accessorKey: "date_committed",
    header: "Date Committed",
    cell: ({ row }) => format(new Date(row.original.date_committed), "MMM dd, yyyy"),
  },
  {
    accessorKey: "time_committed",
    header: "Time Committed",
  },
  {
    accessorKey: "case_status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.case_status === 'open' ? 'default' : 'destructive'}>
        {row.original.case_status.toUpperCase()}
      </Badge>
    ),
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
    accessorKey: "security_classification",
    header: "Security Classification",
  },
  {
    accessorKey: "drug_related",
    header: "Drug Related",
    cell: ({ row }) => (
      <Badge variant={row.original.drug_related ? 'destructive' : 'secondary'}>
        {row.original.drug_related ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const caseInfo = row.original;

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

            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete case", caseInfo.case_id)}
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
