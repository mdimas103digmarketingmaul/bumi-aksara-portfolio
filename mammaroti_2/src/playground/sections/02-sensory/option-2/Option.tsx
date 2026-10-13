import { OptionFrame } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

const senses = [
  ["01", "Crunchy", "Lapisan luar yang renyah saat gigitan pertama."],
  ["02", "Melt", "Bagian dalam lembut dan hangat yang perlahan meleleh."],
  ["03", "Joy", "Aroma kopi yang familiar dan terasa comforting."],
  ["04", "Sweet", "Manis yang pas untuk menemani momen sehari-hari."],
];

export default function SensoryOption2() {
  return (
    <OptionFrame
      sectionSlug="02-sensory"
      sectionTitle="Sensory Experience"
      optionLabel="Option 2 · Editorial Story"
    >
      <section className={styles.section} aria-label="Sensory Experience — Editorial Story">
        <div className={styles.copy}>
          <span className={styles.eyebrow}>SENSORY NOTES</span>
          <h1>What makes<br />a coffeebun<br /><em>feel</em> right?</h1>
          <p className={styles.intro}>
            Bukan hanya soal rasa. Ada tekstur, aroma, kehangatan, dan momen kecil yang membuat satu bun terasa memorable.
          </p>

          <div className={styles.notes}>
            {senses.map(([number, title, text]) => (
              <article className={styles.note} key={title}>
                <span>{number}</span>
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.orangeCard}>
            <span className={styles.verticalText}>MAMMAROTI · EVERYDAY COFFEEBUN</span>
            <img src="/images/split-bun.webp" alt="Coffee bun MammaRoti terbelah" />
          </div>
          <div className={styles.quote}>
            <span>Warm. Familiar. Satisfying.</span>
          </div>
        </div>
      </section>
    </OptionFrame>
  );
}
