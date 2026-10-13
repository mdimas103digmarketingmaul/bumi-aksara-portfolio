import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function NewsOption3() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="08-news"
        sectionTitle="Berita & Acara"
        optionLabel="Option 3"
        fileHint="src/playground/sections/08-news/option-3/Option.tsx"
      />
    </div>
  );
}
