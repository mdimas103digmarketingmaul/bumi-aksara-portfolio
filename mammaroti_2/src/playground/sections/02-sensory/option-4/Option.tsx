import { OptionFrame } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

const notes = [
  { label: "Crunchy", className: styles.crunchy },
  { label: "Melt", className: styles.melt },
  { label: "Joy", className: styles.joy },
  { label: "Sweet", className: styles.sweet },
];

export default function SensoryOption4() {
  return (
    <OptionFrame
      sectionSlug="02-sensory"
      sectionTitle="Sensory Experience"
      optionLabel="Option 4 · Refined Brand Evolution"
    >
      <section className={styles.section} aria-label="Sensory Experience — refined brand evolution">
        <div className={styles.heading}>
          <span className={styles.eyebrow}>THE MAMMAROTI EXPERIENCE</span>
          <h1>
            One bun.
            <br />
            Four feelings.
          </h1>
          <p>
            Hangat, renyah, lembut, dan manis — pengalaman sederhana yang terasa di
            setiap gigitan.
          </p>
        </div>

        <div className={styles.stage}>
          <div className={`${styles.ring} ${styles.ringOuter}`} aria-hidden="true" />
          <div className={`${styles.ring} ${styles.ringInner}`} aria-hidden="true" />

          <img
            className={styles.bun}
            src="/images/split-bun.webp"
            alt="Coffee bun MammaRoti terbelah dengan isian lembut"
          />

          {notes.map((note) => (
            <div key={note.label} className={`${styles.note} ${note.className}`}>
              <span className={styles.dot} aria-hidden="true" />
              <span>{note.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.scrollHint}>Keep scrolling ↓</div>
      </section>
    </OptionFrame>
  );
}
