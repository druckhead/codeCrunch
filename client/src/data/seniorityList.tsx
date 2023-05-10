export interface ISeniority {
  name: string;
  code: string;
}

export const seniorities: ISeniority[] = [
  { name: "Trainee", code: "TR" },
  { name: "Junior", code: "JR" },
  { name: "Middle", code: "MD" },
  { name: "Senior", code: "SR" },
];
