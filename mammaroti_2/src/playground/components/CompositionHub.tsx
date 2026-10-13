import Link from "next/link";
import { PlaygroundShell, playgroundStyles as styles } from "./PlaygroundShell";

export function CompositionHub() {
  const compositions = [
    ["option-a", "Composition A", "Natural Flow"],
    ["option-b", "Composition B", "Product First"],
    ["option-c", "Composition C", "Conversion Oriented"],
  ];

  return (
    <PlaygroundShell
      eyebrow="Full page comparison"
      title="Compositions"
      lead="Bandingkan dua jenis eksperimen: susunan homepage dari section terpilih, lalu redesign UI/UX independen dari berbagai AI/model. Production di / tetap menjadi baseline utama."
    >
      <section style={{ marginBottom: 56 }}>
        <div style={{ marginBottom: 22 }}>
          <span className={styles.status}>Section assembly</span>
          <h2 style={{ margin: "14px 0 8px" }}>Full Page Compositions</h2>
          <p style={{ margin: 0, maxWidth: 760 }}>
            Sensory Option 3 + Our Dough Option 2 tetap dipakai sebagai input. Perbedaan A/B/C terutama menguji urutan dan ritme full page.
          </p>
        </div>

        <div className={styles.grid}>
          {compositions.map(([slug, title, strategy]) => (
            <article className={styles.card} key={slug}>
              <div>
                <span className={styles.status}>Composition</span>
                <h2 style={{ marginTop: 14 }}>{title}</h2>
                <p>{strategy}</p>
              </div>
              <div className={styles.actions}>
                <Link className={styles.button} href={`/playground/compositions/${slug}`}>
                  Preview
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div style={{ marginBottom: 22 }}>
          <span className={styles.status}>Independent redesign lab</span>
          <h2 style={{ margin: "14px 0 8px" }}>Alternative UI/UX Redesign</h2>
          <p style={{ margin: 0, maxWidth: 760 }}>
            Enam slot kosong untuk kandidat redesign homepage yang dibuat secara independen oleh ChatGPT, Claude, atau model lain.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <div>
              <span className={styles.status}>6 empty slots</span>
              <h2 style={{ marginTop: 14 }}>Redesign Comparison</h2>
              <p>Option 1–6 · masing-masing terisolasi dan dapat berasal dari model AI yang berbeda.</p>
            </div>
            <div className={styles.actions}>
              <Link className={styles.button} href="/playground/compositions/redesign">
                Open Redesign Lab
              </Link>
              <Link className={styles.button} href="/">
                Production Baseline
              </Link>
            </div>
          </article>
        </div>
      </section>
    </PlaygroundShell>
  );
}
