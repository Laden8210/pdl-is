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
import { EditPhysicalCharacteristic } from "@/features/pdl-management/edit-physical-characteristic";
import { router } from "@inertiajs/react";
import { PhysicalCharacteristic } from "@/types";

export const physical_characteristic_columns: ColumnDef<PhysicalCharacteristic>[] = [
  {
    id: "pdl",
    header: "PDL",
    cell: ({ row }) => {
      const pdl = row.original.pdl;
      return pdl ? `${pdl.fname} ${pdl.lname}` : `ID: ${row.original.pdl_id}`;
    },
  },
  {
    accessorKey: "height",
    header: "Height (cm)",
  },
  {
    accessorKey: "weight",
    header: "Weight (kg)",
  },
  {
    accessorKey: "build",
    header: "Build",
  },
  {
    accessorKey: "complexion",
    header: "Complexion",
  },
  {
    accessorKey: "hair_color",
    header: "Hair Color",
  },
  {
    accessorKey: "eye_color",
    header: "Eye Color",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const characteristic = row.original;

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
              <EditPhysicalCharacteristic characteristic={characteristic} pdls={[]} />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.delete(route('physical-characteristics.destroy', characteristic.characteristic_id))}
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
