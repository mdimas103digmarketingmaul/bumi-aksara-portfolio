export type RedesignOption = {
  slug: string;
  label: string;
  title: string;
  source: string;
  status: "empty" | "in-progress" | "ready";
};

export const redesignOptions: RedesignOption[] = [
  { slug: "option-1", label: "01", title: "Redesign Option 1", source: "Unassigned AI", status: "empty" },
  { slug: "option-2", label: "02", title: "Redesign Option 2", source: "Unassigned AI", status: "empty" },
  { slug: "option-3", label: "03", title: "Redesign Option 3", source: "Unassigned AI", status: "empty" },
  { slug: "option-4", label: "04", title: "Redesign Option 4", source: "Unassigned AI", status: "empty" },
  { slug: "option-5", label: "05", title: "Redesign Option 5", source: "Unassigned AI", status: "empty" },
  { slug: "option-6", label: "06", title: "Redesign Option 6", source: "Unassigned AI", status: "empty" },
];
