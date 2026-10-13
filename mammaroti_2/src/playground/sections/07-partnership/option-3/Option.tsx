import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function PartnershipOption3() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="07-partnership"
        sectionTitle="Partnership / Franchise"
        optionLabel="Option 3"
        fileHint="src/playground/sections/07-partnership/option-3/Option.tsx"
      />
    </div>
  );
}
