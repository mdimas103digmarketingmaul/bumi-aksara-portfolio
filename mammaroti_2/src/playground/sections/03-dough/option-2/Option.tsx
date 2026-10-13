import { OptionFrame } from "../../../components/OptionFrame";
import { doughOrder, doughs } from "../doughData";
import styles from "./styles.module.css";

export function DoughOption2Content() {
  return (
    <section className={styles.section} aria-label="Our Dough — side by side comparison">
      <header className={styles.header}>
        <span className={styles.eyebrow}>TWO DOUGHS · ONE MAMMAROTI</span>
        <h1>Pick your<br />side.</h1>
        <p>Original atau Taro — lihat karakter keduanya dalam satu frame.</p>
      </header>

      <div className={styles.grid}>
        {doughOrder.map((id) => {
          const dough = doughs[id];
          return (
            <article className={`${styles.card} ${styles[id]}`} key={id}>
              <div className={styles.cardHead}>
                <span>{dough.number}</span>
                <span>OUR DOUGH</span>
              </div>

              <div className={styles.imageStage}>
                <span className={styles.ghostTitle} aria-hidden="true">{dough.name}</span>
                <img src={dough.image} alt={`MammaRoti ${dough.name} dengan isian custard`} />
              </div>

              <div className={styles.cardBottom}>
                <h2>{dough.name}</h2>
                <div className={styles.chips} aria-label={`${dough.name} filling choices`}>
                  {dough.fillings.map((filling) => <span key={filling}>{filling}</span>)}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <footer className={styles.footer}>
        <span>ORIGINAL ↔ TARO</span>
        <strong>Which one is yours?</strong>
        <span>03 / 10</span>
      </footer>
    </section>
  );
}

export default function DoughOption2() {
  return (
    <OptionFrame
      sectionSlug="03-dough"
      sectionTitle="Our Dough"
      optionLabel="Option 2 · Dough Diptych"
    >
      <DoughOption2Content />
    </OptionFrame>
  );
}
