import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/_app/sites/$siteId";
import { useSite, useSiteDevices } from "@/hooks/queries/use-sites";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPinIcon,
  GlobeIcon,
  UserIcon,
} from "lucide-react";
import type { DeviceStatus } from "@/types/enums";

const statusVariant: Record<
  DeviceStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Manufactured: "outline",
  Unprovisioned: "secondary",
  Assigned: "secondary",
  Active: "default",
  Decommissioned: "destructive",
};

export function SiteDetailPage() {
  const { siteId: siteIdParam } = Route.useParams();
  const siteId = Number(siteIdParam);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: site, isLoading: siteLoading } = useSite(siteId);
  const { data: devicesData, isLoading: devicesLoading } = useSiteDevices(
    siteId,
    { page, pageSize }
  );

  const totalPages = Math.ceil((devicesData?.totalCount ?? 0) / pageSize);

  if (siteLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground">Site not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MapPinIcon className="size-6 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{site.name}</h2>
      </div>

      {/* Site Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Site Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p>{site.addressLine1}</p>
                {site.addressLine2 && <p>{site.addressLine2}</p>}
                <p>
                  {site.city}, {site.state} {site.postalCode}
                </p>
                <p>{site.country}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GlobeIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Timezone:</span>
                <span>{site.timezone}</span>
              </div>
              {site.customerName && (
                <div className="flex items-center gap-2">
                  <UserIcon className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Customer:</span>
                  <span>{site.customerName}</span>
                </div>
              )}
              {site.latitude != null && site.longitude != null && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>
                    {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices at this Site */}
      <div>
        <h3 className="mb-3 text-base font-semibold">
          Devices ({devicesData?.totalCount ?? 0})
        </h3>
        {devicesLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Firmware</TableHead>
                  <TableHead>Provisioned</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(devicesData?.items ?? []).length ? (
                  devicesData!.items.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <Link
                          to="/devices/$deviceId"
                          params={{
                            deviceId:
                              device.deviceId ?? String(device.id),
                          }}
                          className="font-medium hover:underline"
                        >
                          {device.serialNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[device.status]}>
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {device.firmwareVersion ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {device.provisionedAt
                          ? new Date(device.provisionedAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(device.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No devices assigned to this site.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} ({devicesData?.totalCount ?? 0}{" "}
              devices)
            </p>
            <div className="flex gap-2">
              <button
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
