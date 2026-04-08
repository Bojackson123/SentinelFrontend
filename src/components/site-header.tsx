import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useMatches } from "@tanstack/react-router"

const titleMap: Record<string, string> = {
  "/_app/": "Dashboard",
  "/_app/companies/": "Companies",
  "/_app/companies/$companyId": "Company Detail",
  "/_app/sites/": "Sites",
  "/_app/sites/$siteId": "Site Detail",
  "/_app/devices/": "Devices",
  "/_app/devices/$deviceId": "Device Detail",
  "/_app/alarms/": "Alarms",
};

export function SiteHeader() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const title = titleMap[lastMatch?.routeId ?? ""] ?? "Sentinel";

  return (
    <header className="flex h-[40px] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="mx-2 flex h-full items-center">
          <Separator orientation="vertical" className="h-4" />
        </div>
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
