import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function FooterOption1() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="10-footer"
        sectionTitle="Footer"
        optionLabel="Option 1"
        fileHint="src/playground/sections/10-footer/option-1/Option.tsx"
      />
    </div>
  );
}
