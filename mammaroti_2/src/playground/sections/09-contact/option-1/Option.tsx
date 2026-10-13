import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function ContactOption1() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="09-contact"
        sectionTitle="Kritik, Saran & Pertanyaan"
        optionLabel="Option 1"
        fileHint="src/playground/sections/09-contact/option-1/Option.tsx"
      />
    </div>
  );
}
