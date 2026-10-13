import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function FooterOption2() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="10-footer"
        sectionTitle="Footer"
        optionLabel="Option 2"
        fileHint="src/playground/sections/10-footer/option-2/Option.tsx"
      />
    </div>
  );
}
