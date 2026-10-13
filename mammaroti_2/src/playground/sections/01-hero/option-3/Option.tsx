import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function HeroOption3() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="01-hero"
        sectionTitle="Hero"
        optionLabel="Option 3"
        fileHint="src/playground/sections/01-hero/option-3/Option.tsx"
      />
    </div>
  );
}
