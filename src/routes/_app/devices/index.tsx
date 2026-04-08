import { createFileRoute } from "@tanstack/react-router";
import { DeviceListPage } from "@/components/pages/device-list";

export const Route = createFileRoute("/_app/devices/")({
  component: DeviceListPage,
});
