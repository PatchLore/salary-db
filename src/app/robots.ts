import { MetadataRoute } from "next";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://devsalaries.co";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/submit", "/api/"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
