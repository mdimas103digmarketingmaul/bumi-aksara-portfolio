import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function OutletsOption2() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="06-outlets"
        sectionTitle="Outlet Kami"
        optionLabel="Option 2"
        fileHint="src/playground/sections/06-outlets/option-2/Option.tsx"
      />
    </div>
  );
}
