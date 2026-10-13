import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function NewsOption2() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="08-news"
        sectionTitle="Berita & Acara"
        optionLabel="Option 2"
        fileHint="src/playground/sections/08-news/option-2/Option.tsx"
      />
    </div>
  );
}
