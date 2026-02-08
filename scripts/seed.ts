import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env and .env.local so DATABASE_URL is set when run from CLI
function loadEnv(file: string) {
  try {
    const content = readFileSync(resolve(process.cwd(), file), "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  } catch {
    // ignore missing file
  }
}
loadEnv(".env");
loadEnv(".env.local");

const roles = [
  "Senior React Developer",
  "Junior Python Developer",
  "Full Stack Engineer",
  "DevOps Engineer",
  "Mobile Developer (iOS)",
  "UI/UX Developer",
  "Blockchain Developer",
  "AI/ML Engineer",
  "Backend Developer (Node.js)",
  "Data Engineer",
];

const locations = [
  "London, UK",
  "New York, US",
  "San Francisco, US",
  "Berlin, Germany",
  "Remote",
  "Toronto, Canada",
  "Amsterdam, Netherlands",
  "Singapore",
  "Austin, US",
  "Dublin, Ireland",
];

const companySizes = ["1-10", "11-50", "51-200", "200+"] as const;

async function seed() {
  const { db } = await import("../src/lib/db");
  const { submissions } = await import("../src/lib/schema");

  console.log("Seeding database...");

  const data = [];

  for (let i = 0; i < 50; i++) {
    const role = roles[i % roles.length];
    const location = locations[i % locations.length];
    const yearsExp = Math.floor(Math.random() * 15);

    // Realistic salary based on experience
    let minSalary: number, maxSalary: number;
    if (yearsExp < 2) {
      minSalary = 40000 + Math.random() * 10000;
      maxSalary = minSalary + 20000 + Math.random() * 10000;
    } else if (yearsExp < 5) {
      minSalary = 70000 + Math.random() * 20000;
      maxSalary = minSalary + 30000 + Math.random() * 20000;
    } else if (yearsExp < 10) {
      minSalary = 100000 + Math.random() * 30000;
      maxSalary = minSalary + 40000 + Math.random() * 30000;
    } else {
      minSalary = 150000 + Math.random() * 50000;
      maxSalary = minSalary + 50000 + Math.random() * 50000;
    }

    data.push({
      role,
      location,
      salaryMin: Math.round(minSalary / 1000) * 1000,
      salaryMax: Math.round(maxSalary / 1000) * 1000,
      yearsExp,
      companySize: companySizes[i % companySizes.length],
      ipHash: `seed-${i}-${Date.now()}`,
      submittedAt: new Date(Date.now() - Math.random() * 86400000 * 30), // Last 30 days
    });
  }

  await db.insert(submissions).values(data);
  console.log(`Seeded ${data.length} entries`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
