import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/_app/companies/$companyId";
import { useCompany } from "@/hooks/queries/use-companies";
import { useSites } from "@/hooks/queries/use-sites";
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
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  UsersIcon,
  CpuIcon,
} from "lucide-react";
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

export function CompanyDetailPage() {
  const { companyId: companyIdParam } = Route.useParams();
  const companyId = Number(companyIdParam);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: company, isLoading: companyLoading } = useCompany(companyId);
  const { data: sitesData, isLoading: sitesLoading } = useSites({
    companyId,
    page,
    pageSize,
  });

  const totalPages = Math.ceil((sitesData?.totalCount ?? 0) / pageSize);

  if (companyLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground">Company not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BuildingIcon className="size-6 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{company.name}</h2>
        <Badge variant={subStatusVariant[company.subscriptionStatus]}>
          {company.subscriptionStatus}
        </Badge>
      </div>

      {/* Company Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="flex items-center gap-2">
              <MailIcon className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Contact:</span>
              <span>{company.contactEmail}</span>
            </div>
            {company.contactPhone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span>{company.contactPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MailIcon className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Billing:</span>
              <span>{company.billingEmail}</span>
            </div>
            {company.focalPointName && (
              <div className="flex items-center gap-2">
                <UsersIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Focal Point:</span>
                <span>{company.focalPointName}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Customers:</span>
              <span className="font-medium">{company.customerCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Sites:</span>
              <span className="font-medium">{company.siteCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <CpuIcon className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Devices:</span>
              <span className="font-medium">{company.deviceCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sites Table */}
      <div>
        <h3 className="mb-3 text-base font-semibold">Sites</h3>
        {sitesLoading ? (
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
                  <TableHead>Site Name</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(sitesData?.items ?? []).length ? (
                  sitesData!.items.map((site) => (
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
                        {site.city}, {site.state}
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
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No sites found for this company.
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
              Page {page} of {totalPages} ({sitesData?.totalCount ?? 0} sites)
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
