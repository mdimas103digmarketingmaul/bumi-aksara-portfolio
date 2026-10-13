export type PlaygroundStatus = "not-started" | "exploring" | "selected" | "keep-original";

export type SectionConfig = {
  slug: string;
  number: string;
  title: string;
  shortName: string;
  status: PlaygroundStatus;
  selectedOption: "original" | "option-1" | "option-2" | "option-3" | "option-4" | null;
};

export const sections: SectionConfig[] = [
  { slug: "01-hero", number: "01", title: "Hero", shortName: "Hero", status: "not-started", selectedOption: null },
  { slug: "02-sensory", number: "02", title: "Sensory Experience", shortName: "Sensory", status: "not-started", selectedOption: null },
  { slug: "03-dough", number: "03", title: "Our Dough", shortName: "Dough", status: "exploring", selectedOption: null },
  { slug: "04-certifications", number: "04", title: "Certifications", shortName: "Certifications", status: "not-started", selectedOption: null },
  { slug: "05-products", number: "05", title: "Produk Lainnya", shortName: "Products", status: "not-started", selectedOption: null },
  { slug: "06-outlets", number: "06", title: "Outlet Kami", shortName: "Outlets", status: "not-started", selectedOption: null },
  { slug: "07-partnership", number: "07", title: "Partnership / Franchise", shortName: "Partnership", status: "not-started", selectedOption: null },
  { slug: "08-news", number: "08", title: "Berita & Acara", shortName: "News", status: "not-started", selectedOption: null },
  { slug: "09-contact", number: "09", title: "Kritik, Saran & Pertanyaan", shortName: "Contact", status: "not-started", selectedOption: null },
  { slug: "10-footer", number: "10", title: "Footer", shortName: "Footer", status: "not-started", selectedOption: null },
];

export function getSection(slug: string) {
  return sections.find((section) => section.slug === slug);
}
