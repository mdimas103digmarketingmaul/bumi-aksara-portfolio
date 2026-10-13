import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function CertificationsOption3() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="04-certifications"
        sectionTitle="Certifications"
        optionLabel="Option 3"
        fileHint="src/playground/sections/04-certifications/option-3/Option.tsx"
      />
    </div>
  );
}
