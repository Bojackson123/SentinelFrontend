import { useState } from "react";
import { useAlarms } from "@/hooks/queries/use-alarms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acknowledgeAlarm, suppressAlarm, resolveAlarm } from "@/api/alarms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Alarm } from "@/types/alarm";
import type { AlarmSeverity, AlarmStatus } from "@/types/enums";

const severityVariant: Record<AlarmSeverity, "default" | "secondary" | "destructive" | "outline"> = {
  Info: "outline",
  Warning: "secondary",
  Critical: "destructive",
};

const statusVariant: Record<AlarmStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "destructive",
  Acknowledged: "secondary",
  Suppressed: "outline",
  Resolved: "default",
};

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Acknowledged", label: "Acknowledged" },
  { value: "Suppressed", label: "Suppressed" },
  { value: "Resolved", label: "Resolved" },
];

const severityOptions = [
  { value: "all", label: "All Severities" },
  { value: "Info", label: "Info" },
  { value: "Warning", label: "Warning" },
  { value: "Critical", label: "Critical" },
];

export function AlarmListPage() {
  const [statusFilter, setStatusFilter] = useState("Active");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [suppressReason, setSuppressReason] = useState("");
  const pageSize = 20;
  const queryClient = useQueryClient();

  const { data, isLoading } = useAlarms({
    status: statusFilter === "all" ? undefined : statusFilter,
    severity: severityFilter === "all" ? undefined : severityFilter,
    page,
    pageSize,
  });

  const totalPages = Math.ceil((data?.totalCount ?? 0) / pageSize);

  const ackMutation = useMutation({
    mutationFn: (id: number) => acknowledgeAlarm(id),
    onSuccess: () => {
      toast.success("Alarm acknowledged");
      queryClient.invalidateQueries({ queryKey: ["alarms"] });
    },
    onError: () => toast.error("Failed to acknowledge"),
  });

  const suppressMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      suppressAlarm(id, reason),
    onSuccess: () => {
      toast.success("Alarm suppressed");
      setSuppressReason("");
      setSelectedAlarm(null);
      queryClient.invalidateQueries({ queryKey: ["alarms"] });
    },
    onError: () => toast.error("Failed to suppress"),
  });

  const resolveMutation = useMutation({
    mutationFn: (id: number) => resolveAlarm(id),
    onSuccess: () => {
      toast.success("Alarm resolved");
      queryClient.invalidateQueries({ queryKey: ["alarms"] });
    },
    onError: () => toast.error("Failed to resolve"),
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Alarms</h2>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setPage(1); }}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {severityOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                <TableHead>Alarm Type</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.items ?? []).length ? (
                (data?.items ?? []).map((alarm) => (
                  <TableRow key={alarm.id}>
                    <TableCell className="font-medium">{alarm.alarmType}</TableCell>
                    <TableCell>{alarm.device?.serialNumber ?? alarm.deviceId}</TableCell>
                    <TableCell>
                      <Badge variant={severityVariant[alarm.severity]}>{alarm.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[alarm.status]}>{alarm.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(alarm.startedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {alarm.status === "Active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={ackMutation.isPending}
                            onClick={() => ackMutation.mutate(alarm.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                        {(alarm.status === "Active" || alarm.status === "Acknowledged") && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedAlarm(alarm)}
                            >
                              Suppress
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={resolveMutation.isPending}
                              onClick={() => resolveMutation.mutate(alarm.id)}
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No alarms found.
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
            Page {page} of {totalPages} ({data?.totalCount ?? 0} alarms)
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

      {/* Suppress Alarm Sheet */}
      <Sheet open={!!selectedAlarm} onOpenChange={(open) => { if (!open) setSelectedAlarm(null); }}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Suppress Alarm</SheetTitle>
            <SheetDescription>
              Provide a reason for suppressing alarm "{selectedAlarm?.alarmType}" on device {selectedAlarm?.device?.serialNumber}.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 p-4">
            <Input
              placeholder="Suppression reason..."
              value={suppressReason}
              onChange={(e) => setSuppressReason(e.target.value)}
            />
            <Button
              disabled={!suppressReason.trim() || suppressMutation.isPending}
              onClick={() => {
                if (selectedAlarm) {
                  suppressMutation.mutate({ id: selectedAlarm.id, reason: suppressReason });
                }
              }}
            >
              {suppressMutation.isPending ? "Suppressing…" : "Confirm Suppress"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
