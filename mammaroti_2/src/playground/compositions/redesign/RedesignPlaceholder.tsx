import Link from "next/link";
import styles from "./RedesignPlaceholder.module.css";

export function RedesignPlaceholder({ option }: { option: number }) {
  const padded = String(option).padStart(2, "0");

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div>
          <p className={styles.eyebrow}>Alternative UI/UX Redesign · Empty Slot</p>
          <p className={styles.index}>{padded}</p>
          <h1 className={styles.title}>Redesign Option {option}</h1>
          <p className={styles.copy}>
            Slot ini sengaja dibiarkan kosong untuk satu alternatif full-homepage redesign dari AI/model yang berbeda.
            Ketika kandidat sudah siap, implementasinya ditempatkan di slot ini tanpa mengubah production atau opsi redesign lain.
          </p>
        </div>

        <div className={styles.actions}>
          <Link className={styles.button} href="/playground/compositions/redesign">
            All Redesign Options
          </Link>
          <Link className={styles.secondary} href="/">
            Production Baseline
          </Link>
        </div>
      </section>
    </main>
  );
}
