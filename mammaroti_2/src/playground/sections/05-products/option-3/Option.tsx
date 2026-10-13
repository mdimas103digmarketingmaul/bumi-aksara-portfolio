import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function ProductsOption3() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="05-products"
        sectionTitle="Produk Lainnya"
        optionLabel="Option 3"
        fileHint="src/playground/sections/05-products/option-3/Option.tsx"
      />
    </div>
  );
}
