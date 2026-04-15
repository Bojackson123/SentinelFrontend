import { useState } from "react";
import { toast } from "sonner";
import { useCreateSite } from "@/hooks/queries/use-sites";
import { useCreateCustomer, useCustomers } from "@/hooks/queries/use-customers";
import { useAuth } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";

interface CreateSiteDialogProps {
  companyId?: number;
}

export function CreateSiteDialog({ companyId }: CreateSiteDialogProps) {
  const { user, isInternal } = useAuth();
  const resolvedCompanyId = companyId ?? user?.companyId ?? undefined;

  const [open, setOpen] = useState(false);

  // Site fields
  const [siteName, setSiteName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [timezone, setTimezone] = useState("America/New_York");

  // Customer selection
  const [customerTab, setCustomerTab] = useState<string>("existing");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  // New customer fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { data: customersData } = useCustomers({
    companyId: resolvedCompanyId,
    pageSize: 100,
  });

  const createSite = useCreateSite();
  const createCustomer = useCreateCustomer();

  function resetForm() {
    setSiteName("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("US");
    setTimezone("America/New_York");
    setCustomerTab("existing");
    setSelectedCustomerId("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      let customerId: number;

      if (customerTab === "existing") {
        if (!selectedCustomerId) {
          toast.error("Please select an existing customer.");
          return;
        }
        customerId = Number(selectedCustomerId);
      } else {
        // Create new customer first
        const newCustomer = await createCustomer.mutateAsync({
          companyId: resolvedCompanyId,
          firstName,
          lastName,
          email,
          phone: phone || undefined,
        });
        customerId = newCustomer.id;
      }

      createSite.mutate(
        {
          customerId,
          name: siteName,
          addressLine1,
          addressLine2: addressLine2 || undefined,
          city,
          state,
          postalCode,
          country,
          timezone,
        },
        {
          onSuccess: (data) => {
            toast.success(`Site "${data.name}" created successfully.`);
            resetForm();
            setOpen(false);
          },
          onError: (error) => {
            toast.error(
              `Failed to create site: ${(error as Error).message}`
            );
          },
        }
      );
    } catch (error) {
      toast.error(
        `Failed to create customer: ${(error as Error).message}`
      );
    }
  }

  const isPending = createSite.isPending || createCustomer.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-1 size-4" />
          Create Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Site</DialogTitle>
            <DialogDescription>
              Add a new installation site. Select or create a customer, then
              provide the site address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Customer Section */}
            <div>
              <Label className="text-sm font-semibold">Customer</Label>
              <Tabs
                value={customerTab}
                onValueChange={setCustomerTab}
                className="mt-2"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="existing" className="flex-1">
                    Existing Customer
                  </TabsTrigger>
                  <TabsTrigger value="new" className="flex-1">
                    New Customer
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="existing" className="mt-3">
                  <Select
                    value={selectedCustomerId}
                    onValueChange={setSelectedCustomerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(customersData?.items ?? []).length === 0 ? (
                        <SelectItem value="__none" disabled>
                          No customers found
                        </SelectItem>
                      ) : (
                        (customersData?.items ?? []).map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.firstName} {c.lastName} — {c.email}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="new" className="mt-3 grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="cust-first-name">First Name *</Label>
                      <Input
                        id="cust-first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={customerTab === "new"}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cust-last-name">Last Name *</Label>
                      <Input
                        id="cust-last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={customerTab === "new"}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="cust-email">Email *</Label>
                      <Input
                        id="cust-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={customerTab === "new"}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cust-phone">Phone</Label>
                      <Input
                        id="cust-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Separator />

            {/* Site Details */}
            <div className="grid gap-2">
              <Label htmlFor="site-name">Site Name *</Label>
              <Input
                id="site-name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Smith Residence"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address1">Address Line 1 *</Label>
              <Input
                id="address1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="123 Main St"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Apt 4B"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="postal-code">Postal Code *</Label>
                <Input
                  id="postal-code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone *</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">
                      Eastern
                    </SelectItem>
                    <SelectItem value="America/Chicago">Central</SelectItem>
                    <SelectItem value="America/Denver">Mountain</SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific
                    </SelectItem>
                    <SelectItem value="America/Anchorage">Alaska</SelectItem>
                    <SelectItem value="Pacific/Honolulu">Hawaii</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Site"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
