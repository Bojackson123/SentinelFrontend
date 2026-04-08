import { createFileRoute } from "@tanstack/react-router";
import { SiteListPage } from "@/components/pages/site-list";

export const Route = createFileRoute("/_app/sites/")({
  component: SiteListPage,
});
