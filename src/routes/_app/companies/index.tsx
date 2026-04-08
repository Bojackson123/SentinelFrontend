import { createFileRoute } from "@tanstack/react-router";
import { CompanyListPage } from "@/components/pages/company-list";

export const Route = createFileRoute("/_app/companies/")({
  component: CompanyListPage,
});
