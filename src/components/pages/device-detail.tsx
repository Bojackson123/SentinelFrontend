import { useDevice, useDeviceState, useDeviceCommands } from "@/hooks/queries/use-devices";
import { useAlarms } from "@/hooks/queries/use-alarms";
import { useAuth } from "@/stores/auth-store";
import { Route } from "@/routes/_app/devices/$deviceId";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitCommand } from "@/api/devices";
import { acknowledgeAlarm, resolveAlarm } from "@/api/alarms";
import type { CommandType } from "@/types/device";
import type { DeviceStatus, AlarmStatus } from "@/types/enums";
import {
  WifiIcon,
  WifiOffIcon,
  ThermometerIcon,
  ZapIcon,
  GaugeIcon,
  ActivityIcon,
  RefreshCwIcon,
  RotateCcwIcon,
} from "lucide-react";

const commandTypes: { type: CommandType; label: string }[] = [
  { type: "reboot", label: "Reboot" },
  { type: "ping", label: "Ping" },
  { type: "run-self-test", label: "Self Test" },
  { type: "sync-now", label: "Sync Now" },
  { type: "clear-fault", label: "Clear Fault" },
];

const statusVariant: Record<DeviceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Manufactured: "outline",
  Unprovisioned: "secondary",
  Assigned: "secondary",
  Active: "default",
  Decommissioned: "destructive",
};

const alarmStatusVariant: Record<AlarmStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "destructive",
  Acknowledged: "secondary",
  Suppressed: "outline",
  Resolved: "default",
};

export function DeviceDetailPage() {
  const { deviceId } = Route.useParams();
  const { isInternal, isCompanyUser } = useAuth();
  const canCommand = isInternal || isCompanyUser;
  const queryClient = useQueryClient();

  const { data: device, isLoading: deviceLoading } = useDevice(deviceId);
  const { data: state, isLoading: stateLoading } = useDeviceState(deviceId);
  const { data: commands } = useDeviceCommands(deviceId);
  const { data: alarmsData } = useAlarms({ status: "Active" });

  const deviceAlarms = alarmsData?.items?.filter((a) => String(a.deviceId) === deviceId) ?? [];

  const sendCommand = useMutation({
    mutationFn: (type: CommandType) => submitCommand(deviceId, type),
    onSuccess: (_, type) => {
      toast.success(`Command "${type}" sent`);
      queryClient.invalidateQueries({ queryKey: ["deviceCommands", deviceId] });
    },
    onError: () => toast.error("Failed to send command"),
  });

  const ackAlarmMutation = useMutation({
    mutationFn: (alarmId: number) => acknowledgeAlarm(alarmId),
    onSuccess: () => {
      toast.success("Alarm acknowledged");
      queryClient.invalidateQueries({ queryKey: ["alarms"] });
    },
    onError: () => toast.error("Failed to acknowledge alarm"),
  });

  const resolveAlarmMutation = useMutation({
    mutationFn: (alarmId: number) => resolveAlarm(alarmId),
    onSuccess: () => {
      toast.success("Alarm resolved");
      queryClient.invalidateQueries({ queryKey: ["alarms"] });
    },
    onError: () => toast.error("Failed to resolve alarm"),
  });

  if (deviceLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground">Device not found.</p>
      </div>
    );
  }

  const activeSite = device.assignments?.find((a) => !a.unassignedAt);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">{device.serialNumber}</h2>
        <Badge variant={statusVariant[device.status]}>{device.status}</Badge>
        {device.connectivityState && (
          device.connectivityState.isOffline ? (
            <Badge variant="destructive"><WifiOffIcon className="mr-1 size-3" />Offline</Badge>
          ) : (
            <Badge variant="outline" className="text-green-600 border-green-600"><WifiIcon className="mr-1 size-3" />Online</Badge>
          )
        )}
      </div>
      {activeSite?.site && (
        <p className="text-sm text-muted-foreground">
          Site: {activeSite.site.name} — {activeSite.site.city}, {activeSite.site.state}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Telemetry State Card */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Telemetry</CardTitle>
            <CardDescription>
              {stateLoading
                ? "Loading..."
                : state
                  ? `Updated ${new Date(state.updatedAt).toLocaleString()}`
                  : "No telemetry data"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stateLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : state ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <ZapIcon className="size-4 text-yellow-500" />
                  <span className="text-muted-foreground">Voltage</span>
                  <span className="ml-auto font-medium">{state.panelVoltage?.toFixed(1) ?? "—"} V</span>
                </div>
                <div className="flex items-center gap-2">
                  <GaugeIcon className="size-4 text-blue-500" />
                  <span className="text-muted-foreground">Current</span>
                  <span className="ml-auto font-medium">{state.pumpCurrent?.toFixed(2) ?? "—"} A</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="size-4 text-red-500" />
                  <span className="text-muted-foreground">Temp</span>
                  <span className="ml-auto font-medium">{state.temperatureC?.toFixed(1) ?? "—"} °C</span>
                </div>
                <div className="flex items-center gap-2">
                  <ActivityIcon className="size-4 text-purple-500" />
                  <span className="text-muted-foreground">Signal</span>
                  <span className="ml-auto font-medium">{state.signalRssi ?? "—"} dBm</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCwIcon className="size-4" />
                  <span className="text-muted-foreground">Cycles</span>
                  <span className="ml-auto font-medium">{state.derivedCycleCount ?? state.reportedCycleCount ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcwIcon className="size-4" />
                  <span className="text-muted-foreground">Runtime</span>
                  <span className="ml-auto font-medium">{state.runtimeSeconds != null ? `${Math.floor(state.runtimeSeconds / 3600)}h` : "—"}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-muted-foreground">Pump</span>
                  <Badge variant={state.pumpRunning ? "default" : "outline"}>
                    {state.pumpRunning ? "Running" : "Idle"}
                  </Badge>
                  {state.highWaterAlarm && (
                    <Badge variant="destructive">High Water!</Badge>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No telemetry received yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Commands Card */}
        {canCommand && (
          <Card>
            <CardHeader>
              <CardTitle>Commands</CardTitle>
              <CardDescription>Send a command to this device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {commandTypes.map((cmd) => (
                  <Button
                    key={cmd.type}
                    size="sm"
                    variant="outline"
                    disabled={sendCommand.isPending}
                    onClick={() => sendCommand.mutate(cmd.type)}
                  >
                    {cmd.label}
                  </Button>
                ))}
              </div>
              {commands && commands.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Command</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commands.slice(0, 5).map((cmd) => (
                      <TableRow key={cmd.id}>
                        <TableCell className="font-medium">{cmd.commandType}</TableCell>
                        <TableCell>
                          <Badge variant={cmd.status === "Succeeded" ? "default" : cmd.status === "Failed" || cmd.status === "TimedOut" ? "destructive" : "secondary"}>
                            {cmd.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(cmd.requestedAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Alarms Card */}
        <Card className={canCommand ? "md:col-span-2" : ""}>
          <CardHeader>
            <CardTitle>Active Alarms</CardTitle>
            <CardDescription>{deviceAlarms.length} active alarm{deviceAlarms.length !== 1 ? "s" : ""}</CardDescription>
          </CardHeader>
          <CardContent>
            {deviceAlarms.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active alarms for this device.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviceAlarms.map((alarm) => (
                    <TableRow key={alarm.id}>
                      <TableCell className="font-medium">{alarm.alarmType}</TableCell>
                      <TableCell>
                        <Badge variant={alarm.severity === "Critical" ? "destructive" : alarm.severity === "Warning" ? "secondary" : "outline"}>
                          {alarm.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={alarmStatusVariant[alarm.status]}>{alarm.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(alarm.startedAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {alarm.status === "Active" && (
                            <Button size="sm" variant="outline" onClick={() => ackAlarmMutation.mutate(alarm.id)}>
                              Acknowledge
                            </Button>
                          )}
                          {(alarm.status === "Active" || alarm.status === "Acknowledged") && (
                            <Button size="sm" variant="outline" onClick={() => resolveAlarmMutation.mutate(alarm.id)}>
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
