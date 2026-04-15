import { useState } from "react";
import { toast } from "sonner";
import { useCreateCompany } from "@/hooks/queries/use-companies";
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
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon } from "lucide-react";
import type { SubscriptionStatus } from "@/types/enums";

export function CreateCompanyDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [focalPointName, setFocalPointName] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>("Trialing");
  const [isInternal, setIsInternal] = useState(false);

  const createCompany = useCreateCompany();

  function resetForm() {
    setName("");
    setContactEmail("");
    setContactPhone("");
    setBillingEmail("");
    setFocalPointName("");
    setSubscriptionStatus("Trialing");
    setIsInternal(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    createCompany.mutate(
      {
        name,
        contactEmail,
        contactPhone: contactPhone || undefined,
        billingEmail,
        focalPointName: focalPointName || undefined,
        subscriptionStatus,
        isInternal,
      },
      {
        onSuccess: (data) => {
          toast.success(`Company "${data.name}" created successfully.`);
          resetForm();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(
            `Failed to create company: ${(error as Error).message}`
          );
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-1 size-4" />
          Create Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Company</DialogTitle>
            <DialogDescription>
              Add a new company to the platform. All required fields must be
              filled.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Plumbing Co."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Contact Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@acme.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="billing-email">Billing Email *</Label>
                <Input
                  id="billing-email"
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  placeholder="billing@acme.com"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="focal-point">Focal Point</Label>
                <Input
                  id="focal-point"
                  value={focalPointName}
                  onChange={(e) => setFocalPointName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subscription-status">Subscription Status</Label>
              <Select
                value={subscriptionStatus}
                onValueChange={(v) =>
                  setSubscriptionStatus(v as SubscriptionStatus)
                }
              >
                <SelectTrigger id="subscription-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trialing">Trialing</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="PastDue">Past Due</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is-internal"
                checked={isInternal}
                onCheckedChange={(checked) =>
                  setIsInternal(checked === true)
                }
              />
              <Label htmlFor="is-internal" className="text-sm font-normal">
                Internal company (Sentinel team / B2C tenant)
              </Label>
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
            <Button type="submit" disabled={createCompany.isPending}>
              {createCompany.isPending ? "Creating..." : "Create Company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
