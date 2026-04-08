import { createFileRoute } from "@tanstack/react-router";
import { CompanyDetailPage } from "@/components/pages/company-detail";

export const Route = createFileRoute("/_app/companies/$companyId")({
  component: CompanyDetailPage,
});
