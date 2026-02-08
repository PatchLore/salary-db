import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://devsalaries.co";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/browse`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const combos = await db
    .select({
      role: submissions.role,
      location: submissions.location,
    })
    .from(submissions)
    .groupBy(submissions.role, submissions.location);

  const dynamicPages: MetadataRoute.Sitemap = combos.map(({ role, location }) => ({
    url: `${baseUrl}/${encodeURIComponent(role)}/${encodeURIComponent(location)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...dynamicPages];
}
