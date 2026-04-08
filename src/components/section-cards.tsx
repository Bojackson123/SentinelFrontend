import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CpuIcon, BellRingIcon, WifiIcon, WifiOffIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface SectionCardsProps {
  totalDevices: number;
  activeDevices: number;
  offlineDevices: number;
  activeAlarms: number;
  criticalAlarms: number;
  isLoading?: boolean;
}

export function SectionCards({
  totalDevices,
  activeDevices,
  offlineDevices,
  activeAlarms,
  criticalAlarms,
  isLoading,
}: SectionCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-40" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Devices</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalDevices}
          </CardTitle>
          <CardAction>
            <CpuIcon className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activeDevices} active in fleet
          </div>
          <div className="text-muted-foreground">
            All registered devices
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Devices Online</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalDevices - offlineDevices}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <WifiIcon className="size-3" />
              Online
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reporting normally
            <WifiIcon className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Last 15-minute window
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Devices Offline</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {offlineDevices}
          </CardTitle>
          <CardAction>
            <Badge variant={offlineDevices > 0 ? "destructive" : "outline"}>
              <WifiOffIcon className="size-3" />
              {offlineDevices > 0 ? "Alert" : "Clear"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {offlineDevices > 0
              ? `${offlineDevices} device${offlineDevices > 1 ? "s" : ""} not reporting`
              : "All devices connected"}
            <WifiOffIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Exceeding offline threshold
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Alarms</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeAlarms}
          </CardTitle>
          <CardAction>
            <Badge variant={criticalAlarms > 0 ? "destructive" : "outline"}>
              <BellRingIcon className="size-3" />
              {criticalAlarms} critical
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activeAlarms === 0 ? "No active alarms" : `${activeAlarms} requiring attention`}
            <BellRingIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Active + Acknowledged
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
