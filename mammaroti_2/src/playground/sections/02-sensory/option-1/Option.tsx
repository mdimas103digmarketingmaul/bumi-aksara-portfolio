import { OptionFrame } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

const senses = [
  { label: "Crunchy", className: styles.crunchy },
  { label: "Melt", className: styles.melt },
  { label: "Joy", className: styles.joy },
  { label: "Sweet", className: styles.sweet },
];

export default function SensoryOption1() {
  return (
    <OptionFrame
      sectionSlug="02-sensory"
      sectionTitle="Sensory Experience"
      optionLabel="Option 1 · Brand Evolution"
    >
      <section className={styles.section} aria-label="Sensory Experience — Brand Evolution">
        <div className={`${styles.wheat} ${styles.wheatLeft}`} aria-hidden="true" />
        <div className={`${styles.wheat} ${styles.wheatRight}`} aria-hidden="true" />

        <div className={styles.heading}>
          <span>THE MAMMAROTI EXPERIENCE</span>
          <h1>One bun.<br />Four feelings.</h1>
          <p>Hangat, renyah, lembut, dan manis — pengalaman sederhana yang terasa di setiap gigitan.</p>
        </div>

        <div className={styles.stage}>
          <div className={styles.halo} aria-hidden="true" />
          <img
            className={styles.bun}
            src="/images/split-bun.webp"
            alt="Coffee bun MammaRoti terbelah dengan isian lembut"
          />

          {senses.map((sense) => (
            <div className={`${styles.sense} ${sense.className}`} key={sense.label}>
              <span className={styles.dot} aria-hidden="true" />
              {sense.label}
            </div>
          ))}

          <svg className={styles.lines} viewBox="0 0 1000 650" aria-hidden="true">
            <path d="M280 245 C390 260 405 300 455 325" />
            <path d="M725 245 C620 260 605 300 550 325" />
            <path d="M315 505 C395 445 430 420 475 390" />
            <path d="M705 510 C625 450 590 425 530 392" />
          </svg>
        </div>

        <div className={styles.scrollHint}>Keep scrolling ↓</div>
      </section>
    </OptionFrame>
  );
}
