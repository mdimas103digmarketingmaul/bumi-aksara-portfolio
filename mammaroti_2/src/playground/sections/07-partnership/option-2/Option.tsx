import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function PartnershipOption2() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="07-partnership"
        sectionTitle="Partnership / Franchise"
        optionLabel="Option 2"
        fileHint="src/playground/sections/07-partnership/option-2/Option.tsx"
      />
    </div>
  );
}
