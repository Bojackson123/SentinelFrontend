import { useState } from "react";
import { toast } from "sonner";
import { useAssignDevice } from "@/hooks/queries/use-devices";
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
import { Separator } from "@/components/ui/separator";
import { QrScanner } from "@/components/qr-scanner";
import { PlusIcon } from "lucide-react";

interface AssignDeviceDialogProps {
  siteId: number;
}

export function AssignDeviceDialog({ siteId }: AssignDeviceDialogProps) {
  const [open, setOpen] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");

  const assignDevice = useAssignDevice();

  function resetForm() {
    setSerialNumber("");
  }

  function handleQrScan(value: string) {
    setSerialNumber(value.trim());
    toast.info(`Scanned: ${value.trim()}`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!serialNumber.trim()) {
      toast.error("Please enter or scan a serial number.");
      return;
    }

    assignDevice.mutate(
      { serialNumber: serialNumber.trim(), siteId },
      {
        onSuccess: (data) => {
          toast.success(
            `Device "${data.serialNumber}" assigned to this site.`
          );
          resetForm();
          setOpen(false);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ??
            error?.response?.data ??
            error?.message ??
            "Unknown error";
          toast.error(`Failed to assign device: ${message}`);
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-1 size-4" />
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Device to Site</DialogTitle>
            <DialogDescription>
              Enter the device serial number manually or scan the QR code on
              the device label.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="serial-number">Serial Number *</Label>
              <Input
                id="serial-number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="GP-202604-00001"
                required
              />
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label className="text-sm text-muted-foreground">
                Or scan QR code
              </Label>
              <QrScanner onScan={handleQrScan} />
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
            <Button type="submit" disabled={assignDevice.isPending}>
              {assignDevice.isPending ? "Assigning..." : "Assign Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
