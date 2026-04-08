import { createFileRoute } from "@tanstack/react-router";
import { SiteDetailPage } from "@/components/pages/site-detail";

export const Route = createFileRoute("/_app/sites/$siteId")({
  component: SiteDetailPage,
});
