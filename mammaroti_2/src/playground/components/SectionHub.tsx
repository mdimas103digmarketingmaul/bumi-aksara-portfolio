import Link from "next/link";
import { getSection } from "../config/sections";
import { PlaygroundShell, playgroundStyles as styles } from "./PlaygroundShell";

export function SectionHub({ slug }: { slug: string }) {
  const section = getSection(slug);

  if (!section) {
    return (
      <PlaygroundShell title="Section tidak ditemukan">
        <p>Periksa slug section di konfigurasi playground.</p>
      </PlaygroundShell>
    );
  }

  const options = ["option-1", "option-2", "option-3", "option-4"] as const;

  return (
    <PlaygroundShell
      eyebrow={`Section ${section.number}`}
      title={section.title}
      lead="Original production tetap aman. Gunakan Option 1–4 sebagai area eksperimen independen."
    >
      <div className={styles.grid}>
        <article className={styles.card}>
          <div>
            <span className={styles.status}>Baseline</span>
            <h2 style={{ marginTop: 14 }}>Original / Production</h2>
            <p>Referensi existing. Tidak diedit dari playground.</p>
          </div>
          <div className={styles.actions}>
            <Link className={styles.buttonSecondary} href="/">
              Buka production
            </Link>
          </div>
        </article>

        {options.map((option, index) => (
          <article className={styles.card} key={option}>
            <div>
              <span className={styles.status}>Exploration</span>
              <h2 style={{ marginTop: 14 }}>Option {index + 1}</h2>
              <p>File option ini terisolasi dan siap direvisi tanpa mengubah option lain.</p>
            </div>
            <div className={styles.actions}>
              <Link className={styles.button} href={`/playground/sections/${section.slug}/${option}`}>
                Preview option {index + 1}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PlaygroundShell>
  );
}
