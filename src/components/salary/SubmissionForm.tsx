"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema, companySizeOptions } from "@/lib/validations";
import type { SubmissionFormValues } from "@/lib/validations";
import { legal } from "@/lib/legal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SubmissionForm() {
  const router = useRouter();
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      role: "",
      location: "",
      currency: "USD",
      salaryMin: 0,
      salaryMax: 0,
      yearsExp: 0,
      companySize: "51-200",
      confirmData: false as unknown as true, // form starts unchecked; schema requires true on submit
    },
  });

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    SGD: "S$",
    AUD: "A$",
    JPY: "¥",
    Other: "",
  };

  const locationValue = form.watch("location");
  const currencyValue = form.watch("currency") || "USD";

  // Detect currency heuristically from location and set if user hasn't chosen one explicitly
  React.useEffect(() => {
    const loc = (locationValue || "").toLowerCase();
    let detected = "USD";
    if (loc.includes("uk") || loc.includes("london")) detected = "GBP";
    else if (loc.includes("germany") || loc.includes("berlin") || loc.includes("france") || loc.includes("paris") || loc.includes("amsterdam")) detected = "EUR";
    else if (loc.includes("canada") || loc.includes("toronto")) detected = "CAD";
    else if (loc.includes("singapore")) detected = "SGD";
    else if (loc.includes("australia") || loc.includes("sydney")) detected = "AUD";
    else if (loc.includes("japan") || loc.includes("tokyo")) detected = "JPY";
    else detected = "USD";

    if ((!currencyValue || currencyValue === "USD") && detected) {
      form.setValue("currency", detected as "USD" | "EUR" | "GBP" | "CAD" | "SGD" | "AUD" | "JPY" | "Other");
    }
  }, [locationValue, currencyValue, form]);

  async function onSubmit(values: SubmissionFormValues) {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      form.setError(
        "root",
        { message: res.status === 429 ? (data.error ?? "One submission per hour. Try again later.") : (data.error ?? "Submission failed") }
      );
      return;
    }
    form.reset();
    router.push("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. London" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="salaryMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min salary</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={`${currencySymbols[form.getValues("currency") || "USD"]} Min`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salaryMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max salary</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={`${currencySymbols[form.getValues("currency") || "USD"]} Max`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="SGD">SGD (S$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="yearsExp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of experience</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company size</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companySizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmData"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{legal.formCheckboxText}</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting} className="animate-pulse hover:animate-none">
          {form.formState.isSubmitting ? "Submitting…" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
