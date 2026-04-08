import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCompanies } from "@/hooks/queries/use-companies";
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
import { BuildingIcon, UsersIcon, MapPinIcon, CpuIcon } from "lucide-react";
import type { SubscriptionStatus } from "@/types/enums";

const subStatusVariant: Record<
  SubscriptionStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Trialing: "outline",
  Active: "default",
  PastDue: "secondary",
  Cancelled: "destructive",
  Suspended: "destructive",
};

export function CompanyListPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useCompanies({ page, pageSize });
  const totalPages = Math.ceil((data?.totalCount ?? 0) / pageSize);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Companies</h2>
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
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.items ?? []).length ? (
                data!.items.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <Link
                        to="/companies/$companyId"
                        params={{ companyId: String(company.id) }}
                        className="flex items-center gap-2 font-medium hover:underline"
                      >
                        <BuildingIcon className="size-4 text-muted-foreground" />
                        {company.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {company.contactEmail}
                    </TableCell>
                    <TableCell>
                      <Badge variant={subStatusVariant[company.subscriptionStatus]}>
                        {company.subscriptionStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <UsersIcon className="size-3.5 text-muted-foreground" />
                        {company.customerCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <MapPinIcon className="size-3.5 text-muted-foreground" />
                        {company.siteCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <CpuIcon className="size-3.5 text-muted-foreground" />
                        {company.deviceCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No companies found.
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
            Page {page} of {totalPages} ({data?.totalCount ?? 0} companies)
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
