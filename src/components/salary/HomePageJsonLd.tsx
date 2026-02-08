function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://devsalaries.co";
}

type Props = {
  latest?: Array<{
    role: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
  }>;
};

export function HomePageJsonLd({ latest = [] }: Props) {
  const baseUrl = getBaseUrl();
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DevSalaries",
    description: "Anonymous, self-reported developer salary data by role and location.",
    url: baseUrl,
  };
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: latest.length,
    itemListElement: latest.slice(0, 10).map((row, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${row.role} in ${row.location}`,
      description: `Salary range: $${row.salaryMin / 1000}k – $${row.salaryMax / 1000}k`,
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </>
  );
}
