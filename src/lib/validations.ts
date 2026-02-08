import { z } from "zod";

export const companySizeOptions = ["1-10", "11-50", "51-200", "200+"] as const;

export const submissionSchema = z.object({
  role: z.string().min(1, "Role is required").max(255),
  location: z.string().min(1, "Location is required").max(255),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "SGD", "AUD", "JPY", "Other"]).default("USD"),
  salaryMin: z.coerce.number().int().min(0, "Min salary must be 0 or more"),
  salaryMax: z.coerce.number().int().min(0, "Max salary must be 0 or more"),
  yearsExp: z.coerce.number().int().min(0, "Years of experience must be 0 or more"),
  companySize: z.enum(companySizeOptions),
  confirmData: z.literal(true, {
    errorMap: () => ({ message: "You must confirm the data permission." }),
  }),
}).refine((data) => data.salaryMax >= data.salaryMin, {
  message: "Max salary must be greater than or equal to min salary",
  path: ["salaryMax"],
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;

export const searchParamsSchema = z.object({
  role: z.string().optional(),
  location: z.string().optional(),
  salaryMin: z.coerce.number().int().min(0).optional(),
  salaryMax: z.coerce.number().int().min(0).optional(),
  yearsExpMin: z.coerce.number().int().min(0).optional(),
  companySize: z.enum(companySizeOptions).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
