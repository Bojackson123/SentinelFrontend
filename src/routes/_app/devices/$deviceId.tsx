import { createFileRoute } from "@tanstack/react-router";
import { DeviceDetailPage } from "@/components/pages/device-detail";

export const Route = createFileRoute("/_app/devices/$deviceId")({
  component: DeviceDetailPage,
});
