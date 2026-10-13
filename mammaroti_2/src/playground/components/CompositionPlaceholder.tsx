import Link from "next/link";
import { sections } from "../config/sections";
import styles from "./CompositionPlaceholder.module.css";

export function CompositionPlaceholder({
  label,
  strategy,
  order,
}: {
  label: string;
  strategy: string;
  order: string[];
}) {
  const ordered = order
    .map((slug) => sections.find((section) => section.slug === slug))
    .filter(Boolean);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <small>MammaRoti · Full Page Playground</small>
          <h1>{label}</h1>
          <p>{strategy}</p>
        </div>
        <nav>
          <Link href="/playground/compositions">← Compare compositions</Link>
          <Link href="/playground">Dashboard</Link>
        </nav>
      </header>

      <div className={styles.stack}>
        {ordered.map((section, index) => (
          <section className={styles.block} key={section!.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{section!.title}</h2>
            <p>Placeholder — nanti diganti dengan section option yang sudah dipilih.</p>
          </section>
        ))}
      </div>
    </main>
  );
}
