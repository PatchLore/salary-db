import { legal } from "@/lib/legal";

export function DisclaimerBanner() {
  return (
    <p className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
      {legal.heroDisclaimer}
    </p>
  );
}
