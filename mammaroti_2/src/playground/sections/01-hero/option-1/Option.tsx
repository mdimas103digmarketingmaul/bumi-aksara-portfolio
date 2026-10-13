import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function HeroOption1() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="01-hero"
        sectionTitle="Hero"
        optionLabel="Option 1"
        fileHint="src/playground/sections/01-hero/option-1/Option.tsx"
      />
    </div>
  );
}
