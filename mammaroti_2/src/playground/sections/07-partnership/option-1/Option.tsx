import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function PartnershipOption1() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="07-partnership"
        sectionTitle="Partnership / Franchise"
        optionLabel="Option 1"
        fileHint="src/playground/sections/07-partnership/option-1/Option.tsx"
      />
    </div>
  );
}
