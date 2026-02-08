export type Submission = {
  id: number;
  role: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  yearsExp: number;
  companySize: string;
  submittedAt: string | Date;
  ipHash: string;
};
