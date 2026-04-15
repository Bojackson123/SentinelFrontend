import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSites } from "@/hooks/queries/use-sites";
import { useAuth } from "@/stores/auth-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPinIcon, CpuIcon } from "lucide-react";
import { CreateSiteDialog } from "@/components/create-site-dialog";

export function SiteListPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { isInternal, isCompanyUser } = useAuth();

  const { data, isLoading } = useSites({ page, pageSize });
  const totalPages = Math.ceil((data?.totalCount ?? 0) / pageSize);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sites</h2>
        {(isInternal || isCompanyUser) && <CreateSiteDialog />}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timezone</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.items ?? []).length ? (
                data!.items.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>
                      <Link
                        to="/sites/$siteId"
                        params={{ siteId: String(site.id) }}
                        className="flex items-center gap-2 font-medium hover:underline"
                      >
                        <MapPinIcon className="size-4 text-muted-foreground" />
                        {site.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      {site.customerName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {site.city}, {site.state} {site.postalCode}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {site.timezone}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <CpuIcon className="size-3.5 text-muted-foreground" />
                        {site.deviceCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(site.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No sites found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({data?.totalCount ?? 0} sites)
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
  );
}
