export type DoughVariant = "original" | "taro";

export const doughs = {
  original: {
    id: "original" as const,
    number: "01",
    name: "Original",
    image: "/images/original-dough.webp",
    fillings: [
      "Vanilla Custard",
      "Cheese Custard",
      "Chocolate Custard",
      "Banana Custard",
    ],
  },
  taro: {
    id: "taro" as const,
    number: "02",
    name: "Taro",
    image: "/images/taro-dough.webp",
    fillings: ["Vanilla Custard", "Taro Custard", "Rasberry Custard"],
  },
} satisfies Record<DoughVariant, {
  id: DoughVariant;
  number: string;
  name: string;
  image: string;
  fillings: string[];
}>;

export const doughOrder: DoughVariant[] = ["original", "taro"];
