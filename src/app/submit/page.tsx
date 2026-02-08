import { SubmissionForm } from "@/components/salary/SubmissionForm";

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight mt-6">
          Submit your salary
        </h1>
        <SubmissionForm />
      </main>
    </div>
  );
}
