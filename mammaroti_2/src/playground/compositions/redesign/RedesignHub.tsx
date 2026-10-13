import Link from "next/link";
import { PlaygroundShell, playgroundStyles as styles } from "../../components/PlaygroundShell";
import { redesignOptions } from "./redesignOptions";

export function RedesignHub() {
  return (
    <PlaygroundShell
      eyebrow="Independent AI design experiments"
      title="Alternative UI/UX Redesign"
      lead="Enam slot ini disiapkan untuk redesign full homepage dari model AI yang berbeda. Production tetap menjadi baseline dan setiap opsi harus hidup secara terisolasi agar mudah dibandingkan."
    >
      <div className={styles.grid}>
        {redesignOptions.map((option) => (
          <article className={styles.card} key={option.slug}>
            <div>
              <span className={styles.status}>Empty slot · {option.label}</span>
              <h2 style={{ marginTop: 14 }}>{option.title}</h2>
              <p>{option.source}</p>
            </div>
            <div className={styles.actions}>
              <Link className={styles.button} href={`/playground/compositions/redesign/${option.slug}`}>
                Open Slot
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PlaygroundShell>
  );
}
