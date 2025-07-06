"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export type Personnel = {
  id: number;
  fname: string;
  mname: string | null;
  lname: string;
  contactnum: string;
  avatar: string | null;
  username: string;
  password: string;
  position: string;
  agency: string;
};

export const user_columns: ColumnDef<Personnel>[] = [
  {
    accessorKey: "fname",
    header: "First Name",
  },
  {
    accessorKey: "mname",
    header: "Middle Name",
    cell: ({ row }) => row.getValue("mname") || <span className="text-muted-foreground">N/A</span>,
  },
  {
    accessorKey: "lname",
    header: "Last Name",
  },
  {
    accessorKey: "contactnum",
    header: "Contact No.",
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const avatar = row.getValue("avatar") as string | null;
      return avatar ? (
        <img src={`/storage/${avatar}`} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
      ) : (
        <span className="text-muted-foreground">N/A</span>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "agency",
    header: "Agency",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;

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
            <DropdownMenuItem onClick={() => console.log("Edit", id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Delete", id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
