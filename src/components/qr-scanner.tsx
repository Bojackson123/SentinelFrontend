import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { CameraIcon, CameraOffIcon } from "lucide-react";

interface QrScannerProps {
  onScan: (value: string) => void;
}

export function QrScanner({ onScan }: QrScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader";

  async function startScanning() {
    setError(null);
    // Set scanning first so the container is rendered visible before html5-qrcode mounts
    setScanning(true);
  }

  // Actually start the scanner after the container becomes visible
  useEffect(() => {
    if (!scanning || scannerRef.current) return;

    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          scanner.stop().then(() => {
            scannerRef.current = null;
            setScanning(false);
          }).catch(() => {});
        },
        () => {
          // ignore scan failures (no QR in frame)
        }
      )
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Camera access denied or unavailable."
        );
        scannerRef.current = null;
        setScanning(false);
      });
  }, [scanning, onScan]);

  async function stopScanning() {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    scannerRef.current = null;
    setScanning(false);
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div
        id={containerId}
        style={{ display: scanning ? "block" : "none", minHeight: scanning ? 300 : 0 }}
        className="overflow-hidden rounded-md"
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={scanning ? stopScanning : startScanning}
      >
        {scanning ? (
          <>
            <CameraOffIcon className="mr-1 size-4" />
            Stop Camera
          </>
        ) : (
          <>
            <CameraIcon className="mr-1 size-4" />
            Scan QR Code
          </>
        )}
      </Button>
    </div>
  );
}
