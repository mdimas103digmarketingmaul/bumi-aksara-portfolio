import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function ProductsOption2() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="05-products"
        sectionTitle="Produk Lainnya"
        optionLabel="Option 2"
        fileHint="src/playground/sections/05-products/option-2/Option.tsx"
      />
    </div>
  );
}
