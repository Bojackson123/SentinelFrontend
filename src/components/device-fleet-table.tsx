import { useState, useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Device } from "@/types/device";
import type { DeviceStatus } from "@/types/enums";

const statusVariant: Record<DeviceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Manufactured: "outline",
  Unprovisioned: "secondary",
  Assigned: "secondary",
  Active: "default",
  Decommissioned: "destructive",
};

const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
    cell: ({ row }) => (
      <Link
        to="/devices/$deviceId"
        params={{ deviceId: row.original.deviceId ?? String(row.original.id) }}
        className="font-medium hover:underline"
      >
        {row.original.serialNumber}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "connectivity",
    header: "Connectivity",
    cell: ({ row }) => {
      const isOffline = row.original.connectivityState?.isOffline;
      if (isOffline === undefined || isOffline === null) return <span className="text-muted-foreground">—</span>;
      return isOffline ? (
        <Badge variant="destructive">Offline</Badge>
      ) : (
        <Badge variant="outline" className="text-green-600 border-green-600">Online</Badge>
      );
    },
  },
  {
    id: "site",
    header: "Site",
    cell: ({ row }) => {
      const active = row.original.assignments?.find((a) => !a.unassignedAt);
      return active?.site?.name ?? <span className="text-muted-foreground">Unassigned</span>;
    },
  },
  {
    id: "lastSeen",
    header: "Last Seen",
    cell: ({ row }) => {
      const ts = row.original.connectivityState?.lastMessageReceivedAt;
      if (!ts) return <span className="text-muted-foreground">Never</span>;
      return new Date(ts).toLocaleString();
    },
  },
];

interface DeviceFleetTableProps {
  devices: Device[];
  isLoading?: boolean;
}

export function DeviceFleetTable({ devices, isLoading }: DeviceFleetTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => devices, [devices]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No devices found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
