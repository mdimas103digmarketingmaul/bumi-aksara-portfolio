import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function FooterOption3() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="10-footer"
        sectionTitle="Footer"
        optionLabel="Option 3"
        fileHint="src/playground/sections/10-footer/option-3/Option.tsx"
      />
    </div>
  );
}
