import Link from "next/link";
import { sections } from "../config/sections";
import { PlaygroundShell, playgroundStyles as styles } from "./PlaygroundShell";

export function PlaygroundDashboard() {
  return (
    <PlaygroundShell
      title="Section-by-section exploration."
      lead="Gunakan area ini untuk membuat, membandingkan, dan memilih alternatif visual tanpa menyentuh halaman production."
    >
      <div className={styles.grid}>
        {sections.map((section) => (
          <article className={styles.card} key={section.slug}>
            <div>
              <div className={styles.sectionNumber}>{section.number}</div>
              <h2>{section.title}</h2>
              <p>Status: {section.status}. Selected: {section.selectedOption ?? "belum dipilih"}.</p>
            </div>
            <div className={styles.actions}>
              <Link className={styles.button} href={`/playground/sections/${section.slug}`}>
                Buka section
              </Link>
              <Link className={styles.buttonSecondary} href="/">
                Lihat production
              </Link>
            </div>
          </article>
        ))}

        <article className={styles.card}>
          <div>
            <div className={styles.sectionNumber}>FINAL PHASE</div>
            <h2>Full Page Compositions</h2>
            <p>Gabungkan section terpilih menjadi beberapa alternatif homepage penuh.</p>
          </div>
          <div className={styles.actions}>
            <Link className={styles.button} href="/playground/compositions">
              Buka compositions
            </Link>
          </div>
        </article>
      </div>
    </PlaygroundShell>
  );
}
