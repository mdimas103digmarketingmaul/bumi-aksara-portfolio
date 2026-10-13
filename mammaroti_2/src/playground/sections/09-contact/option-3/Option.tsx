import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function ContactOption3() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="09-contact"
        sectionTitle="Kritik, Saran & Pertanyaan"
        optionLabel="Option 3"
        fileHint="src/playground/sections/09-contact/option-3/Option.tsx"
      />
    </div>
  );
}
