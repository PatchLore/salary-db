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

  // Create 10 entries per location, with 5 different roles (2 each)
  locations.forEach((location, locationIndex) => {
    // Pick 5 different roles for this location (cycling through roles array)
    for (let roleIndex = 0; roleIndex < 5; roleIndex++) {
      const role = roles[(locationIndex * 5 + roleIndex) % roles.length];

      // Create 2 entries per role (so 10 total per location)
      for (let duplicate = 0; duplicate < 2; duplicate++) {
        const yearsExp = Math.floor(Math.random() * 15);

        // Salary based on role type and experience
        let baseSalary = 70000;
        if (role.includes("Senior") || role.includes("Staff")) baseSalary = 110000;
        else if (role.includes("Junior")) baseSalary = 45000;
        else if (role.includes("AI") || role.includes("Blockchain")) baseSalary = 95000;
        else if (role.includes("Mobile") || role.includes("DevOps")) baseSalary = 85000;

        const experienceBonus = yearsExp * 5000;
        const randomVariation = Math.random() * 15000;
        const minSalary = baseSalary + experienceBonus + randomVariation;
        const maxSalary = minSalary + 25000 + Math.random() * 20000;

        // Determine currency from location
        let currency = "USD";
        if (location.includes("UK") || location.includes("London")) currency = "GBP";
        else if (location.includes("Germany") || location.includes("Berlin") || location.includes("Amsterdam")) currency = "EUR";
        else if (location.includes("Singapore")) currency = "SGD";
        else if (location.includes("Canada") || location.includes("Toronto")) currency = "CAD";
        else if (location.includes("Australia")) currency = "AUD";
        else if (location.includes("Japan")) currency = "JPY";
        else if (location.includes("Ireland")) currency = "EUR";

        data.push({
          role,
          location,
          currency,
          salaryMin: Math.round(minSalary / 1000) * 1000,
          salaryMax: Math.round(maxSalary / 1000) * 1000,
          yearsExp,
          companySize: companySizes[Math.floor(Math.random() * companySizes.length)],
          ipHash: `seed-${locationIndex}-${roleIndex}-${duplicate}-${Date.now()}`,
          submittedAt: new Date(Date.now() - Math.random() * 86400000 * 30), // Last 30 days
        });
      }
    }
  });

  await db.insert(submissions).values(data);
  console.log(`Seeded ${data.length} entries`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
