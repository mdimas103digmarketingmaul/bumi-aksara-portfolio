import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function CertificationsOption1() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="04-certifications"
        sectionTitle="Certifications"
        optionLabel="Option 1"
        fileHint="src/playground/sections/04-certifications/option-1/Option.tsx"
      />
    </div>
  );
}
