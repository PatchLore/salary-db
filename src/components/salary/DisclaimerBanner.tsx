import { legal } from "@/lib/legal";

export function DisclaimerBanner() {
  return (
    <p
      className="text-sm bg-stone-100 text-stone-800 border-l-4 border-stone-500 px-4 py-2.5 font-medium dark:bg-stone-800 dark:text-stone-200 dark:border-stone-500"
      role="status"
    >
      {legal.heroDisclaimer}
    </p>
  );
}
