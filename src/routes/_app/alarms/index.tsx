import { createFileRoute } from "@tanstack/react-router";
import { AlarmListPage } from "@/components/pages/alarm-list";

export const Route = createFileRoute("/_app/alarms/")({
  component: AlarmListPage,
});
