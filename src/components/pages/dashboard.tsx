import { useMemo } from "react";
import { useDevices } from "@/hooks/queries/use-devices";
import { useAlarms } from "@/hooks/queries/use-alarms";
import { SectionCards } from "@/components/section-cards";
import { DeviceFleetTable } from "@/components/device-fleet-table";

export function DashboardPage() {
  const { data: devicesData, isLoading: devicesLoading } = useDevices({ pageSize: 100 });
  const { data: alarmsData, isLoading: alarmsLoading } = useAlarms({ status: "Active", pageSize: 100 });

  const stats = useMemo(() => {
    const devices = devicesData?.items ?? [];
    const alarms = alarmsData?.items ?? [];

    const activeDevices = devices.filter((d) => d.status === "Active").length;
    const offlineDevices = devices.filter(
      (d) => d.connectivityState?.isOffline === true
    ).length;
    const criticalAlarms = alarms.filter((a) => a.severity === "Critical").length;

    return {
      totalDevices: devices.length,
      activeDevices,
      offlineDevices,
      activeAlarms: alarms.length,
      criticalAlarms,
    };
  }, [devicesData, alarmsData]);

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 py-4">
      <SectionCards {...stats} isLoading={devicesLoading || alarmsLoading} />
      <div className="px-4 lg:px-6">
        <DeviceFleetTable
          devices={devicesData?.items ?? []}
          isLoading={devicesLoading}
        />
      </div>
    </div>
  );
}
