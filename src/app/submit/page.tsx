import { DisclaimerBanner } from "@/components/salary/DisclaimerBanner";
import { SubmissionForm } from "@/components/salary/SubmissionForm";
import { LegalFooter } from "@/components/salary/LegalFooter";

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <DisclaimerBanner />
        <h1 className="text-3xl font-bold tracking-tight mt-6">
          Submit your salary
        </h1>
        <SubmissionForm />
      </main>
      <LegalFooter />
    </div>
  );
}
